import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle, Copy, Check, Clock } from 'lucide-react';
import { JobMatch, CandidateProfile } from '../types/index.js';
import { sendGmailApplication } from '../services/firebase.js';

interface DailyDigestModalProps {
  onClose: () => void;
  matches: JobMatch[];
  profile: CandidateProfile;
  isGmailConnected: boolean;
  gmailUserEmail: string | null;
  onConnectGmail: () => void;
}

export const DailyDigestModal: React.FC<DailyDigestModalProps> = ({
  onClose,
  matches,
  profile,
  isGmailConnected,
  gmailUserEmail,
  onConnectGmail,
}) => {
  const topMatches = matches.slice(0, 3);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const subject = `🎯 AfroRemote Daily Digest: ${topMatches.length} Top Worldwide Roles for Nigerian Tech Talent`;

  const handleCopyDigest = () => {
    const textContent = `
AFROREMOTE DAILY DIGEST
Target: Nigerian Tech Professionals | Timezone: WAT (UTC+1)
Candidate: ${profile.full_name} (${profile.current_title})

TOP MATCHED WORLDWIDE & EMEA ROLES:
${topMatches
  .map(
    (m, i) => `
${i + 1}. ${m.job.title} @ ${m.job.company}
   Match Score: ${m.similarity_score}%
   Location: ${m.job.location_tag} (Zero US/EU W2 restrictions)
   Compensation: ${m.job.salary_range}
   WAT Overlap: 1:00 PM – 6:00 PM WAT
   Application URL: ${m.job.source_url}
`
  )
  .join('\n')}

CONTRACTOR & PAYMENT GUIDANCE:
- Form W-8BEN: Submit to exempt US withholding tax (0% rate).
- Payment Routing: Deel, Geegpay, or direct USD Domiciliary Bank Account.
    `.trim();

    navigator.clipboard.writeText(textContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendToGmail = async () => {
    setIsSendingTest(true);
    setSendStatus(null);
    try {
      const { getAccessToken } = await import('../services/firebase.js');
      const token = await getAccessToken();

      if (!token) {
        throw new Error('Please connect your Gmail first.');
      }

      const emailBody = `
Hello ${profile.full_name},

Here is your AfroRemote daily verified job digest curated specifically for candidates based in Nigeria:

${topMatches
  .map(
    (m, idx) => `
${idx + 1}. ${m.job.title} — ${m.job.company}
• Match Score: ${m.similarity_score}%
• Location Eligibility: ${m.job.location_tag} (Verified open to Nigeria)
• Compensation: ${m.job.salary_range}
• Timezone: ${m.job.company_timezone || 'WAT Friendly'}
• Apply Link: ${m.job.source_url}
`
  )
  .join('\n\n')}

-------------------------
REMOTE CONTRACTOR TIP:
Ensure you have your Form W-8BEN details ready and review payment routing via Geegpay or local USD Domiciliary Account.

Best regards,
AfroRemote Team
https://afroremote.app
      `.trim();

      const result = await sendGmailApplication({
        accessToken: token,
        to: gmailUserEmail || profile.email,
        userEmail: gmailUserEmail || profile.email,
        userName: 'AfroRemote Digest',
        subject: subject,
        body: emailBody,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to dispatch email');
      }

      setSendStatus(`Digest successfully sent to your inbox: ${gmailUserEmail || profile.email}!`);
    } catch (err: any) {
      setSendStatus(`Error: ${err.message}`);
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 text-white space-y-4 sm:space-y-5 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Daily Match Digest Preview</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Automated notification delivering top Nigeria-eligible roles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Container preview */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 sm:p-5 space-y-3 sm:space-y-4">
          <div className="border-b border-slate-800 pb-2.5 sm:pb-3 space-y-1 text-xs">
            <div className="text-slate-400 truncate">
              <strong className="text-slate-300">Subject:</strong> {subject}
            </div>
            <div className="text-slate-400 truncate">
              <strong className="text-slate-300">To:</strong> {gmailUserEmail || profile.email}
            </div>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            <div className="text-[11px] sm:text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Today's Top 3 Matches (West Africa Time Friendly)
            </div>

            {topMatches.map((m, idx) => (
              <div key={idx} className="p-3 sm:p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">{m.job.title}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 shrink-0">
                    {m.similarity_score}% Match
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-400 flex-wrap">
                  <span className="font-semibold text-slate-200">{m.job.company}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{m.job.salary_range}</span>
                  <span>•</span>
                  <span>{m.job.location_tag}</span>
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
                  <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">WAT Overlap: 1:00 PM – 6:00 PM (5 hours sync)</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] sm:text-xs text-slate-400 leading-relaxed">
            💡 <strong className="text-slate-300">Contractor Note:</strong> Form W-8BEN instructions and Geegpay/Deel banking setup are attached to each recommendation.
          </div>
        </div>

        {sendStatus && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              sendStatus.startsWith('Error')
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
            }`}
          >
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{sendStatus}</span>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-between gap-2 sm:gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={handleCopyDigest}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <div className="flex items-stretch xs:items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition text-center"
            >
              Close
            </button>
            {isGmailConnected ? (
              <button
                onClick={handleSendToGmail}
                disabled={isSendingTest}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingTest ? 'Sending...' : 'Send Test to Gmail'}</span>
              </button>
            ) : (
              <button
                onClick={onConnectGmail}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow transition"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>Connect Gmail</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
