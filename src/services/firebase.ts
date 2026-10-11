import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  getDocFromServer,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { CandidateProfile } from '../types/index.js';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);

// Validate Connection to Firestore on startup per Firebase Integration guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore is offline or checking connection.');
    }
  }
}
testConnection();

/**
 * Sanitizes errors and strings in Firebase client operations to prevent any key or token leakage
 */
export function sanitizeClientLog(input: unknown): string {
  if (!input) return '';
  const text = typeof input === 'string' ? input : input instanceof Error ? input.message : JSON.stringify(input);
  return text
    .replace(/key=[a-zA-Z0-9_\-\.]+/gi, 'key=[REDACTED]')
    .replace(/AIza[a-zA-Z0-9_\-]{20,}/gi, '[REDACTED_KEY]')
    .replace(/Bearer\s+[a-zA-Z0-9_\-\.]+/gi, 'Bearer [REDACTED_TOKEN]')
    .replace(/access_token=[a-zA-Z0-9_\-\.]+/gi, 'access_token=[REDACTED]');
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const rawErrorMessage = error instanceof Error ? error.message : String(error);
  const sanitizedMessage = sanitizeClientLog(rawErrorMessage);
  const errInfo: FirestoreErrorInfo = {
    error: sanitizedMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', sanitizedMessage);
  throw new Error(sanitizedMessage);
}

const provider = new GoogleAuthProvider();
// Required scope for sending application emails directly from the user's authentic account
provider.addScope('https://www.googleapis.com/auth/gmail.send');

// In-memory cache for the access token (never stored in localStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string | null } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || null;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-in Error:', sanitizeClientLog(error?.message || error));
    throw new Error(sanitizeClientLog(error?.message || 'Google sign-in encountered an issue'));
  } finally {
    isSigningIn = false;
  }
};

export const emailSignUp = async (
  email: string,
  pass: string,
  fullName: string
): Promise<User> => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user && fullName) {
      await updateProfile(cred.user, { displayName: fullName });
    }
    return cred.user;
  } catch (error: any) {
    console.error('Email sign up failed:', sanitizeClientLog(error?.message || error));
    throw new Error(sanitizeClientLog(error?.message || 'Email sign up failed'));
  }
};

