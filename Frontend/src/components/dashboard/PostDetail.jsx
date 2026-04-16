import React, { useEffect, useState } from 'react';
import { getToken } from '../../auth.js';
import { ArrowLeft, Clock, MessageSquare, Trash2, Send, Bookmark } from 'lucide-react';

const CARD_IMAGE = 'https://images.unsplash.com/photo-1682685797736-dabb341dc7de?w=1200&auto=format&fit=crop&q=80';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
function readTime(content) {
  return Math.max(1, Math.round(content?.length / 1000)) + ' min read';
}

export default function PostDetail({ setActiveTab, postId, user }) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commentRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comments/post/${postId}`),
        ]);
        const postData = await postRes.json();
        if (postData.success) setPost(postData.data.find(p => p.id === postId));

        const commentData = await commentRes.json();
        if (commentData.success) setComments(commentData.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const token = getToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comments/post/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ body: newComment }),
      });
      const data = await res.json();
      if (data.success) { setComments(prev => [...prev, data.data]); setNewComment(''); }
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const token = getToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comments/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setComments(prev => prev.filter(c => c.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!post) return (
    <div className="text-center py-20">
      <p className="text-slate-500 mb-4">Post not found.</p>
      <button onClick={() => setActiveTab('Feed')} className="text-violet-600 font-semibold hover:underline">← Back to Feed</button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <button
        onClick={() => setActiveTab('Feed')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 font-semibold mb-8 group transition-colors"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Feed
      </button>

      {/* Hero Image */}
      <div className="h-72 rounded-3xl overflow-hidden mb-8 shadow-md">
        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${CARD_IMAGE})` }} />
      </div>

      {/* Article */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-12 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold text-violet-700 bg-violet-50 px-3 py-1 rounded-full">Article</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock size={11} /> {formatDate(post.created_at)} · {readTime(post.content)}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">{post.title}</h1>

        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
              {post.user_id === user?.userId ? user?.email?.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">{post.user_id === user?.userId ? 'You' : 'Author'}</div>
              <div className="text-xs text-slate-400">Pro Member</div>
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-violet-600 hover:bg-violet-50 px-3 py-2 rounded-lg transition-colors">
            <Bookmark size={14} /> Save
          </button>
        </div>

        <div className="text-slate-600 leading-relaxed space-y-4 text-[15px]">
          {post.content.split('\n').map((p, i) => p.trim() && <p key={i}>{p}</p>)}
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <MessageSquare size={18} className="text-violet-600" />
          Comments
          <span className="ml-1 bg-violet-50 text-violet-600 text-xs font-bold px-2 py-0.5 rounded-full">{comments.length}</span>
        </h3>

        {/* Comment form */}
        <form onSubmit={handleAddComment} className="mb-8">
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 relative">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 resize-none transition-all"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="absolute bottom-3 right-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-violet-200"
              >
                <Send size={12} /> Post
              </button>
            </div>
          </div>
        </form>

        {/* Comment list */}
        <div className="flex flex-col gap-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3 group">
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                {comment.user_id === user?.userId ? user?.email?.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 bg-slate-50 rounded-2xl px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700">{comment.user_id === user?.userId ? 'You' : 'Reader'}</span>
                  {comment.user_id === user?.userId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1 rounded-lg"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{comment.body}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="text-center text-slate-400 text-sm py-6 bg-slate-50 rounded-2xl">
              No comments yet — start the conversation!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
