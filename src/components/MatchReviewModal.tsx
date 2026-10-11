import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  ExternalLink,
  Sparkles,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  Copy,
  Check,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JobMatch, CandidateProfile } from '../types/index.js';
import { sendGmailApplication } from '../services/firebase.js';

interface MatchReviewModalProps {
  match: JobMatch | null;
  profile: CandidateProfile;
  isGmailConnected: boolean;
  gmailUserEmail: string | null;
  onConnectGmail: () => void;
  onClose: () => void;
  onStatusUpdate: (jobId: string, status: JobMatch['status'], sentAt?: string) => void;
  onGenerateGuide: (jobId: string) => Promise<JobMatch | undefined>;
}

export const MatchReviewModal: React.FC<MatchReviewModalProps> = ({
  match,
  profile,
  isGmailConnected,
  gmailUserEmail,
  onConnectGmail,
  onClose,
  onStatusUpdate,
  onGenerateGuide,
}) => {
  if (!match) return null;

  const { job } = match;

  const [activeTab, setActiveTab] = useState<'cover_letter' | 'nigeria_guide' | 'checklist'>('cover_letter');
  const [coverLetterText, setCoverLetterText] = useState(match.generated_cover_letter || '');
  const [subjectText, setSubjectText] = useState(
    `Application: ${job.title} — ${profile.full_name}`
  );
  const [isCopied, setIsCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmSendDialog, setShowConfirmSendDialog] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);
  const [sendErrorMessage, setSendErrorMessage] = useState<string | null>(null);

  // Load or generate guide and cover letter if not present
  useEffect(() => {
    if (!match.generated_cover_letter || !match.application_guide) {
      setIsGenerating(true);
      onGenerateGuide(match.job_id)
        .then((updated) => {
          if (updated?.generated_cover_letter) {
            setCoverLetterText(updated.generated_cover_letter);
          }
        })
        .finally(() => setIsGenerating(false));
    } else {
      setCoverLetterText(match.generated_cover_letter);
    }
  }, [match.job_id]);

  const wordCount = coverLetterText.trim().split(/\s+/).filter(Boolean).length;
  const guide = match.application_guide;

  // Copy cover letter helper
  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetterText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Dispatch email via connected Gmail API
  const handleDispatchEmail = async () => {
    setShowConfirmSendDialog(false);
    setIsSending(true);
    setSendErrorMessage(null);
    setSendSuccessMessage(null);

    try {
      const { getAccessToken } = await import('../services/firebase.js');
      const token = await getAccessToken();

      if (!token) {
        throw new Error('No active Gmail authorization token found. Please reconnect Gmail.');
      }

      const senderEmail = gmailUserEmail || profile.email;
      const targetEmail = job.hiring_email || 'careers@example.com';

      const result = await sendGmailApplication({
        accessToken: token,
        to: targetEmail,
        userEmail: senderEmail,
        userName: profile.full_name,
        subject: subjectText,
        body: coverLetterText,
        resumeAttachmentText: profile.resume_text,
        resumeFilename: profile.resume_filename || 'Resume.pdf',
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to dispatch email');
      }

      // Celebrate with confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      const now = new Date().toISOString();
      setSendSuccessMessage(
        `Application dispatched directly from your Gmail account to ${targetEmail} (ID: ${result.messageId}). Responses will arrive in your authentic inbox!`
      );
      onStatusUpdate(job.id, 'authorized_sent', now);
    } catch (err: any) {
      console.error('Dispatch error:', err);
      setSendErrorMessage(err.message || 'Failed to send application. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Open ATS application portal & copy cover letter
  const handleApplyViaPortal = () => {
    handleCopy();
    onStatusUpdate(job.id, 'applied_manually', new Date().toISOString());
    window.open(job.source_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[94vh] sm:h-auto sm:max-h-[92vh] text-white">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/90 flex items-start justify-between gap-3 sm:gap-4 shrink-0">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            {job.company_logo ? (
              <img
                src={job.company_logo}
                alt={job.company}
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-base sm:text-lg text-slate-300 shrink-0">
                {job.company.charAt(0)}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
                <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  {match.similarity_score}% AI Match
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {job.location_tag} • Nigeria Eligible
                </span>
                <span className="text-[11px] sm:text-xs text-emerald-400 font-semibold">{job.salary_range}</span>
              </div>
              <h2 className="text-base sm:text-2xl font-black text-white truncate">{job.title}</h2>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                {job.company} • {job.company_base_country || 'Worldwide'} • {job.company_timezone || 'Flexible'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation - Scrollable horizontally on mobile */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-2.5 sm:pt-3 border-b border-slate-800 bg-slate-950/40 overflow-x-auto whitespace-nowrap shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('cover_letter')}
            className={`pb-2.5 sm:pb-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center gap-1.5 sm:gap-2 shrink-0 ${
              activeTab === 'cover_letter'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>AI Cover Letter</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              {wordCount}w
            </span>
          </button>

          <button
            onClick={() => setActiveTab('nigeria_guide')}
            className={`pb-2.5 sm:pb-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center gap-1.5 sm:gap-2 shrink-0 ${
              activeTab === 'nigeria_guide'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>WAT Overlap & Contractor Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-2.5 sm:pb-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center gap-1.5 sm:gap-2 shrink-0 ${
              activeTab === 'checklist'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Checklist</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {isGenerating ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
              <p className="text-sm font-semibold text-slate-200">
                Analyzing resume achievements & crafting custom WAT strategic guide...
              </p>
              <p className="text-xs text-slate-400">
                Mapping your quantifiable projects to {job.company}'s requirements.
              </p>
            </div>
          ) : (
            <>
              {/* Tab 1: Cover Letter */}
              {activeTab === 'cover_letter' && (
                <div className="space-y-3 sm:space-y-4">
                  {job.application_type === 'email' && (
                    <div className="space-y-1">
                      <label className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Email Subject Line
                      </label>
                      <input
                        type="text"
                        value={subjectText}
                        onChange={(e) => setSubjectText(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-medium focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tailored Cover Letter (Editable)</span>
                      </label>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={wordCount > 250 ? 'text-rose-400' : 'text-slate-400'}>
                          {wordCount}/250 words
                        </span>
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={9}
                      value={coverLetterText}
                      onChange={(e) => setCoverLetterText(e.target.value)}
                      placeholder="Generating tailored cover letter..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Built for Remote Trust:</strong> Emphasizes your quantifiable achievements,
                      West Africa Time (WAT) overlap, and reliable remote setup.
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Nigeria Guide */}
              {activeTab === 'nigeria_guide' && guide && (
                <div className="space-y-4 sm:space-y-5">
                  {/* Timezone Analysis Card */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-400">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>Timezone Overlap Analysis (WAT / UTC+1)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs text-slate-300 pt-1">
                      <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-slate-400">Company Base Timezone:</div>
                        <div className="font-semibold text-white mt-0.5">{guide.timezone_analysis.company_timezone}</div>
                      </div>
                      <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-slate-400">Synchronous Overlap Window:</div>
                        <div className="font-semibold text-emerald-300 mt-0.5">{guide.timezone_analysis.overlap_window}</div>
                      </div>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-400 mt-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      🎯 <strong className="text-slate-300">Async Cadence:</strong> {guide.timezone_analysis.async_recommendation}
                    </p>
                  </div>

                  {/* Contractor & Financial Setup Card */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-teal-400">
                      <DollarSign className="w-4 h-4 shrink-0" />
                      <span>Contractor, Form W-8BEN & USD Payment Setup</span>
                    </div>

                    <div className="text-xs text-slate-300 p-2.5 sm:p-3 rounded-lg bg-slate-900 border border-slate-800 leading-relaxed">
                      <span className="font-bold text-white">US Tax Compliance (Form W-8BEN): </span>
                      {guide.contractor_financial_setup.w8ben_guidance}
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-400">Recommended Payment Channels:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        {guide.contractor_financial_setup.payment_options.map((opt, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                            <div className="font-bold text-white text-[12px] sm:text-[13px]">{opt.provider}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{opt.description}</div>
                            <div className="text-[10px] text-emerald-400 mt-1 font-semibold">{opt.recommended_for}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] sm:text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      📝 <strong className="text-slate-300">Invoicing Strategy:</strong> {guide.contractor_financial_setup.invoicing_tip}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Checklist */}
              {activeTab === 'checklist' && guide && (
                <div className="space-y-4">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-400">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>3-Point Pre-Submission Checklist</span>
                    </div>
                    <div className="space-y-2">
                      {guide.application_checklist.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center font-bold text-xs text-emerald-400 shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Status messages */}
              {sendSuccessMessage && (
                <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-xs text-emerald-300 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>{sendSuccessMessage}</div>
                </div>
              )}

              {sendErrorMessage && (
                <div className="p-3 sm:p-3.5 rounded-xl bg-rose-950/90 border border-rose-500/50 text-xs text-rose-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>{sendErrorMessage}</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions - Responsive stack on mobile */}
        <div className="p-3.5 sm:p-5 border-t border-slate-800 bg-slate-900/95 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] sm:text-xs text-slate-400 text-center sm:text-left truncate">
            {job.application_type === 'email' ? (
              <span>Target: <strong className="text-slate-200">{job.hiring_email || 'Hiring Team'}</strong></span>
            ) : (
              <span>Apply via: <strong className="text-slate-200">{job.company} Career Portal</strong></span>
            )}
          </div>

          <div className="flex flex-col-reverse xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition text-center"
            >
              Close
            </button>

            {job.application_type === 'email' ? (
              isGmailConnected ? (
                <button
                  onClick={() => setShowConfirmSendDialog(true)}
                  disabled={isSending || isGenerating}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? 'Sending from Gmail...' : 'Authorize & Send via Gmail'}</span>
                </button>
              ) : (
                <button
                  onClick={onConnectGmail}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow transition"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Connect Gmail to Send</span>
                </button>
              )
            ) : (
              <button
                onClick={handleApplyViaPortal}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white text-xs font-bold shadow-lg shadow-teal-900/40 transition"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Copy Cover Letter & Open ATS Portal</span>
              </button>
            )}
          </div>
        </div>

        {/* Confirmation Dialog for Gmail Sending */}
        {showConfirmSendDialog && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">Confirm Direct Gmail Dispatch</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400">Authentic application from your inbox</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 leading-relaxed">
                This email will be dispatched directly from your Gmail account (
                <strong className="text-emerald-300 font-mono">{gmailUserEmail || profile.email}</strong>).
                The hiring manager at <strong className="text-white">{job.company}</strong> will receive your authentic email,
                and all replies will go straight to your personal inbox.
              </div>

              <div className="space-y-1 text-xs text-slate-400 bg-slate-950/60 p-2.5 sm:p-3 rounded-xl border border-slate-800">
                <div className="truncate">• <strong className="text-slate-300">Recipient:</strong> {job.hiring_email}</div>
                <div className="truncate">• <strong className="text-slate-300">Subject:</strong> {subjectText}</div>
                <div className="truncate">• <strong className="text-slate-300">Attachment:</strong> {profile.resume_filename || 'Resume'}</div>
              </div>

              <div className="flex items-center justify-end gap-2 sm:gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmSendDialog(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDispatchEmail}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Authorize & Send Now</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
