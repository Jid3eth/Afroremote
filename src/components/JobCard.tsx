import React from 'react';
import { ChevronRight, CheckCircle2, ExternalLink, Send } from 'lucide-react';
import { JobMatch } from '../types/index.js';

interface JobCardProps {
  match: JobMatch;
  onReview: (match: JobMatch) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ match, onReview }) => {
  const { job, similarity_score, match_reasoning, status } = match;

  return (
    <div
      onClick={() => onReview(match)}
      className="p-4 sm:p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 active:scale-[0.99] transition-all duration-150 cursor-pointer text-white shadow-lg space-y-3 relative group"
    >
      {/* Top Header: Logo, Company & Title, Score */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt={job.company}
              className="w-11 h-11 rounded-2xl object-cover bg-zinc-800 border border-zinc-700/80 shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-sm text-zinc-300 shrink-0">
              {job.company.charAt(0)}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
              {job.title}
            </h3>
            <p className="text-xs text-zinc-400 font-medium truncate mt-0.5">
              {job.company}
            </p>
          </div>
        </div>

        {/* Match Percentage Pill */}
        <div className="flex flex-col items-end shrink-0">
          <span className="text-xs font-black text-emerald-400 font-mono">
            {similarity_score}%
          </span>
          <span className="text-[10px] text-zinc-500 font-medium">Match</span>
        </div>
      </div>

      {/* Unboxed Minimalist Metadata Row */}
      <div className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-400 flex-wrap">
        <span className="font-semibold text-emerald-400">{job.salary_range}</span>
        <span className="text-zinc-600" aria-hidden="true">·</span>
        <span>{job.location_tag}</span>
        <span className="text-zinc-600" aria-hidden="true">·</span>
        <span className="text-zinc-300">WAT Friendly</span>
        <span className="text-zinc-600" aria-hidden="true">·</span>
        <span className="text-emerald-400 font-medium">✓ No Geo-Block</span>
      </div>

      {/* 1-sentence match reasoning */}
      <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
        {match_reasoning}
      </p>

      {/* Card Action Row */}
      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          {status === 'authorized_sent' ? (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sent via Gmail</span>
            </span>
          ) : status === 'applied_manually' ? (
            <span className="flex items-center gap-1 text-blue-400 font-medium">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Applied on ATS</span>
            </span>
          ) : job.application_type === 'email' ? (
            <span className="flex items-center gap-1 text-zinc-400">
              <Send className="w-3 h-3 text-zinc-400" />
              <span>Direct Hiring Email</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-zinc-400">
              <ExternalLink className="w-3 h-3 text-zinc-400" />
              <span>ATS Portal</span>
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onReview(match);
          }}
          className="flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition"
        >
          <span>Review & Apply</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
