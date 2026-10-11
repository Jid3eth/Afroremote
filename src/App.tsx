import React, { useState, useEffect } from 'react';
import {
  Search,
  Briefcase,
  Send,
  User as UserIcon,
  Mail,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Globe,
  Zap,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { JobMatch, CandidateProfile } from './types/index.js';
import {
  initAuth,
  googleSignIn,
  logout,
  saveUserProfileToFirestore,
  getUserProfileFromFirestore,
  recordApplicationToFirestore,
  sanitizeClientLog,
} from './services/firebase.js';
import { Header } from './components/Header.tsx';
import { JobCard } from './components/JobCard.tsx';
import { ProfileCard } from './components/ProfileCard.tsx';
import { MatchReviewModal } from './components/MatchReviewModal.tsx';
import { ResumeUploadModal } from './components/ResumeUploadModal.tsx';
import { ResumeEditorModal } from './components/ResumeEditorModal.tsx';
import { DailyDigestModal } from './components/DailyDigestModal.tsx';
import { OnboardingView } from './components/OnboardingView.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { AITrainingSection } from './components/AITrainingSection.tsx';

export default function App() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Onboarding state: defaults to true so user experiences the walkthrough first
  const [showOnboarding, setShowOnboarding] = useState(true);

  // iOS Navigation Tab Bar state: 'matches' | 'applied' | 'profile' | 'digest'
  const [currentTab, setCurrentTab] = useState<'matches' | 'applied' | 'profile' | 'digest'>('matches');

  // Segmented Control filter for matches: 'top' | 'all' | 'worldwide' | 'emea'
  const [segmentFilter, setSegmentFilter] = useState<'top' | 'all' | 'worldwide' | 'emea'>('top');
  const [searchQuery, setSearchQuery] = useState('');
  const [matchesSubTab, setMatchesSubTab] = useState<'remote' | 'ai_training'>('remote');

  // Auth state
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [gmailUserEmail, setGmailUserEmail] = useState<string | null>(null);
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Modals state
  const [selectedMatch, setSelectedMatch] = useState<JobMatch | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDigestOpen, setIsDigestOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Firebase Auth listener with Firestore profile auto-loading
  useEffect(() => {
    const unsubscribe = initAuth(
      async (user, token) => {
        setAuthUser(user);
        setGmailUserEmail(user.email || null);
        setIsGmailConnected(!!token);

        try {
          // Attempt to load existing user profile from Firestore
          const remoteProfile = await getUserProfileFromFirestore(user.uid);
          if (remoteProfile) {
            setProfile(remoteProfile);
            await fetch('/api/profile/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(remoteProfile),
            });
            const mRes = await fetch('/api/matches');
            if (mRes.ok) {
              const mData = await mRes.json();
              if (Array.isArray(mData.matches)) setMatches(mData.matches);
            }
            showToast(`Welcome back! Cloud profile synced from Firestore.`);
          } else if (profile) {
            // First time sign-in: record current profile to Firestore
            await saveUserProfileToFirestore(user.uid, profile);
            showToast(`Profile recorded securely in Firestore.`);
          }
        } catch (err: any) {
          console.warn('Firestore sync note:', sanitizeClientLog(err?.message || err));
        }
      },
      () => {
        setAuthUser(null);
        setGmailUserEmail(null);
        setIsGmailConnected(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // 2. Load initial profile and matches
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        const [profileRes, matchesRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/matches'),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.profile) setProfile(profileData.profile);
        }

        if (matchesRes.ok) {
          const matchesData = await matchesRes.json();
          if (Array.isArray(matchesData.matches)) setMatches(matchesData.matches);
        }
      } catch (err: any) {
        console.error('Failed to load initial data:', sanitizeClientLog(err?.message || err));
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Connect Gmail with official Firebase OAuth pop-up
  const handleConnectGmail = async () => {
    try {
      const res = await googleSignIn();
      if (res?.user) {
        setAuthUser(res.user);
        setGmailUserEmail(res.user.email);
        setIsGmailConnected(true);
        showToast(`Connected to ${res.user.email}! Gmail sending ready.`);

        if (profile) {
          try {
            await saveUserProfileToFirestore(res.user.uid, profile);
          } catch (e: any) {
            console.warn(sanitizeClientLog(e?.message || e));
          }
        }
      }
    } catch (err: any) {
      console.error('Sign-in failed:', sanitizeClientLog(err?.message || err));
      showToast(err.message || 'Could not complete Google Sign-In');
    }
  };

  const handleDisconnectGmail = async () => {
    try {
      await logout();
      setAuthUser(null);
      setGmailUserEmail(null);
      setIsGmailConnected(false);
      showToast('Signed out.');
    } catch (err: any) {
      console.error('Logout error:', sanitizeClientLog(err?.message || err));
    }
  };

  // Save profile from 2-minute builder
  const handleSaveProfile = async (profileData: any): Promise<CandidateProfile> => {
    const res = await fetch('/api/profile/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save profile');
    setProfile(data.profile);
    if (data.matches) setMatches(data.matches);

    // Save to Firestore if user is authenticated
    if (authUser) {
      try {
        await saveUserProfileToFirestore(authUser.uid, data.profile);
      } catch (err: any) {
        console.warn('Firestore profile save warning:', sanitizeClientLog(err?.message || err));
      }
    }

    showToast(`Resume updated! ATS Score: ${data.profile.health_score}/100`);
    return data.profile;
  };

  // Upload custom file directly
  const handleUploadCustom = async (file: File | null, text: string): Promise<CandidateProfile> => {
    let payload: any = {};
    if (file) {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.includes(',') ? result.split(',')[1] : result;
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;
      payload = {
        base64Data,
        mimeType: file.type || 'application/pdf',
        filename: file.name,
      };
    } else {
      payload = { text, filename: 'Pasted_Resume.txt' };
    }

    const res = await fetch('/api/resume/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to upload');
    setProfile(data.profile);
    if (data.matches) setMatches(data.matches);

    // Save to Firestore if user is authenticated
    if (authUser) {
      try {
        await saveUserProfileToFirestore(authUser.uid, data.profile);
      } catch (err: any) {
        console.warn('Firestore upload profile sync warning:', sanitizeClientLog(err?.message || err));
      }
    }

    return data.profile;
  };

  // Generate guide & cover letter on demand for a match
  const handleGenerateGuide = async (jobId: string): Promise<JobMatch | undefined> => {
    try {
      const res = await fetch('/api/jobs/generate-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (data.success && data.match) {
        setMatches((prev) => prev.map((m) => (m.job_id === jobId ? data.match : m)));
        if (selectedMatch && selectedMatch.job_id === jobId) {
          setSelectedMatch(data.match);
        }
        return data.match;
      }
    } catch (err: any) {
      console.error('Error generating guide:', sanitizeClientLog(err?.message || err));
    }
    return undefined;
  };

  // Update match status & persist application into Firestore
  const handleStatusUpdate = async (jobId: string, status: JobMatch['status'], sentAt?: string) => {
    try {
      const res = await fetch('/api/matches/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, status, sentAt }),
      });
      const data = await res.json();
      if (data.success && data.match) {
        setMatches((prev) => prev.map((m) => (m.job_id === jobId ? data.match : m)));
        if (selectedMatch && selectedMatch.job_id === jobId) {
          setSelectedMatch(data.match);
        }

        // Record application to Firestore if logged in
        if (authUser && (status === 'authorized_sent' || status === 'applied_manually')) {
          try {
            await recordApplicationToFirestore(authUser.uid, {
              id: `app_${jobId}_${Date.now()}`,
              jobId,
              jobTitle: data.match.job.title,
              company: data.match.job.company,
              salaryRange: data.match.job.salary_range,
              locationTag: data.match.job.location_tag,
              status,
              sentAt: sentAt || new Date().toISOString(),
              coverLetter: data.match.generated_cover_letter,
            });
          } catch (fireErr: any) {
            console.warn('Firestore application recording note:', sanitizeClientLog(fireErr?.message || fireErr));
          }
        }
      }
    } catch (err: any) {
      console.error('Error updating match status:', sanitizeClientLog(err?.message || err));
    }
  };

  const handleAuthSuccess = async (user: User, isNewUser?: boolean) => {
    setAuthUser(user);
    setGmailUserEmail(user.email || null);
    if (profile) {
      try {
        await saveUserProfileToFirestore(user.uid, profile);
        showToast(isNewUser ? 'Account created! Profile saved to Firestore.' : 'Signed in! Profile synced.');
      } catch (e: any) {
        console.warn('Firestore profile save note:', sanitizeClientLog(e?.message || e));
      }
    }
  };

  // Filtered lists
  const filteredMatches = matches.filter((m) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const txt = `${m.job.title} ${m.job.company} ${m.job.tags.join(' ')}`.toLowerCase();
      if (!txt.includes(q)) return false;
    }
    if (segmentFilter === 'top' && m.similarity_score < 85) return false;
    if (segmentFilter === 'worldwide' && !m.job.location_tag.toLowerCase().includes('worldwide')) return false;
    if (segmentFilter === 'emea' && !m.job.location_tag.toLowerCase().includes('emea')) return false;
    return true;
  });

  const appliedMatches = matches.filter(
    (m) => m.status === 'authorized_sent' || m.status === 'applied_manually'
  );

  // If user is currently in Onboarding walkthrough
  if (showOnboarding) {
    return (
      <>
        <OnboardingView
          onComplete={() => setShowOnboarding(false)}
          onSaveProfile={handleSaveProfile}
          onUploadCustom={handleUploadCustom}
          initialProfile={profile}
          authUser={authUser}
          onOpenAuthModal={() => setIsAuthOpen(true)}
        />
        {isAuthOpen && (
          <AuthModal
            onClose={() => setIsAuthOpen(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-emerald-500/50 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* iOS Minimalist Header */}
      {profile && (
        <Header
          profile={profile}
          authUser={authUser}
          gmailUserEmail={gmailUserEmail}
          isGmailConnected={isGmailConnected}
          onOpenAuthModal={() => setIsAuthOpen(true)}
          onConnectGmail={handleConnectGmail}
          onSignOut={handleDisconnectGmail}
          onOpenOnboarding={() => setShowOnboarding(true)}
        />
      )}

      {/* iPhone Central Viewport */}
      <main className="max-w-md md:max-w-xl lg:max-w-2xl mx-auto px-4 py-4 flex-1 w-full space-y-4">
        {/* TAB 1: JOBS / MATCHES */}
        {currentTab === 'matches' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Primary Mode Switcher: Worldwide Remote vs AI Training */}
            <div className="p-1 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center text-xs">
              <button
                onClick={() => setMatchesSubTab('remote')}
                className={`flex-1 py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  matchesSubTab === 'remote'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Remote Roles ({matches.length})</span>
              </button>
              <button
                onClick={() => setMatchesSubTab('ai_training')}
                className={`flex-1 py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  matchesSubTab === 'ai_training'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>AI Training ($18–$50/hr)</span>
              </button>
            </div>

            {/* SUB-VIEW 1: REGULAR REMOTE ROLES */}
            {matchesSubTab === 'remote' ? (
              <div className="space-y-4">
                {/* iOS Segmented Control */}
                <div className="p-1 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex items-center text-xs">
                  <button
                    onClick={() => setSegmentFilter('top')}
                    className={`flex-1 py-1.5 rounded-xl font-bold transition ${
                      segmentFilter === 'top'
                        ? 'bg-zinc-800 text-white shadow'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Top 85%+
                  </button>
                  <button
                    onClick={() => setSegmentFilter('all')}
                    className={`flex-1 py-1.5 rounded-xl font-bold transition ${
                      segmentFilter === 'all'
                        ? 'bg-zinc-800 text-white shadow'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    All ({matches.length})
                  </button>
                  <button
                    onClick={() => setSegmentFilter('worldwide')}
                    className={`flex-1 py-1.5 rounded-xl font-bold transition ${
                      segmentFilter === 'worldwide'
                        ? 'bg-zinc-800 text-white shadow'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Worldwide
                  </button>
                  <button
                    onClick={() => setSegmentFilter('emea')}
                    className={`flex-1 py-1.5 rounded-xl font-bold transition ${
                      segmentFilter === 'emea'
                        ? 'bg-zinc-800 text-white shadow'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    EMEA
                  </button>
                </div>

                {/* Clean Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search roles or stack (e.g. React, Go, AWS)..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Matches List */}
                {isLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-zinc-400 font-medium">Loading verified remote roles...</p>
                  </div>
                ) : filteredMatches.length === 0 ? (
                  <div className="py-16 text-center p-6 rounded-3xl bg-zinc-900 border border-zinc-800">
                    <p className="text-sm font-bold text-white">No jobs in this category</p>
                    <p className="text-xs text-zinc-400 mt-1">Try tapping 'All' above to see every role.</p>
                    <button
                      onClick={() => {
                        setSegmentFilter('all');
                        setSearchQuery('');
                      }}
                      className="mt-3 px-4 py-1.5 rounded-xl bg-zinc-800 text-xs font-bold text-emerald-400"
                    >
                      Show All Roles
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredMatches.map((m) => (
                      <JobCard
                        key={m.id}
                        match={m}
                        onReview={(match) => setSelectedMatch(match)}
                      />
                    ))}

                    {/* AI Training Highlight Banner at bottom */}
                    <div
                      onClick={() => setMatchesSubTab('ai_training')}
                      className="p-4 rounded-3xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-500/30 hover:border-purple-400/60 cursor-pointer transition text-white space-y-2 mt-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-purple-400" />
                          <span>Immediate Hourly USD Opportunities</span>
                        </span>
                        <span className="text-[11px] font-bold text-purple-400 flex items-center gap-1">
                          <span>Explore →</span>
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 font-medium">
                        Looking for fast weekly income? Browse <strong className="text-white">AI Training & RLHF roles</strong> paying $18–$50/hr USD with payouts to Geegpay/Deel.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* SUB-VIEW 2: AI TRAINING & RLHF SECTION */
              <AITrainingSection profile={profile} />
            )}
          </div>
        )}

        {/* TAB 2: APPLIED / SENT APPLICATIONS */}
        {currentTab === 'applied' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Sent Applications</h2>
                <p className="text-xs text-zinc-400">Applications sent via Gmail or applied on ATS</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {appliedMatches.length} Total
              </span>
            </div>

            {appliedMatches.length === 0 ? (
              <div className="py-16 text-center p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-2">
                <Send className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-sm font-bold text-white">No applications dispatched yet</p>
                <p className="text-xs text-zinc-400">
                  Select any matched job and tap "Authorize & Send via Gmail" to dispatch directly from your inbox.
                </p>
                <button
                  onClick={() => setCurrentTab('matches')}
                  className="mt-2 px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold"
                >
                  Browse Matches
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {appliedMatches.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMatch(m)}
                    className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer space-y-2 text-white transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold">{m.job.title}</h4>
                        <p className="text-xs text-zinc-400">{m.job.company} · {m.job.location_tag}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {m.similarity_score}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[11px]">
                      {m.status === 'authorized_sent' ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Sent from your Gmail</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-blue-400 font-semibold">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Applied on ATS Portal</span>
                        </span>
                      )}
                      <span className="text-zinc-500">Tap to view details</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE & RESUME BUILDER */}
        {currentTab === 'profile' && profile && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <ProfileCard
              profile={profile}
              authUser={authUser}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenEditor={() => setIsEditorOpen(true)}
              onOpenAuthModal={() => setIsAuthOpen(true)}
            />
          </div>
        )}

        {/* TAB 4: DAILY DIGEST */}
        {currentTab === 'digest' && profile && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 text-white space-y-4">
              <div>
                <h2 className="text-lg font-bold">Daily Match Digest</h2>
                <p className="text-xs text-zinc-400">
                  Curated worldwide remote jobs delivered directly to your verified inbox every morning.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800 space-y-3">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Top 3 Nigeria-Friendly Matches Today
                </div>
                {matches.slice(0, 3).map((m, i) => (
                  <div key={i} className="flex items-center justify-between text-xs border-b border-zinc-800/80 pb-2 last:border-0 last:pb-0">
                    <div>
                      <div className="font-bold text-white">{m.job.title}</div>
                      <div className="text-[11px] text-zinc-400">{m.job.company} · {m.job.salary_range}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {m.similarity_score}%
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsDigestOpen(true)}
                className="w-full py-3 rounded-2xl bg-emerald-500 text-black font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Open Full Email Preview & Send Test</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* iOS Fixed Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-2xl border-t border-zinc-800">
        <div className="max-w-md md:max-w-xl lg:max-w-2xl mx-auto flex items-center justify-around h-16 px-4">
          <button
            onClick={() => setCurrentTab('matches')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentTab === 'matches' ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-[10px]">Matches</span>
          </button>

          <button
            onClick={() => setCurrentTab('applied')}
            className={`flex flex-col items-center gap-1 transition-colors relative ${
              currentTab === 'applied' ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Send className="w-5 h-5" />
            <span className="text-[10px]">Applied</span>
            {appliedMatches.length > 0 && (
              <span className="absolute -top-1 right-2 w-4 h-4 rounded-full bg-emerald-500 text-black text-[9px] font-black flex items-center justify-center">
                {appliedMatches.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentTab === 'profile' ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px]">Profile</span>
          </button>

          <button
            onClick={() => setCurrentTab('digest')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentTab === 'digest' ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Mail className="w-5 h-5" />
            <span className="text-[10px]">Digest</span>
          </button>
        </div>
      </nav>

      {/* Auth Modal */}
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Human-in-the-Loop Match Review & Dispatch Modal */}
      {selectedMatch && profile && (
        <MatchReviewModal
          match={selectedMatch}
          profile={profile}
          isGmailConnected={isGmailConnected}
          gmailUserEmail={gmailUserEmail}
          onConnectGmail={handleConnectGmail}
          onClose={() => setSelectedMatch(null)}
          onStatusUpdate={handleStatusUpdate}
          onGenerateGuide={handleGenerateGuide}
        />
      )}

      {/* 2-Minute Resume Builder & Editor Modal */}
      {isEditorOpen && (
        <ResumeEditorModal
          initialProfile={profile}
          onClose={() => setIsEditorOpen(false)}
          onSaveSuccess={(updated) => {
            setProfile(updated);
            if (authUser) {
              saveUserProfileToFirestore(authUser.uid, updated).catch(console.warn);
            }
            fetch('/api/matches')
              .then((r) => r.json())
              .then((d) => {
                if (d.matches) setMatches(d.matches);
              });
            showToast(`Resume updated! ATS Score: ${updated.health_score}/100`);
          }}
        />
      )}

      {/* Resume Upload Modal */}
      {isUploadOpen && (
        <ResumeUploadModal
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={(updatedProfile) => {
            setProfile(updatedProfile);
            if (authUser) {
              saveUserProfileToFirestore(authUser.uid, updatedProfile).catch(console.warn);
            }
            fetch('/api/matches')
              .then((r) => r.json())
              .then((d) => {
                if (d.matches) setMatches(d.matches);
              });
            showToast(`Resume parsed! ATS score: ${updatedProfile.health_score}/100`);
          }}
          onOpenEditor={() => {
            setIsUploadOpen(false);
            setIsEditorOpen(true);
          }}
        />
      )}

      {/* Daily Digest Modal */}
      {isDigestOpen && profile && (
        <DailyDigestModal
          onClose={() => setIsDigestOpen(false)}
          matches={matches}
          profile={profile}
          isGmailConnected={isGmailConnected}
          gmailUserEmail={gmailUserEmail}
          onConnectGmail={handleConnectGmail}
        />
      )}
    </div>
  );
}
