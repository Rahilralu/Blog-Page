import { useEffect, useState } from 'react';
import { getToken, clearToken } from './auth.js';
import { motion } from 'framer-motion';
import { 
  LogOut, LayoutDashboard, Bell, Search, 
  MessageSquare, Clock, ArrowRight, BarChart3, 
  User, Compass, Bookmark, Zap
} from 'lucide-react';

export default function Dashboard({ setCurrentPage }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        setCurrentPage('login');
        return;
      }

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // token expired or invalid → back to login
        clearToken();
        setCurrentPage('login');
      }
      setLoading(false);
    };

    fetchUser();
  }, [setCurrentPage]);

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
      method: 'POST',   // also change GET to POST while you're here
      credentials: 'include',
    });
    clearToken();
    setCurrentPage('login');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-white/[0.02] backdrop-blur-xl hidden md:flex flex-col relative z-10 shadow-2xl">
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
               <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Blog web\.</span>
          </div>
        </div>
        
        <div className="p-6 flex-1">
          <p className="text-xs font-bold text-gray-500 mb-4 px-2 tracking-widest uppercase">Menu</p>
          <nav className="space-y-1.5">
            <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active />
            <NavItem icon={<BarChart3 size={18}/>} label="Analytics" />
            <NavItem icon={<Bookmark size={18}/>} label="Saved" />
            <NavItem icon={<User size={18}/>} label="Profile" />
          </nav>
        </div>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-md shrink-0">
              <span className="font-bold text-sm text-white">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-medium text-gray-200 truncate">{user?.email || 'User'}</p>
              <p className="text-xs text-gray-500">Pro Member</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 h-screen overflow-y-auto w-full max-w-full overflow-x-hidden">
        {/* Top Navbar */}
        <header className="h-20 flex items-center justify-between px-6 md:px-10 border-b border-white/5 bg-white/[0.01] backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-2.5 w-full max-w-xs transition-all focus-within:w-full focus-within:max-w-sm focus-within:border-indigo-500/30 focus-within:bg-white/10 hidden sm:flex">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-500 w-full"
            />
          </div>
          <div className="sm:hidden font-bold text-lg tracking-tight">devlog.</div>

          <div className="flex items-center gap-3 sm:gap-5">
            <button className="relative p-2.5 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-indigo-500 border-2 border-[#0a0a0a]"></span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all border border-white/10 text-gray-300"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 md:p-10 max-w-5xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
               Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 drop-shadow-sm">{user?.email?.split('@')[0] || 'User'}</span>
            </h1>
            <p className="text-gray-400 text-base">Here's a curated selection of what's happening in your network today.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            <StatCard title="Total Views" value="24.8K" trend="+12%" icon={<BarChart3 />} color="from-indigo-500/10 to-indigo-500/5 hover:from-indigo-500/20 hover:to-indigo-500/10" border="border-indigo-500/20"/>
            <StatCard title="Engagements" value="1,432" trend="+5.4%" icon={<MessageSquare />} color="from-violet-500/10 to-violet-500/5 hover:from-violet-500/20 hover:to-violet-500/10" border="border-violet-500/20"/>
            <StatCard title="Active Days" value="42" trend="+2" icon={<Zap />} color="from-fuchsia-500/10 to-fuchsia-500/5 hover:from-fuchsia-500/20 hover:to-fuchsia-500/10" border="border-fuchsia-500/20"/>
          </div>

          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold mb-6 flex items-center gap-2 text-white"
          >
            <LayoutDashboard className="text-indigo-400" size={20}/>
            Your Feed
          </motion.h2>

          <div className="grid grid-cols-1 gap-6 pb-20">
            {SAMPLE_POSTS.map((post, i) => (
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (i * 0.1), ease: "easeOut" }}
                key={post.id} 
                className="group p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 cursor-pointer relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-xs font-semibold text-gray-400 mb-4">
                      <div className="flex items-center gap-1.5 text-indigo-400 bg-indigo-400/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                        <User size={12} />
                        {post.author}
                      </div>
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                      <span>{post.date}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 text-gray-100 group-hover:text-indigo-300 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 max-w-3xl">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex gap-5 text-sm font-medium text-gray-500">
                        <div className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                          <MessageSquare size={16} />
                          {post.comments} comments
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          {post.readTime} min read
                        </div>
                      </div>
                      <div className="text-indigo-400 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1.5 text-sm font-bold bg-indigo-500/10 px-4 py-2 rounded-full">
                        Read more <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <a href="#" onClick={(e) => e.preventDefault()} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${active ? 'bg-indigo-500/10 text-indigo-300 font-semibold shadow-sm border border-indigo-500/10' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent hover:border-white/5 font-medium'}`}>
      {icon}
      <span className="text-sm">{label}</span>
    </a>
  );
}

function StatCard({ title, value, trend, icon, color, border }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`p-6 md:p-8 rounded-3xl bg-gradient-to-br ${color} border ${border} relative overflow-hidden backdrop-blur-sm transition-all duration-300`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 rounded-xl bg-black/20 text-white shadow-inner">
          {icon}
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
          {trend}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
        <h4 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{value}</h4>
      </div>
    </motion.div>
  );
}

const SAMPLE_POSTS = [
  {
    id: 1,
    title: 'Why I switched from REST to tRPC for my side projects',
    excerpt: 'After building three APIs the same way, I wanted type safety end-to-end without the boilerplate. Here is how tRPC completely changed the way I architect my applications.',
    author: 'rahil',
    date: 'Apr 14, 2026',
    comments: 4,
    readTime: 3,
  },
  {
    id: 2,
    title: 'PostgreSQL indexes actually explained',
    excerpt: 'EXPLAIN ANALYZE changed how I think about queries. Here\'s what I learned after a week of digging deep into PostgreSQL indexing strategies and query optimization.',
    author: 'rahil',
    date: 'Apr 12, 2026',
    comments: 7,
    readTime: 5,
  },
  {
    id: 3,
    title: 'Building a rate limiter from scratch vs express-rate-limit',
    excerpt: 'The library is fine. But understanding the sliding window algorithm first made me a better engineer. A deep dive into Redis-backed rate limiting implementations.',
    author: 'rahil',
    date: 'Apr 10, 2026',
    comments: 2,
    readTime: 4,
  },
];