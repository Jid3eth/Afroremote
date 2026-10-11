import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  ShieldCheck,
  DollarSign,
  ChevronRight,
  Filter,
  CheckCircle2,
  ExternalLink,
  Info,
  HelpCircle,
  Zap,
  AlertTriangle,
  Lock,
  Globe,
  RefreshCw,
  AlertCircle,
  X,
} from 'lucide-react';
import { AITrainingJob, CandidateProfile } from '../types/index.js';
import { AITrainingDetailModal } from './AITrainingDetailModal.tsx';

interface AITrainingSectionProps {
  profile: CandidateProfile | null;
}

interface AvailabilityDiagnosticData {
  diagnosticTime: string;
  clientIp: string;
  overallNigeriaReadiness: string;
  totalVettedPlatforms: number;
  platformAudits: Array<{
    platform: string;
    title: string;
    rate: string;
    status: string;
    statusLabel: string;
    directIpAllowed: boolean;
    geoBlockRisk: string;
    vpnWarning: string;
    idVerification: string;
    payoutReadiness: string;
    bypassStrategy: string;
  }>;
  recommendations: Array<{
    category: string;
    status: string;
    advice: string;
  }>;
}

export const AITrainingSection: React.FC<AITrainingSectionProps> = ({ profile }) => {
  const [jobs, setJobs] = useState<AITrainingJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedGeoFilter, setSelectedGeoFilter] = useState<string>('all');
  const [selectedMinRate, setSelectedMinRate] = useState<number>(0);
  const [activeJob, setActiveJob] = useState<AITrainingJob | null>(null);
  const [showPayoutGuide, setShowPayoutGuide] = useState(false);

  // Live Nigeria Availability Diagnostics State
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isDiagnosticLoading, setIsDiagnosticLoading] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<AvailabilityDiagnosticData | null>(null);

  // Fetch AI training jobs with active filters
  useEffect(() => {
    async function fetchAIJobs() {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('q', searchQuery.trim());
        if (selectedDomain !== 'all') params.set('domain', selectedDomain);
        if (selectedPlatform !== 'all') params.set('platform', selectedPlatform);
        if (selectedGeoFilter !== 'all') params.set('geoFilterStatus', selectedGeoFilter);
        if (selectedMinRate > 0) params.set('minRate', selectedMinRate.toString());

        const res = await fetch(`/api/ai-training-jobs?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.jobs)) {
            setJobs(data.jobs);
          }
        }
      } catch (err) {
        console.error('Failed to load AI training jobs:', err);
      } finally {
        setIsLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchAIJobs();
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedDomain, selectedPlatform, selectedGeoFilter, selectedMinRate]);

  // Run live availability diagnostic
  const handleRunDiagnostic = async () => {
    setIsDiagnosticOpen(true);
    setIsDiagnosticLoading(true);
    try {
      const res = await fetch('/api/check-nigeria-availability');
      if (res.ok) {
        const data = await res.json();
        setDiagnosticData(data);
      }
    } catch (err) {
      console.error('Diagnostic error:', err);
    } finally {
      setIsDiagnosticLoading(false);
    }
  };

  const domains = [
    { id: 'all', label: 'All Domains' },
    { id: 'Coding RLHF', label: 'Coding RLHF' },
    { id: 'Software Engineering', label: 'Software Eng' },
    { id: 'Prompt Engineering', label: 'Prompt Eng' },
    { id: 'STEM & Math', label: 'STEM & Math' },
    { id: 'Multimodal & Reasoning', label: 'Multimodal' },
  ];

  const geoFilters = [
    { id: 'all', label: 'All Access Levels' },
    { id: 'VERIFIED_DIRECT_ACCESS', label: '🟢 100% Direct Nigeria IP' },
    { id: 'STRICT_VERIFICATION_REQUIRED', label: '🟡 Strict Benchmark / IDV' },
    { id: 'GEO_FILTER_ALERT', label: '⚠️ Filter Alerts & Bypasses' },
  ];

  return (
    <div className="space-y-4">
      {/* Intro Header */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-500/30 text-white space-y-3 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>High-Hourly USD</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Nigeria Filter & Availability Vetted</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
              AI Training & Model Evaluation Roles
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Earn <span className="text-emerald-400 font-bold">$18 – $50/hr USD</span> evaluating LLMs with code review, prompt tuning, and reasoning benchmarks. Audited to prevent Nigerian IP & identity filtering.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <button
              onClick={handleRunDiagnostic}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
              title="Audit site availability & geo-filtering for Nigerian applicants"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span className="text-[11px]">Filter Audit</span>
            </button>
            <button
              onClick={() => setShowPayoutGuide(!showPayoutGuide)}
              className="px-2.5 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition border border-zinc-700 text-[10px] font-semibold text-center"
            >
              Payout Guide
            </button>
          </div>
        </div>

        {/* Collapsible Nigerian Payment & W-8BEN Guide */}
        {showPayoutGuide && (
          <div className="p-3.5 rounded-2xl bg-black/70 border border-purple-500/30 text-xs space-y-2 animate-in fade-in duration-150">
            <div className="font-bold text-purple-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Nigerian Contractor Payment & Anti-Filter Guidelines:</span>
            </div>
            <ul className="space-y-1 text-zinc-300 text-[11px] list-disc list-inside">
              <li>
                <strong className="text-white">Geegpay / Grey USD Virtual Account:</strong> Outlier, Alignerr, and Invisible Tech support direct ACH deposits into your Geegpay USD account.
              </li>
              <li>
                <strong className="text-white">Form W-8BEN:</strong> Submit this digital certification of non-US foreign tax status so zero US taxes are withheld.
              </li>
              <li>
                <strong className="text-white">Anti-VPN Advisory:</strong> Outlier and Scale AI immediately flag and permanently ban VPN connections. Always browse and test using native Nigerian broadband (MTN, Starlink, Airtel).
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search AI training roles (e.g. Python, Geegpay, Outlier, Algorithms)..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Filter 1: Geo Filter & Site Availability Checks */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span className="font-semibold flex items-center gap-1 text-zinc-300">
            <Globe className="w-3 h-3 text-purple-400" />
            <span>Nigeria Availability Status:</span>
          </span>
          <button
            onClick={handleRunDiagnostic}
            className="text-purple-400 hover:text-purple-300 text-[10px] font-bold underline"
          >
            Run Live Audit Check
          </button>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
          {geoFilters.map((geo) => (
            <button
              key={geo.id}
              onClick={() => setSelectedGeoFilter(geo.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition text-[11px] ${
                selectedGeoFilter === geo.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {geo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter 2: Domains Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
        {domains.map((dom) => (
          <button
            key={dom.id}
            onClick={() => setSelectedDomain(dom.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition text-[11px] ${
              selectedDomain === dom.id
                ? 'bg-zinc-800 text-white border border-purple-500/50 shadow-sm'
                : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
            }`}
          >
            {dom.label}
          </button>
        ))}
      </div>

      {/* Secondary Filter: Min Hourly Rate */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
          <span>Min Rate:</span>
          {[0, 25, 35].map((rate) => (
            <button
              key={rate}
              onClick={() => setSelectedMinRate(rate)}
              className={`px-2 py-0.5 rounded-lg font-mono font-bold transition ${
                selectedMinRate === rate
                  ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/40'
                  : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {rate === 0 ? 'Any' : `$${rate}+`}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-zinc-500 font-mono">
          {jobs.length} Opportunities Audited
        </span>
      </div>

      {/* Jobs Feed */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-center">
          <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-400">Auditing AI training job availability for Nigeria...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-zinc-900 border border-zinc-800 space-y-2">
          <p className="text-sm font-bold text-white">No AI training roles matching filters</p>
          <p className="text-xs text-zinc-400">Try resetting the domain or search term.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDomain('all');
              setSelectedGeoFilter('all');
              setSelectedMinRate(0);
            }}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 text-xs font-bold text-purple-400"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const audit = job.filter_audit;
            return (
              <div
                key={job.id}
                onClick={() => setActiveJob(job)}
                className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 cursor-pointer space-y-3 transition shadow-lg group"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold text-[10px]">
                        {job.platform}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-zinc-800 text-[10px] text-zinc-400 font-mono">
                        {job.domain}
                      </span>
                      <span
                        className={`text-[10px] font-semibold flex items-center gap-1 ${
                          audit.geo_status === 'VERIFIED_DIRECT_ACCESS'
                            ? 'text-emerald-400'
                            : audit.geo_status === 'GEO_FILTER_ALERT'
                            ? 'text-amber-400'
                            : 'text-blue-400'
                        }`}
                      >
                        {audit.geo_status === 'VERIFIED_DIRECT_ACCESS' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                        )}
                        <span>{audit.geo_status_label}</span>
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition line-clamp-1">
                      {job.title}
                    </h4>
                  </div>

                  {/* Match percentage */}
                  {job.match_score && (
                    <div className="text-right shrink-0">
                      <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Match</div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {job.match_score}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Pay & Schedule highlights */}
                <div className="flex items-center justify-between text-xs bg-black/40 p-2.5 rounded-2xl border border-zinc-800/80">
                  <div>
                    <div className="text-[10px] text-zinc-500">Hourly Rate (USD)</div>
                    <div className="font-black text-emerald-400 font-mono text-sm">
                      {job.hourly_rate_display}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500">Weekly Estimate (NGN)</div>
                    <div className="font-bold text-zinc-200 text-xs font-mono">
                      {job.estimated_weekly_ngn}
                    </div>
                  </div>
                </div>

                {/* Availability Check Highlights Strip */}
                <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <Lock className="w-3 h-3 text-rose-400 shrink-0" />
                    <span className="truncate text-zinc-300">
                      Anti-VPN: Clean native IP required
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                    <span>IDV Vetted</span>
                  </div>
                </div>

                {/* Skills and Payout */}
                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/60">
                  <div className="flex items-center gap-1 truncate max-w-[200px] sm:max-w-[300px]">
                    <span className="text-zinc-500 font-semibold">Payouts:</span>
                    <span className="text-zinc-300 truncate">{job.payout_methods.join(', ')}</span>
                  </div>
                  <span className="text-purple-400 font-bold flex items-center gap-0.5 shrink-0 group-hover:translate-x-0.5 transition">
                    <span>Audit & Apply</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {activeJob && (
        <AITrainingDetailModal
          job={activeJob}
          onClose={() => setActiveJob(null)}
        />
      )}

      {/* LIVE AVAILABILITY DIAGNOSTIC MODAL */}
      {isDiagnosticOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 w-full sm:max-w-xl rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4 text-white max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto sm:hidden -mt-1 mb-2" />
            
            <button
              onClick={() => setIsDiagnosticOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  Nigerian Job Availability & Geo-Filter Audit
                </h3>
              </div>
              <p className="text-xs text-zinc-400">
                Automated detection of location filters, anti-VPN traps, and verification policies for Nigerian talent.
              </p>
            </div>

            {isDiagnosticLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-center">
                <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
                <p className="text-xs text-zinc-400">Running diagnostic test across 8 global platforms...</p>
              </div>
            ) : diagnosticData ? (
              <div className="space-y-4">
                {/* Score summary */}
                <div className="p-4 rounded-2xl bg-zinc-900 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Overall Nigeria Readiness Score</div>
                    <div className="text-xl font-black text-emerald-400 font-mono">
                      {diagnosticData.overallNigeriaReadiness}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Platforms Checked</div>
                    <div className="text-xs font-bold text-zinc-200">
                      {diagnosticData.totalVettedPlatforms} Global AI Platforms
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Anti-Filter Playbook & Safeguards
                  </h4>
                  <div className="space-y-2">
                    {diagnosticData.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-2xl text-xs space-y-1 border ${
                          rec.status === 'CRITICAL'
                            ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5 text-white text-[11px]">
                          {rec.status === 'CRITICAL' ? (
                            <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                          <span>{rec.category}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-zinc-300">{rec.advice}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform matrix */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Platform Availability Matrix
                  </h4>
                  <div className="space-y-2">
                    {diagnosticData.platformAudits.map((pa, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{pa.platform}</span>
                          <span className="text-[10px] font-mono text-emerald-400">{pa.rate}</span>
                        </div>
                        <div className="text-[11px] text-zinc-300 font-medium">
                          {pa.statusLabel}
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-snug">
                          <strong className="text-zinc-300">Bypass Tip: </strong>
                          {pa.bypassStrategy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="pt-2">
              <button
                onClick={() => setIsDiagnosticOpen(false)}
                className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold text-xs text-white transition"
              >
                Close Diagnostic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