export const emailSignIn = async (email: string, pass: string): Promise<User> => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return cred.user;
  } catch (error: any) {
    console.error('Email sign in failed:', sanitizeClientLog(error?.message || error));
    throw new Error(sanitizeClientLog(error?.message || 'Email sign in failed'));
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Persists the user's candidate profile directly into Firestore under /users/{userId}
 * strictly adhering to security rule validation and blueprint schema.
 */
export async function saveUserProfileToFirestore(
  userId: string,
  profile: CandidateProfile
): Promise<void> {
  const docPath = `users/${userId}`;
  try {
    const safeData = {
      userId,
      email: (profile.email || auth.currentUser?.email || '').slice(0, 100),
      fullName: (profile.full_name || 'Nigerian Professional').slice(0, 100),
      currentTitle: (profile.current_title || 'Software Engineer').slice(0, 100),
      location: (profile.location || 'Lagos, Nigeria (WAT / UTC+1)').slice(0, 100),
      seniorityLevel: profile.seniority_level || 'mid',
      yearsOfExperience: Number(profile.years_of_experience) || 3,
      skills: (profile.parsed_skills || []).slice(0, 50),
      summary: (profile.summary || '').slice(0, 2000),
      achievements: (profile.achievements || []).slice(0, 20),
      healthScore: Number(profile.health_score) || 80,
      healthFeedback: (profile.health_feedback || []).slice(0, 10),
      resumeFilename: (profile.resume_filename || 'Resume.pdf').slice(0, 255),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', userId), safeData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Fetches the user's recorded profile from Firestore
 */
export async function getUserProfileFromFirestore(
  userId: string
): Promise<CandidateProfile | null> {
  const docPath = `users/${userId}`;
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      id: data.userId,
      full_name: data.fullName,
      email: data.email,
      current_title: data.currentTitle,
      location: data.location,
      seniority_level: data.seniorityLevel,
      years_of_experience: data.yearsOfExperience,
      parsed_skills: data.skills || [],
      desired_roles: [data.currentTitle || 'Software Engineer'],
      resume_text: data.summary || '',
      summary: data.summary || '',
      achievements: data.achievements || [],
      health_score: data.healthScore || 80,
      health_feedback: data.healthFeedback || [],
      resume_filename: data.resumeFilename,
      updated_at: data.updatedAt || new Date().toISOString(),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
    return null;
  }
}

/**
 * Records an application dispatched via Gmail or ATS into Firestore subcollection
 */
export async function recordApplicationToFirestore(
  userId: string,
  appRecord: {
    id: string;
    jobId: string;
    jobTitle: string;
    company: string;
    salaryRange?: string;
    locationTag?: string;
    status: 'authorized_sent' | 'applied_manually';
    sentAt: string;
    coverLetter?: string;
  }
): Promise<void> {
  const docPath = `users/${userId}/applications/${appRecord.id}`;
  try {
    const safeApp = {
      id: appRecord.id,
      jobId: appRecord.jobId,
      jobTitle: appRecord.jobTitle.slice(0, 200),
      company: appRecord.company.slice(0, 100),
      salaryRange: (appRecord.salaryRange || 'Competitive USD').slice(0, 100),
      locationTag: (appRecord.locationTag || 'Worldwide').slice(0, 50),
      status: appRecord.status,
      sentAt: appRecord.sentAt || new Date().toISOString(),
      coverLetter: (appRecord.coverLetter || '').slice(0, 5000),
    };
    await setDoc(doc(db, 'users', userId, 'applications', appRecord.id), safeApp);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Fetches user applications recorded in Firestore
 */
export async function getUserApplicationsFromFirestore(userId: string) {
  const colPath = `users/${userId}/applications`;
  try {
    const snap = await getDocs(collection(db, 'users', userId, 'applications'));
    return snap.docs.map((d) => d.data());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, colPath);
    return [];
  }
}

/**
 * Encodes string to base64url format for Gmail API RFC 2822
 */
function toBase64Url(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Dispatches an email message via Gmail API using the authorized bearer token
 */
export async function sendGmailApplication({
  accessToken,
  to,
  userEmail,
  userName,
  subject,
  body,
  resumeAttachmentText,
  resumeFilename = 'Resume.txt',
}: {
  accessToken: string;
  to: string;
  userEmail: string;
  userName: string;
  subject: string;
  body: string;
  resumeAttachmentText?: string;
  resumeFilename?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    let rawMessage = '';

    if (resumeAttachmentText && resumeAttachmentText.trim().length > 0) {
      const boundary = `__afroremote_boundary_${Date.now()}__`;
      rawMessage = [
        `From: "${userName}" <${userEmail}>`,
        `To: ${to}`,
        `Subject: ${subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        ``,
        `--${boundary}`,
        `Content-Type: text/plain; charset=UTF-8`,
        `Content-Transfer-Encoding: 7bit`,
        ``,
        body,
        ``,
        `--${boundary}`,
        `Content-Type: text/plain; charset=UTF-8; name="${resumeFilename}"`,
        `Content-Disposition: attachment; filename="${resumeFilename}"`,
        `Content-Transfer-Encoding: base64`,
        ``,
        btoa(unescape(encodeURIComponent(resumeAttachmentText))),
        ``,
        `--${boundary}--`,
      ].join('\r\n');
    } else {
      rawMessage = [
        `From: "${userName}" <${userEmail}>`,
        `To: ${to}`,
        `Subject: ${subject}`,
        `Content-Type: text/plain; charset=UTF-8`,
        ``,
        body,
      ].join('\r\n');
    }

    const base64Encoded = toBase64Url(rawMessage);

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: base64Encoded }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Failed to send email (${res.status})`);
    }

    const data = await res.json();
    return { success: true, messageId: data.id };
  } catch (err: any) {
    console.error('Error sending application via Gmail API:', sanitizeClientLog(err?.message || err));
    return { success: false, error: sanitizeClientLog(err?.message || 'Failed to send email') };
  }
}
