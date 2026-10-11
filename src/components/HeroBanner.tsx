import React from 'react';
import { Globe2, ShieldCheck, Cpu, Zap, DollarSign, CheckCircle2 } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800 text-white py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-60 sm:w-80 h-60 sm:h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Main narrative */}
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-500/30 mb-3 sm:mb-4">
              <span className="text-sm sm:text-base">🇳🇬</span>
              <span>Engineering Mobility For Nigerian Tech Talent</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Break Geographical Bias.{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent block sm:inline mt-1 sm:mt-0">
                Land High-Paying Worldwide Remote Roles.
              </span>
            </h1>

            <p className="mt-3 sm:mt-4 text-slate-300 text-xs sm:text-base lg:text-lg max-w-3xl leading-relaxed">
              Tired of applying only to be disqualified by hidden <span className="text-rose-400 font-semibold">"US Only"</span> or <span className="text-rose-400 font-semibold">"W-2 Tax Restrictions"</span>?
              AfroRemote filters out geographic traps to surface verified <strong className="text-white">Worldwide & EMEA roles</strong> accepting Nigerian candidates, matches them with semantic vector embeddings, and dispatches authentic applications directly from your connected Gmail.
            </p>

            <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-700/80">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <span>Zero W-2 Traps</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-700/80">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <span>WAT Overlap Strategy</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-700/80">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <span>Form W-8BEN & Geegpay/Deel</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-700/80">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <span>Direct Gmail Outreach</span>
              </div>
            </div>
          </div>

          {/* Quick stats grid */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-2 sm:gap-3">
            <div className="p-3 sm:p-4 rounded-xl bg-slate-800/60 border border-slate-700/70">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">$115k+</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">Average Benchmark</div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-slate-800/60 border border-slate-700/70">
              <div className="text-xl sm:text-2xl font-black text-teal-400">100%</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">Nigeria Eligible</div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-slate-800/60 border border-slate-700/70">
              <div className="text-xl sm:text-2xl font-black text-cyan-400">5+ Hours</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">Daily EU / US Overlap</div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-slate-800/60 border border-slate-700/70">
              <div className="text-xl sm:text-2xl font-black text-indigo-400">0% Spoof</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">Direct Gmail API</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
