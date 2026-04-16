import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar, CartesianGrid
} from 'recharts';
import { TrendingUp, Users, FileText, Activity, ArrowUpRight } from 'lucide-react';

const WEEKLY_DATA = [
  { name: 'Mon', views: 4000, comments: 24 },
  { name: 'Tue', views: 3200, comments: 18 },
  { name: 'Wed', views: 5800, comments: 42 },
  { name: 'Thu', views: 4700, comments: 31 },
  { name: 'Fri', views: 6100, comments: 55 },
  { name: 'Sat', views: 5200, comments: 38 },
  { name: 'Sun', views: 7300, comments: 62 },
];

export default function Analytics() {
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts`)
      .then(r => r.json())
      .then(d => { if (d.success) setTotalPosts(d.data.length); })
      .catch(console.error);
  }, []);

  const stats = [
    { label: 'Total Views', value: '24,391', delta: '+12.5%', up: true, icon: <Eye />, color: 'violet' },
    { label: 'Published', value: totalPosts, delta: `↑ ${totalPosts}`, up: true, icon: <FileText />, color: 'blue' },
    { label: 'Avg. Engagement', value: '4.2%', delta: '+1.2%', up: true, icon: <Activity />, color: 'emerald' },
    { label: 'Growth', value: '+14%', delta: 'Top 10%', up: true, icon: <TrendingUp />, color: 'amber' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">Analytics</h1>
        <p className="text-slate-500 text-sm">Track your content performance and reader engagement.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, delta, icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${color}-50 text-${color}-600`}>
                {React.cloneElement(icon, { size: 18 })}
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{delta}</span>
            </div>
            <div className="text-2xl font-black text-slate-800 mb-0.5">{value}</div>
            <div className="text-xs text-slate-400 font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-5 gap-6 mb-6">
        {/* Main area chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Weekly Views</h3>
              <p className="text-xs text-slate-400 mt-0.5">Views per day this week</p>
            </div>
            <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">This Week</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={8} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }}
                  cursor={{ stroke: '#7c3aed', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="views" stroke="#7c3aed" strokeWidth={2.5} fill="url(#gradViews)" dot={false} activeDot={{ r: 5, fill: '#7c3aed' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Comments</h3>
              <p className="text-xs text-slate-400 mt-0.5">Daily engagement</p>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={8} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }}
                  cursor={{ fill: '#f5f3ff' }}
                />
                <Bar dataKey="comments" fill="#7c3aed" radius={[5, 5, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl p-6 text-white flex items-center justify-between shadow-lg shadow-violet-200">
        <div>
          <div className="text-lg font-bold mb-1">Keep writing to grow faster!</div>
          <div className="text-violet-200 text-sm">Authors who publish 3× a week earn 4× more engagement on average.</div>
        </div>
        <ArrowUpRight size={32} className="text-white/50 shrink-0" />
      </div>
    </div>
  );
}

function Eye(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={props.size || 18} height={props.size || 18}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx={12} cy={12} r={3} />
    </svg>
  );
}
