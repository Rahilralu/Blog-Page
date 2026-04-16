import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getToken } from '../../auth.js';
import {
  ArrowUpRight, Clock, Star, Trash2,
  MessageSquare, Bookmark, TrendingUp, Eye
} from 'lucide-react';

const CATEGORY_COLORS = {
  default: 'bg-violet-100 text-violet-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
};
const CATEGORIES = ['Travel', 'Tech', 'Lifestyle', 'Health', 'Design'];

const CARD_IMAGES = [
  'https://images.unsplash.com/photo-1682685797736-dabb341dc7de?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1688561808434-886a6f27b0c1?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1681400693765-81f08ce60739?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1650032989614-afd0eddb3b26?w=600&auto=format&fit=crop&q=80',
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function readTime(content) {
  return Math.max(1, Math.round(content?.length / 1000)) + ' min read';
}

export default function Feed({ setActiveTab, setSelectedPostId, user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedTab, setFeedTab] = useState('All');

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts`);
      const data = await res.json();
      if (data.success) setPosts(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this post?')) return;
    try {
      const token = getToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setPosts(posts.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleOpen = (id) => {
    setSelectedPostId(id);
    setActiveTab('PostDetail');
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex gap-8">

      {/* ── Main Feed Column ── */}
      <div className="flex-1 min-w-0">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">Discover Stories</h1>
          <p className="text-slate-500 text-sm">Handpicked articles for curious minds.</p>
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-1 mb-8 border-b border-slate-100 pb-0">
          {['All', 'Following', 'Recommended'].map(t => (
            <button
              key={t}
              onClick={() => setFeedTab(t)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-[1px] transition-all duration-150 ${
                feedTab === t
                  ? 'border-violet-600 text-violet-700'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {!posts.length && (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-4xl mb-4">✍️</div>
            <p className="text-slate-500 font-medium">No stories yet. Be the first to write one!</p>
          </div>
        )}

        {/* Featured Hero Card */}
        {posts[0] && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => handleOpen(posts[0].id)}
            className="group relative rounded-3xl overflow-hidden mb-8 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 h-80 bg-slate-900"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${CARD_IMAGES[0]})`, opacity: 0.55 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs bg-violet-500 text-white font-bold px-3 py-1 rounded-full">Featured</span>
                <span className="text-xs text-slate-300 flex items-center gap-1.5">
                  <Clock size={12} /> {formatDate(posts[0].created_at)}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3 line-clamp-2 group-hover:text-violet-200 transition-colors">
                {posts[0].title}
              </h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {posts[0].user_id === user?.userId ? user?.email?.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <span className="text-sm text-slate-300 font-medium">
                    {posts[0].user_id === user?.userId ? 'You' : 'Author'}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs text-slate-400">{readTime(posts[0].content)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {posts[0].user_id === user?.userId && (
                    <button
                      onClick={e => handleDelete(e, posts[0].id)}
                      className="p-2 text-white/50 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white group-hover:bg-violet-500 transition-colors">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Post grid — the rest */}
        <div className="grid sm:grid-cols-2 gap-6">
          {posts.slice(1).map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              onClick={() => handleOpen(post.id)}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-violet-100 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
            >
              {/* Thumbnail */}
              <div className="h-44 bg-slate-100 overflow-hidden shrink-0">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${CARD_IMAGES[i % CARD_IMAGES.length]})` }}
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full">
                    {CATEGORIES[i % CATEGORIES.length]}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={11} /> {formatDate(post.created_at)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-800 group-hover:text-violet-700 transition-colors leading-snug mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                  {post.content}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-bold">
                      {post.user_id === user?.userId ? user?.email?.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {post.user_id === user?.userId ? 'You' : 'Author'}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400">{readTime(post.content)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {post.user_id === user?.userId && (
                      <button
                        onClick={e => handleDelete(e, post.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <button className="p-1.5 text-slate-300 hover:text-violet-500 hover:bg-violet-50 rounded-lg transition-colors">
                      <Bookmark size={14} />
                    </button>
                    <ArrowUpRight size={16} className="text-slate-300 group-hover:text-violet-500 transition-colors ml-1" />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* ── Right Sidebar ── */}
      <aside className="hidden xl:flex flex-col gap-6 w-72 shrink-0">

        {/* Trending Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-violet-600" />
            <h3 className="text-sm font-bold text-slate-800">Trending Now</h3>
          </div>
          <div className="flex flex-col gap-3">
            {posts.slice(0, 4).map((post, i) => (
              <div
                key={post.id}
                onClick={() => handleOpen(post.id)}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <span className="text-xl font-black text-slate-100 group-hover:text-violet-200 transition-colors leading-none mt-0.5 min-w-[24px]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-700 group-hover:text-violet-700 transition-colors leading-snug line-clamp-2 mb-1">
                    {post.title}
                  </p>
                  <span className="text-[10px] text-slate-400">{readTime(post.content)}</span>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No trending posts yet.</p>
            )}
          </div>
        </div>

        {/* Topics */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Explore Topics</h3>
          <div className="flex flex-wrap gap-2">
            {['Travel', 'AI & Tech', 'Lifestyle', 'Photography', 'Health', 'Food', 'Design', 'Coding'].map(tag => (
              <button
                key={tag}
                className="text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-violet-50 hover:text-violet-700 border border-slate-200 hover:border-violet-200 px-3 py-1.5 rounded-full transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Authors placeholder */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Popular Writers</h3>
          <div className="flex flex-col gap-3">
            {['Alex Johnson', 'Maria Chen', 'David Park'].map((name, i) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: ['#7c3aed','#0ea5e9','#10b981'][i] }}>
                    {name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-700">{name}</div>
                    <div className="text-[10px] text-slate-400">{[42, 38, 31][i]} articles</div>
                  </div>
                </div>
                <button className="text-[10px] font-bold text-violet-600 border border-violet-200 px-2.5 py-1 rounded-full hover:bg-violet-600 hover:text-white transition-all">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
