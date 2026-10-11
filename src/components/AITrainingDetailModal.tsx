import React from 'react';
import {
  X,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Award,
  Zap,
  Globe,
  Lock,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { AITrainingJob } from '../types/index.js';

interface AITrainingDetailModalProps {
  job: AITrainingJob;
  onClose: () => void;
}

export const AITrainingDetailModal: React.FC<AITrainingDetailModalProps> = ({ job, onClose }) => {
  const audit = job.filter_audit;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 w-full sm:max-w-xl rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-5 text-white max-h-[92vh] overflow-y-auto">
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto sm:hidden -mt-1 mb-2" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold text-xs">
              {job.platform}
            </span>
            <span
              className={`px-2.5 py-1 rounded-xl font-semibold text-xs flex items-center gap-1 ${
                audit.geo_status === 'VERIFIED_DIRECT_ACCESS'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : audit.geo_status === 'GEO_FILTER_ALERT'
                  ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                  : 'bg-blue-500/10 border border-blue-500/30 text-blue-300'
              }`}
            >
              {audit.geo_status === 'VERIFIED_DIRECT_ACCESS' ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              <span>{audit.geo_status_label}</span>
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-zinc-800 text-[10px] text-zinc-400 font-mono">
              {job.screening_type}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white leading-snug">{job.title}</h2>

          {/* Pay banner */}
          <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Hourly USD Rate</div>
              <div className="text-lg font-black text-emerald-400 font-mono">{job.hourly_rate_display}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Estimated Weekly NGN</div>
              <div className="text-xs font-bold text-zinc-300 font-mono">{job.estimated_weekly_ngn}</div>
            </div>
          </div>
        </div>

        {/* NIGERIA SITE FILTER & AVAILABILITY AUDIT */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border border-zinc-700/80 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Nigeria Site Availability & Geo-Filter Audit</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">{audit.last_verified}</span>
          </div>

          {/* Key Checklist Badges */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Direct Nigerian IP</div>
              <div className="font-bold flex items-center gap-1 text-xs">
                {audit.direct_ip_allowed ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Allowed (No IP Block)</span>
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Filters Generic Signups</span>
                  </span>
                )}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Geo-Block Risk</div>
              <div className="font-bold text-xs">
                {audit.geo_block_risk === 'None' && <span className="text-emerald-400">Zero Risk (Open)</span>}
                {audit.geo_block_risk === 'Low' && <span className="text-blue-400">Low (Test Pass Required)</span>}
                {audit.geo_block_risk === 'High' && <span className="text-amber-400">High (Direct Link Needed)</span>}
              </div>
            </div>
          </div>

          {/* Anti-VPN Security Alert */}
          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px]">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>Anti-VPN & Proxy Rule (Critical)</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-snug">{audit.vpn_advisory}</p>
          </div>

          {/* ID Verification & Payout */}
          <div className="space-y-1.5 text-xs">
            <div className="text-[11px] text-zinc-300">
              <strong className="text-white">ID Verification: </strong>
              <span>{audit.id_verification}</span>
            </div>
            <div className="text-[11px] text-zinc-300">
              <strong className="text-white">Payout Method: </strong>
              <span>{audit.payout_readiness}</span>
            </div>
          </div>

          {/* Anti-Filter Pass Strategy */}
          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-purple-300 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>How to Guarantee Acceptance & Pass Site Filters</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-snug">{audit.filter_bypass_strategy}</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Role Overview</h4>
          <p className="text-xs text-zinc-300 leading-relaxed">{job.description}</p>
        </div>

        {/* Requirements */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Core Requirements</h4>
          <div className="space-y-1.5">
            {job.requirements.map((req, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Tagged */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Target Skills & Topics</h4>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Nigeria Applicant Playbook */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Nigerian Candidate Advantage & Payout Playbook</span>
          </div>
          <div className="space-y-2">
            {job.nigeria_applicant_tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-snug">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payout & Schedule Meta */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Payout Schedule</div>
            <div className="font-bold text-zinc-200">{job.payout_frequency} Payouts</div>
            <div className="text-[11px] text-zinc-400 flex flex-wrap gap-1 mt-1">
              {job.payout_methods.join(', ')}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Working Hours</div>
            <div className="font-bold text-zinc-200">Self-Directed</div>
            <div className="text-[11px] text-zinc-400">{job.flexibility}</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <a
            href={job.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 font-bold text-xs text-black transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <span>Apply on {job.platform} Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <p className="text-[10px] text-center text-zinc-500 mt-2">
            Always complete your screening from a stable desktop connection without proxy/VPN.
          </p>
        </div>
      </div>
    </div>
  );
};
