import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, User, Briefcase, MapPin, Award, Layers } from 'lucide-react';
import { CandidateProfile } from '../types/index.js';

interface ResumeEditorModalProps {
  onClose: () => void;
  onSaveSuccess: (updated: CandidateProfile) => void;
  initialProfile?: CandidateProfile | null;
}

export const ResumeEditorModal: React.FC<ResumeEditorModalProps> = ({
  onClose,
  onSaveSuccess,
  initialProfile,
}) => {
  const [fullName, setFullName] = useState(initialProfile?.full_name || '');
  const [title, setTitle] = useState(initialProfile?.current_title || 'Software Engineer');
  const [email, setEmail] = useState(initialProfile?.email || '');
  const [phone, setPhone] = useState(initialProfile?.phone || '');
  const [location, setLocation] = useState(initialProfile?.location || 'Lagos, Nigeria (WAT / UTC+1)');
  const [seniority, setSeniority] = useState<'junior' | 'mid' | 'senior' | 'lead'>(
    initialProfile?.seniority_level || 'senior'
  );
  const [years, setYears] = useState(initialProfile?.years_of_experience?.toString() || '5');
  const [skills, setSkills] = useState(
    initialProfile?.parsed_skills?.join(', ') || 'TypeScript, React, Node.js, PostgreSQL, Docker, AWS'
  );
  const [summary, setSummary] = useState(
    initialProfile?.summary ||
      'Software engineer specialized in scalable web backends and modern client applications, with dedicated high-speed fiber setup in Nigeria for synchronous remote team collaboration.'
  );
  const [achievements, setAchievements] = useState(
    initialProfile?.achievements?.join('\n') ||
      'Architected microservices processing over $2.5M in monthly transactions with 99.98% uptime.\nLed asynchronous sprint cadences reducing deployment cycles by 35%.'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !title.trim()) {
      setErrorMessage('Please enter your full name and job title');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const skillsArr = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const achievementsArr = achievements
        .split('\n')
        .map((a) => a.trim().replace(/^[-*•]\s*/, ''))
        .filter(Boolean);

      const res = await fetch('/api/profile/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          current_title: title,
          email,
          phone,
          location,
          seniority_level: seniority,
          years_of_experience: Number(years) || 4,
          parsed_skills: skillsArr,
          summary,
          achievements: achievementsArr,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save profile');
      }

      onSaveSuccess(data.profile);
      onClose();
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setErrorMessage(err.message || 'Error saving resume');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 text-white space-y-4 max-h-[92vh] overflow-y-auto">
        {/* iOS Grabber for mobile sheet */}
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">2-Minute Resume Builder</h2>
              <p className="text-[11px] text-zinc-400">Fill your key details to generate instant vector matches</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3.5 text-xs">
          {/* Full Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Chukwudi Eze"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300">Professional Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Location & Seniority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:col-span-1">
              <label className="font-semibold text-zinc-300">Location in Nigeria</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Lagos, Nigeria"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300">Seniority Tier</label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value as any)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-2.5 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="junior">Junior (1-2 yrs)</option>
                <option value="mid">Mid-level (3-4 yrs)</option>
                <option value="senior">Senior (5+ yrs)</option>
                <option value="lead">Lead / Staff (7+ yrs)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300">Years Experience</label>
              <input
                type="number"
                min={1}
                max={25}
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Contact (Email & Phone) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300">Contact Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300">Phone (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 803 ..."
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Core Technical Stack */}
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300 flex items-center justify-between">
              <span>Core Technical Stack (Comma Separated) *</span>
              <span className="text-[10px] text-emerald-400 font-normal">Used for Vector Match</span>
            </label>
            <input
              type="text"
              required
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. TypeScript, React, Node.js, Go, PostgreSQL, AWS, Docker"
              className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Professional Summary */}
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Short Professional Summary</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Describe your background and remote capabilities..."
              className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-emerald-500 leading-relaxed resize-none"
            />
          </div>

          {/* Key Achievements / Projects */}
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300 flex items-center justify-between">
              <span>Key Quantifiable Achievements (1 per line)</span>
              <span className="text-[10px] text-zinc-400 font-normal">Mapped to AI cover letters</span>
            </label>
            <textarea
              rows={3}
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              placeholder="Add 2-3 metric-driven achievements..."
              className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-emerald-500 leading-relaxed resize-none"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Calculating Matches...' : 'Save & Match Jobs'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
