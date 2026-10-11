import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Clock,
  Send,
  Upload,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  FileText,
  Cpu,
  Check,
  Edit3,
  ChevronLeft,
} from 'lucide-react';
import { CandidateProfile } from '../types/index.js';

interface OnboardingViewProps {
  onComplete: () => void;
  onSaveProfile: (profileData: any) => Promise<CandidateProfile>;
  onUploadCustom: (file: File | null, text: string) => Promise<CandidateProfile>;
  initialProfile: CandidateProfile | null;
  authUser?: any;
  onOpenAuthModal?: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onComplete,
  onSaveProfile,
  onUploadCustom,
  initialProfile,
  authUser,
  onOpenAuthModal,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Quick 2-Minute Resume Builder mode in Step 2
  const [showQuickBuilder, setShowQuickBuilder] = useState(false);

  // Quick Builder Form State
  const [builderFullName, setBuilderFullName] = useState(initialProfile?.full_name || '');
  const [builderTitle, setBuilderTitle] = useState(initialProfile?.current_title || 'Senior Software Engineer');
  const [builderLocation, setBuilderLocation] = useState(initialProfile?.location || 'Lagos, Nigeria (WAT / UTC+1)');
  const [builderSeniority, setBuilderSeniority] = useState<'junior' | 'mid' | 'senior' | 'lead'>('senior');
  const [builderYears, setBuilderYears] = useState('5');
  const [builderSkills, setBuilderSkills] = useState('TypeScript, React, Node.js, PostgreSQL, Docker, AWS');
  const [builderSummary, setBuilderSummary] = useState(
    'Software engineer with 5+ years building scalable web services and asynchronous microservices. Dedicated high-speed fiber connection and solar inverter power in Nigeria.'
  );
  const [builderAchievements, setBuilderAchievements] = useState(
    'Architected core payment processing services handling $2M+ monthly transaction volume.\nReduced API response latency by 35% through Redis caching and PostgreSQL query optimization.'
  );

  // Live Matching Simulation State for Step 3
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [pipelineStage, setPipelineStage] = useState(0);

  const pipelineStages = [
    {
      title: 'Parsing Resume & Technical Stack',
      desc: 'Gemini AI extracts tech stack, seniority tier, and quantifiable achievements',
      icon: FileText,
      detail: `Detected: ${builderSkills.split(',').slice(0, 4).join(', ')}`,
    },
    {
      title: 'Generating 1536-Dim Vector Embeddings',
      desc: 'Computing semantic candidate profile embedding via gemini-embedding-2',
      icon: Cpu,
      detail: 'Profile vector calculated. Normalizing cosine multidimensional weights...',
    },
    {
      title: 'Filtering Worldwide & Nigeria Eligibility',
      desc: 'Strictly eliminating US-only, W-2 only, and location-restricted postings',
      icon: ShieldCheck,
      detail: 'Verified roles open to Nigerian contractors with USD pay ($110k-$165k/yr)',
    },
    {
      title: 'West Africa Time (WAT / UTC+1) Alignment',
      desc: 'Calculating synchronous overlap with UK, EU, and US East Coast teams',
      icon: Clock,
      detail: 'Optimal window: 1:00 PM – 6:00 PM WAT (5+ hours direct overlap daily)',
    },
    {
      title: 'Ranking Matches & Prepping Direct Outreach',
      desc: 'Personalizing AI cover letters and contractor compliance guides',
      icon: Sparkles,
      detail: 'Buffer (96%), GitLab (93%), Canonical (91%), Automattic (89%)',
    },
  ];

