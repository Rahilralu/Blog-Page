import React from 'react';
import { Mail, Shield, User, Award, Edit2, Camera } from 'lucide-react';

export default function Profile({ user }) {
  if (!user) return null;
  const displayName = user.email?.split('@')[0] || 'User';
  const initial = user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">Profile</h1>
        <p className="text-slate-500 text-sm">Manage your account and public presence.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* ── Profile card ── */}
        <div className="md:col-span-1 flex flex-col gap-4">
          {/* Avatar card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-4xl font-black text-white shadow-lg shadow-violet-200">
                {initial}
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-violet-600 hover:border-violet-300 transition-colors shadow-sm">
                <Camera size={12} />
              </button>
            </div>
            <div className="text-lg font-bold text-slate-800 mb-0.5">{displayName}</div>
            <div className="text-xs text-violet-600 font-semibold bg-violet-50 inline-block px-3 py-0.5 rounded-full mb-4">Pro Member</div>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 hover:border-violet-400 hover:text-violet-600 text-slate-600 text-sm font-semibold rounded-xl transition-all">
              <Edit2 size={14} /> Edit Profile
            </button>
          </div>

          {/* Membership card */}
          <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl p-5 text-white shadow-md shadow-violet-200 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
            <Award size={22} className="mb-3 relative z-10 text-fuchsia-200" />
            <div className="text-base font-bold mb-1 relative z-10">Pro Membership</div>
            <div className="text-violet-200 text-xs leading-relaxed mb-4 relative z-10">
              Access all features — analytics, advanced tools, and priority distribution.
            </div>
            <button className="relative z-10 text-xs font-bold text-white border border-white/30 px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors">
              Manage Plan
            </button>
          </div>
        </div>

        {/* ── Info panel ── */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-700 mb-5 pb-3 border-b border-slate-100">Personal Information</h3>
            <div className="flex flex-col gap-4">
              <InfoRow icon={<User size={16} className="text-violet-500" />} label="Display Name" value={displayName} />
              <InfoRow icon={<Mail size={16} className="text-violet-500" />} label="Email Address" value={user.email} />
              <InfoRow icon={<Shield size={16} className="text-violet-500" />} label="Account ID" value={user.userId} mono />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-700 mb-5 pb-3 border-b border-slate-100">Writing Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Articles', value: '—' },
                { label: 'Comments', value: '—' },
                { label: 'Followers', value: '—' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                  <div className="text-2xl font-black text-slate-800 mb-1">{value}</div>
                  <div className="text-xs text-slate-400 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-700 mb-5 pb-3 border-b border-slate-100">Preferences</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Email notifications', desc: 'Get notified about new comments and followers' },
                { label: 'Weekly digest', desc: 'Receive a weekly summary of your analytics' },
                { label: 'Public profile', desc: 'Allow others to find and view your profile' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">{label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                  </div>
                  {/* Toggle */}
                  <div className="w-10 h-6 bg-violet-100 rounded-full relative cursor-pointer shrink-0">
                    <div className="w-4 h-4 bg-violet-600 rounded-full absolute top-1 right-1 shadow-sm transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, mono }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</div>
        <div className={`text-sm text-slate-700 font-medium truncate ${mono ? 'font-mono text-xs' : ''}`}>{value}</div>
      </div>
    </div>
  );
}
