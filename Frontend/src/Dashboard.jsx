import { useEffect, useState } from 'react';
import { getToken, clearToken } from './auth.js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Map, Bookmark, Globe, LogOut,
  Search, Bell, PenTool, User, BarChart3, ChevronDown, Plus, Menu, X
} from 'lucide-react';

import Feed from './components/dashboard/Feed';
import PostDetail from './components/dashboard/PostDetail';
import CreatePost from './components/dashboard/CreatePost';
import Analytics from './components/dashboard/Analytics';
import Profile from './components/dashboard/Profile';

export default function Dashboard({ setCurrentPage }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Feed');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) { setCurrentPage('login'); return; }
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          clearToken();
          setCurrentPage('login');
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        clearToken();
        setCurrentPage('login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [setCurrentPage]);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
        method: 'POST', credentials: 'include',
      });
    } catch (err) { console.error(err); }
    clearToken();
    setCurrentPage('login');
  };

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
      <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const navItems = [
    { icon: <Globe size={20} />, label: 'Discover', tab: 'Feed' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', tab: 'Analytics' },
    { icon: <User size={20} />, label: 'Profile', tab: 'Profile' },
  ];

  const isActive = (tab) => activeTab === tab || (tab === 'Feed' && activeTab === 'PostDetail');

  const renderContent = () => {
    switch (activeTab) {
      case 'Feed': return <Feed setActiveTab={setActiveTab} setSelectedPostId={setSelectedPostId} user={user} />;
      case 'PostDetail': return <PostDetail setActiveTab={setActiveTab} postId={selectedPostId} user={user} />;
      case 'CreatePost': return <CreatePost setActiveTab={setActiveTab} />;
      case 'Analytics': return <Analytics />;
      case 'Profile': return <Profile user={user} />;
      default: return <Feed setActiveTab={setActiveTab} setSelectedPostId={setSelectedPostId} user={user} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Left Sidebar ── */}
      <aside className={`fixed left-0 top-0 bottom-0 w-64 flex flex-col z-30 transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{background: '#ffffff', borderRight: '1px solid #f1f5f9'}}>

        {/* ─── Logo ─── */}
        <div className="h-20 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200 shrink-0">
              <PenTool size={17} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="block text-[17px] font-extrabold tracking-tight text-slate-800 leading-none">Blogger</span>
              <span className="block text-[11px] font-semibold text-violet-500 tracking-widest uppercase leading-tight">Platform</span>
            </div>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* ─── Divider ─── */}
        <div className="mx-5 border-t border-slate-100" />

        {/* ─── Nav ─── */}
        <nav className="flex-1 px-4 py-5 flex flex-col gap-0.5 overflow-y-auto">

          {/* Section label */}
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 mt-1">Main Menu</p>

          {navItems.map(({ icon, label, tab }) => {
            const active = isActive(tab);
            return (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setIsMobileMenuOpen(false); }}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group w-full ${
                  active
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                {/* Left active bar */}
                {active && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-violet-500 rounded-r-full" />
                )}

                {/* Icon container */}
                <span className={`w-8 h-8 flex items-center justify-center rounded-lg shrink-0 transition-colors ${
                  active
                    ? 'bg-violet-100 text-violet-600'
                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                }`}>
                  {icon}
                </span>

                <span className="flex-1 text-left">{label}</span>

                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                )}
              </button>
            );
          })}

          {/* Divider + secondary section */}
          <div className="mx-1 border-t border-slate-100 my-3" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Create</p>

          <button
            onClick={() => { setActiveTab('CreatePost'); setIsMobileMenuOpen(false); }}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group w-full ${
              activeTab === 'CreatePost'
                ? 'bg-violet-50 text-violet-700'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {activeTab === 'CreatePost' && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-violet-500 rounded-r-full" />
            )}
            <span className={`w-8 h-8 flex items-center justify-center rounded-lg shrink-0 transition-colors ${
              activeTab === 'CreatePost'
                ? 'bg-violet-100 text-violet-600'
                : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
            }`}>
              <Plus size={18} />
            </span>
            <span className="flex-1 text-left">Write Story</span>
            <span className="text-[10px] font-bold bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-md">New</span>
          </button>
        </nav>

        {/* ─── Divider ─── */}
        <div className="mx-5 border-t border-slate-100" />

        {/* ─── User card ─── */}
        <div className="px-4 py-4 shrink-0">
          <div className="flex items-center gap-3 p-3 rounded-2xl mb-2" style={{background:'#f8fafc', border:'1px solid #e2e8f0'}}>
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md shrink-0" style={{background:'linear-gradient(135deg,#7c3aed,#d946ef)'}}>
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold truncate leading-tight" style={{color:'#1e293b'}}>
                {user?.email?.split('@')[0]}
              </div>
              <div className="text-[11px] font-semibold truncate flex items-center gap-1 mt-0.5" style={{color:'#7c3aed'}}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{background:'#34d399'}} />
                Pro Member
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2.5 text-[13px] font-semibold text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
          >
            <LogOut size={15} className="transition-colors group-hover:text-red-500" />
            Sign out
          </button>
        </div>
      </aside>


      {/* ── Main ── */}
      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen">

        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-slate-100 h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.04)] gap-3">
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Search */}
            <div className="flex-1 sm:flex-none flex items-center bg-slate-50 border border-slate-200 rounded-full px-3 py-2 sm:px-4 sm:py-2.5 w-full sm:w-64 md:w-72 gap-2 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search posts..."
                className="bg-transparent border-none outline-none text-xs sm:text-sm text-slate-700 placeholder-slate-400 w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('CreatePost')}
              id="write-story-btn"
              className="hidden sm:flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-colors shadow-md shadow-violet-200 hover:shadow-violet-300"
            >
              <Plus size={16} />
              <span>Write Story</span>
            </button>
            <button
              onClick={() => setActiveTab('CreatePost')}
              className="sm:hidden w-9 h-9 flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white rounded-full transition-colors shadow-md shadow-violet-200"
            >
              <Plus size={16} />
            </button>

            <button className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            <button
              onClick={() => setActiveTab('Profile')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-md"
            >
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}