  // Run the live matching animation when reaching Step 3
  useEffect(() => {
    if (currentStep === 3) {
      setPipelineProgress(5);
      setPipelineStage(0);

      const interval = setInterval(() => {
        setPipelineProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const next = prev + 3;
          if (next >= 85) setPipelineStage(4);
          else if (next >= 65) setPipelineStage(3);
          else if (next >= 45) setPipelineStage(2);
          else if (next >= 25) setPipelineStage(1);
          return next;
        });
      }, 90);

      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // Proceed with file upload or quick builder
  const handleProceedFromStep2 = async () => {
    setIsUploading(true);
    try {
      if (customFile) {
        await onUploadCustom(customFile, '');
      } else {
        // Save using quick builder data
        await onSaveProfile({
          full_name: builderFullName || 'Nigerian Professional',
          current_title: builderTitle || 'Software Engineer',
          location: builderLocation || 'Lagos, Nigeria',
          seniority_level: builderSeniority,
          years_of_experience: Number(builderYears) || 5,
          parsed_skills: builderSkills.split(',').map((s) => s.trim()).filter(Boolean),
          summary: builderSummary,
          achievements: builderAchievements.split('\n').map((a) => a.trim()).filter(Boolean),
        });
      }
      setCurrentStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // Back navigation handler:
  // When inside the 2-minute resume builder, go back to the upload or build page.
  // When on the upload or build page, go back to step 1 (first onboarding page).
  // When on step 3 matching page, go back to step 2.
  const handleBack = () => {
    if (showQuickBuilder) {
      setShowQuickBuilder(false);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-emerald-500/30">
      {/* Top iOS Navigation Bar */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between pt-2 pb-4">
        <div className="flex items-center gap-2">
          {(currentStep > 1 || showQuickBuilder) && (
            <button
              type="button"
              onClick={handleBack}
              className="p-1.5 -ml-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition flex items-center gap-0.5 text-xs font-semibold mr-0.5"
              title="Back"
            >
              <ChevronLeft className="w-4 h-4 text-zinc-400" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-sm text-black shadow-md">
            AR
          </div>
          <span className="font-bold text-base tracking-tight text-white">AfroRemote</span>
        </div>

        {/* Right side: Step Indicator Pill & Account */}
        <div className="flex items-center gap-2">
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition"
            >
              {authUser ? (
                <span className="text-emerald-400 font-bold">✓ Cloud Synced</span>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          )}

          {/* Step Indicator Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400">
            <span>Step {currentStep} of 3</span>
            <div className="flex items-center gap-1 ml-1">
              <span className={`w-1.5 h-1.5 rounded-full ${currentStep >= 1 ? 'bg-emerald-400' : 'bg-zinc-700'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${currentStep >= 2 ? 'bg-emerald-400' : 'bg-zinc-700'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${currentStep >= 3 ? 'bg-emerald-400' : 'bg-zinc-700'}`} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Step Body in iOS Device Container */}
      <main className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center py-4">
        {/* STEP 1: WELCOME & HOW IT WORKS */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 mb-4">
                <span>🇳🇬</span>
                <span>Verified Worldwide Remote</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Break Location Bias. Land Global Roles.
              </h1>

              <p className="mt-2.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Tired of getting rejected by <span className="text-rose-400">"US Only"</span> or <span className="text-rose-400">"W-2 Tax Restrictions"</span>? AfroRemote finds roles genuinely open to candidates in Nigeria and matches you with AI precision.
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">1. Strict Location Filtering</h3>
                    <p className="text-[11px] text-zinc-400 leading-snug">
                      We filter out US/EU W-2 restricted jobs and keep only Worldwide, EMEA, and African remote roles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-teal-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">2. West Africa Time (WAT) Alignment</h3>
                    <p className="text-[11px] text-zinc-400 leading-snug">
                      Analyze direct overlap with UK/EU and US East Coast teams (5+ hours daily sync).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-cyan-400 shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">3. Direct Authentic Gmail Outreach</h3>
                    <p className="text-[11px] text-zinc-400 leading-snug">
                      Send tailored applications directly from your own Gmail account with human-in-the-loop review.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-black font-bold text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2"
            >
              <span>Continue to Resume Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: RESUME UPLOAD OR 2-MINUTE BUILDER */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-white tracking-tight">
                {showQuickBuilder ? 'Build Your Resume in 2 Mins' : 'Your Resume Profile'}
              </h2>
              <p className="text-xs text-zinc-400">
                {showQuickBuilder
                  ? 'Fill in your details below. You can update this anytime in the app.'
                  : 'Upload your file or build a quick 2-minute profile to start matching.'}
              </p>
            </div>

            {/* Container */}
            <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4 max-h-[68vh] overflow-y-auto">
              {!showQuickBuilder ? (
                <>
                  {/* Option 1: File Upload */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Have a Resume File?</span>
                      <span className="text-[10px] text-emerald-400">PDF, DOCX, TXT</span>
                    </div>

                    <label className="border-2 border-dashed border-zinc-700 hover:border-emerald-500/60 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition bg-black/40 group">
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setCustomFile(e.target.files[0]);
                          }
                        }}
                      />
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 group-hover:bg-emerald-950 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 transition mb-2">
                        <Upload className="w-5 h-5" />
                      </div>
                      {customFile ? (
                        <div>
                          <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[200px]">{customFile.name}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500">Tap to replace file</span>
                        </div>
                      ) : (
                        <div>
                          <div className="text-xs font-semibold text-zinc-200">Tap to upload your resume file</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">We will parse skills & ATS readiness</div>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Option 2: 2-Minute Resume Builder Trigger */}
                  <div className="pt-2 border-t border-zinc-800">
                    <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800 hover:border-emerald-500/40 transition space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Edit3 className="w-4 h-4" />
                        <h4 className="text-xs font-bold text-white">Don't have a resume?</h4>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-snug">
                        Build one in 2 minutes with our simple structured builder. You can update it anytime in the app.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowQuickBuilder(true);
                          setCustomFile(null);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-bold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Build Resume in 2 Minutes</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* INLINE 2-MINUTE RESUME BUILDER */
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>2-Minute Resume Builder</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 underline"
                    >
                      <ChevronLeft className="w-3 h-3 text-zinc-400" />
                      <span>Back to Upload or Build</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="font-semibold text-zinc-300">Your Full Name *</label>
                      <input
                        type="text"
                        value={builderFullName}
                        onChange={(e) => setBuilderFullName(e.target.value)}
                        placeholder="e.g. Adebayo Ogunlesi"
                        className="w-full mt-1 bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-zinc-300">Professional Title *</label>
                      <input
                        type="text"
                        value={builderTitle}
                        onChange={(e) => setBuilderTitle(e.target.value)}
                        placeholder="e.g. Senior Backend Engineer"
                        className="w-full mt-1 bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-zinc-300">Seniority</label>
                        <select
                          value={builderSeniority}
                          onChange={(e) => setBuilderSeniority(e.target.value as any)}
                          className="w-full mt-1 bg-black border border-zinc-800 rounded-xl px-2 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                        >
                          <option value="junior">Junior (1-2 yrs)</option>
                          <option value="mid">Mid-level (3-4 yrs)</option>
                          <option value="senior">Senior (5+ yrs)</option>
                          <option value="lead">Lead / Staff (7+ yrs)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-300">Experience (Years)</label>
                        <input
                          type="number"
                          min={1}
                          max={25}
                          value={builderYears}
                          onChange={(e) => setBuilderYears(e.target.value)}
                          className="w-full mt-1 bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-zinc-300">Core Tech Stack (Comma Separated) *</label>
                      <input
                        type="text"
                        value={builderSkills}
                        onChange={(e) => setBuilderSkills(e.target.value)}
                        placeholder="e.g. TypeScript, React, Go, PostgreSQL, AWS, Docker"
                        className="w-full mt-1 bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-zinc-300">Short Summary</label>
                      <textarea
                        rows={2}
                        value={builderSummary}
                        onChange={(e) => setBuilderSummary(e.target.value)}
                        className="w-full mt-1 bg-black border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 text-xs leading-relaxed resize-none"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-zinc-300">Key Achievements (1 per line)</label>
                      <textarea
                        rows={2}
                        value={builderAchievements}
                        onChange={(e) => setBuilderAchievements(e.target.value)}
                        className="w-full mt-1 bg-black border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 text-xs leading-relaxed resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="w-1/3 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center justify-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4 text-zinc-400" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleProceedFromStep2}
                disabled={isUploading || (!customFile && !builderFullName.trim())}
                className="w-2/3 py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-black font-bold text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isUploading ? 'Analyzing...' : 'Scan & Find Matches'}</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INTERACTIVE LIVE MATCHING (WATCH AS IT HAPPENS) */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Matching Engine</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {pipelineProgress < 100 ? 'Finding Your Matches...' : '8 Verified Matches Ready!'}
              </h2>
              <p className="text-xs text-zinc-400">
                {pipelineProgress < 100
                  ? 'Watch the AI pipeline evaluate your profile in real-time'
                  : 'All roles confirmed open to Nigeria with USD contractor pay'}
              </p>
            </div>

            {/* iOS Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
                <span>Matching Progress</span>
                <span className="text-emerald-400 font-mono">{pipelineProgress}%</span>
              </div>
              <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-150 ease-out"
                  style={{ width: `${pipelineProgress}%` }}
                />
              </div>
            </div>

            {/* Stages Stack */}
            <div className="p-4 sm:p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-3">
              {pipelineStages.map((stage, idx) => {
                const isDone = pipelineStage > idx || pipelineProgress === 100;
                const isCurrent = pipelineStage === idx && pipelineProgress < 100;
                const Icon = stage.icon;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border transition-all ${
                      isDone
                        ? 'bg-zinc-950/80 border-emerald-500/30 text-zinc-300'
                        : isCurrent
                        ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/30 text-white'
                        : 'bg-zinc-950/30 border-zinc-900 text-zinc-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                            isDone
                              ? 'bg-emerald-950 text-emerald-400'
                              : isCurrent
                              ? 'bg-emerald-500 text-black animate-pulse'
                              : 'bg-zinc-800 text-zinc-600'
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs font-bold">{stage.title}</span>
                      </div>

                      {isDone && (
                        <span className="text-[10px] font-semibold text-emerald-400">Done</span>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] font-semibold text-emerald-400 animate-pulse">Running...</span>
                      )}
                    </div>

                    {(isCurrent || isDone) && (
                      <p className="text-[11px] text-zinc-400 mt-1.5 pl-9 leading-snug">
                        {stage.detail}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Final Action when 100% */}
            {pipelineProgress >= 100 && (
              <button
                onClick={onComplete}
                className="w-full py-4 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-black font-bold text-sm shadow-xl shadow-emerald-500/30 transition flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <span>Enter AfroRemote Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </main>

      {/* Footer info */}
      <footer className="max-w-md w-full mx-auto text-center pt-2">
        <p className="text-[10px] text-zinc-500">
          AfroRemote • West Africa Time (WAT) • Direct Gmail API OAuth
        </p>
      </footer>
    </div>
  );
};
