import React, { useState } from 'react';
import { getToken } from '../../auth.js';
import { PenTool, CheckCircle, X, ArrowLeft } from 'lucide-react';

export default function CreatePost({ setActiveTab }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) { setError('Title and content are required.'); return; }
    setLoading(true); setError('');
    try {
      const token = getToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, content, published: true }),
      });
      const data = await res.json();
      if (data.success) setActiveTab('Feed');
      else setError(data.message || 'Failed to create post.');
    } catch (err) {
      setError('Server error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => setActiveTab('Feed')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 font-semibold mb-8 group transition-colors"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Feed
      </button>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600">
            <PenTool size={18} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">New Story</h1>
            <p className="text-xs text-slate-400">Share your ideas with the world</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
            {error}
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X size={16} /></button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Give your story a compelling title..."
              className="w-full text-2xl font-bold text-slate-800 placeholder-slate-300 bg-transparent border-0 border-b-2 border-slate-100 focus:border-violet-400 outline-none pb-3 transition-colors"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Content</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Tell your story in your own words..."
              rows={14}
              className="w-full text-[15px] text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 resize-y transition-all placeholder-slate-400"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('Feed')}
              className="px-6 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-full transition-colors shadow-md shadow-violet-200 disabled:opacity-50"
            >
              <CheckCircle size={16} />
              {loading ? 'Publishing...' : 'Publish Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
