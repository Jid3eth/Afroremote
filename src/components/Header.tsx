import React from 'react';
import { LogOut, CheckCircle2, User as UserIcon, ShieldCheck } from 'lucide-react';
import { CandidateProfile } from '../types/index.js';
import { User } from 'firebase/auth';

interface HeaderProps {
  profile: CandidateProfile;
  authUser: User | null;
  gmailUserEmail: string | null;
  isGmailConnected: boolean;
  onOpenAuthModal: () => void;
  onConnectGmail: () => void;
  onSignOut: () => void;
  onOpenOnboarding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  authUser,
  gmailUserEmail,
  isGmailConnected,
  onOpenAuthModal,
  onConnectGmail,
  onSignOut,
  onOpenOnboarding,
}) => {
  const lagosTime = new Date().toLocaleTimeString('en-GB', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-zinc-800/80 text-white">
      <div className="max-w-md md:max-w-xl lg:max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-xs text-black shadow-sm">
            AR
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-white hidden xs:inline">
            AfroRemote
          </span>
        </div>

        {/* Dynamic Island Style Time Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-300 shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-emerald-300 font-semibold">{lagosTime}</span>
          <span className="text-zinc-500">WAT</span>
        </div>

        {/* Right Actions: Auth & Onboarding */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenOnboarding}
            title="View Onboarding Steps"
            className="text-[11px] font-semibold text-zinc-400 hover:text-emerald-400 transition hidden sm:inline"
          >
            How it works
          </button>

          {authUser ? (
            <div className="flex items-center gap-1.5">
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-900 border border-emerald-500/30 text-[11px] text-zinc-200"
                title={`Signed in as ${authUser.email || authUser.displayName || 'User'} (Firestore sync enabled)`}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-medium max-w-[70px] sm:max-w-[110px] truncate">
                  {authUser.displayName || authUser.email?.split('@')[0] || 'User'}
                </span>
              </div>
              <button
                onClick={onSignOut}
                title="Sign out"
                className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-bold shadow-sm transition"
            >
              <UserIcon className="w-3 h-3" />
              <span>Sign In</span>
            </button>
          )}

          {/* Gmail Connect Button if signed in but Gmail not yet linked */}
          {authUser && !isGmailConnected && (
            <button
              onClick={onConnectGmail}
              className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 border border-zinc-700 transition"
              title="Connect Gmail for direct 1-click dispatch"
            >
              <span className="text-emerald-400 font-bold">+</span>
              <span>Gmail</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
