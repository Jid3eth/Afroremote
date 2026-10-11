import React, { useState, useEffect } from 'react';
import { Globe, Clock, Sun, Moon } from 'lucide-react';

export const WATTimezoneWidget: React.FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (timeZone: string) => {
    try {
      return now.toLocaleTimeString('en-US', {
        timeZone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '--:--';
    }
  };

  const zones = [
    {
      city: 'Lagos / Abuja',
      region: 'Nigeria (WAT / UTC+1)',
      tz: 'Africa/Lagos',
      overlap: 'Base / Home',
      overlapBadge: 'bg-emerald-950 text-emerald-400 border-emerald-500/50',
      isBase: true,
    },
    {
      city: 'London',
      region: 'UK (GMT / BST)',
      tz: 'Europe/London',
      overlap: '100% Synchronous Overlap',
      overlapBadge: 'bg-teal-950 text-teal-300 border-teal-500/40',
      isBase: false,
    },
    {
      city: 'Berlin / Amsterdam',
      region: 'Europe (CET / UTC+1)',
      tz: 'Europe/Berlin',
      overlap: '100% Synchronous Overlap',
      overlapBadge: 'bg-teal-950 text-teal-300 border-teal-500/40',
      isBase: false,
    },
    {
      city: 'New York',
      region: 'US East (EST / UTC-5)',
      tz: 'America/New_York',
      overlap: '5h Overlap (1 PM – 6 PM WAT)',
      overlapBadge: 'bg-indigo-950 text-indigo-300 border-indigo-500/40',
      isBase: false,
    },
    {
      city: 'San Francisco',
      region: 'US West (PST / UTC-8)',
      tz: 'America/Los_Angeles',
      overlap: '3h Overlap (5 PM – 8 PM WAT)',
      overlapBadge: 'bg-purple-950 text-purple-300 border-purple-500/40',
      isBase: false,
    },
  ];

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-lg text-white">
      <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider truncate">
            West Africa Time (WAT) Global Alignment
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono shrink-0">Real-time sync</span>
      </div>

      {/* Horizontally scrollable on mobile, grid on tablet & desktop */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
        {zones.map((z, idx) => (
          <div
            key={idx}
            className={`p-3 sm:p-3.5 rounded-xl border transition shrink-0 sm:shrink min-w-[170px] sm:min-w-0 ${
              z.isBase
                ? 'bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/20'
                : 'bg-slate-800/60 border-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold text-slate-200">{z.city}</span>
              {z.isBase ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Clock className="w-3.5 h-3.5 text-slate-400" />}
            </div>
            <div className="text-base sm:text-lg font-mono font-bold text-white mb-1">{formatTime(z.tz)}</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 mb-2 truncate">{z.region}</div>
            <div className={`px-2 py-0.5 rounded text-[10px] font-semibold border truncate ${z.overlapBadge}`}>
              {z.overlap}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-800 text-[11px] sm:text-xs text-slate-400 leading-relaxed">
        💡 <strong className="text-slate-200">The Nigerian Timezone Advantage:</strong> Being in UTC+1 puts you in direct lockstep with UK/European workdays and provides a natural 5-hour afternoon crossover with US East Coast companies.
      </div>
    </div>
  );
};
