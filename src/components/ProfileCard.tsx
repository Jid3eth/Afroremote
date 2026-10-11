import React from 'react';
import { Award, FileText, CheckCircle2, Sparkles, Upload, Edit3, ShieldCheck, User as UserIcon, CloudCheck } from 'lucide-react';
import { CandidateProfile } from '../types/index.js';
import { User } from 'firebase/auth';

interface ProfileCardProps {
  profile: CandidateProfile;
  authUser: User | null;
  onOpenUpload: () => void;
  onOpenEditor: () => void;
  onOpenAuthModal: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  authUser,
  onOpenUpload,
  onOpenEditor,
  onOpenAuthModal,
}) => {
  return (
    <div className="space-y-4">
      {/* Account & Cloud Sync Banner */}
      <div className="p-4 rounded-3xl bg-zinc-900/90 border border-zinc-800 text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${authUser ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span>Account & Cloud Sync</span>
                {authUser && (
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-[9px] font-semibold text-emerald-400">
                    Firestore Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400">
                {authUser
                  ? `Signed in as ${authUser.email || authUser.displayName || 'Authorized User'}`
                  : 'Sign in to automatically persist and protect your profile across devices'}
              </p>
            </div>
          </div>

          {!authUser && (
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow transition"
            >
              Sign In
            </button>
          )}
        </div>

        {authUser && (
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>Zero-Trust Firestore Database Connected</span>
            </span>
            <span className="font-mono text-zinc-500 truncate max-w-[120px]">
              UID: {authUser.uid.slice(0, 8)}...
            </span>
          </div>
        )}
      </div>

      {/* iOS User Overview Card */}
      <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-black text-lg shadow-md shrink-0">
              {profile.full_name ? profile.full_name.charAt(0) : 'U'}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-white truncate">{profile.full_name}</h2>
              <p className="text-xs text-zinc-400 truncate mt-0.5">{profile.current_title}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-0.5 truncate">
                <span>{profile.location || 'Lagos, Nigeria'}</span>
                <span>·</span>
                <span className="capitalize text-emerald-400">{profile.seniority_level}</span>
                <span>·</span>
                <span>{profile.years_of_experience} yrs</span>
              </div>
            </div>
          </div>

          {/* ATS Readiness Gauge */}
          <div className="text-right shrink-0">
            <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">ATS Score</div>
            <div className="text-xl font-black text-emerald-400 font-mono">
              {profile.health_score}<span className="text-xs text-zinc-600 font-normal">/100</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-3">
          {profile.summary}
        </p>

        {/* Technical Stack Tags */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span>Verified Stack</span>
            <span className="text-[10px] text-emerald-400 font-normal">{profile.parsed_skills.length} skills</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.parsed_skills.map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-xl text-xs font-medium bg-zinc-800 text-zinc-200 border border-zinc-700/60"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Quantifiable Achievements */}
        {profile.achievements && profile.achievements.length > 0 && (
          <div className="space-y-2 border-t border-zinc-800/80 pt-3">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Quantifiable Impact</span>
            </div>
            <div className="space-y-2">
              {profile.achievements.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-snug">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions: Edit Resume or Upload File */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80">
          <button
            onClick={onOpenEditor}
            className="py-3 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-black text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Resume</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="py-3 px-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 border border-zinc-700/80"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
