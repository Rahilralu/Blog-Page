import React, { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Sparkles } from 'lucide-react';

const mockNote = {
    id: '1',
    title: 'Meeting Notes',
    content: 'Discuss Q3 goals and roadmap. We need to focus on user retention and improving the onboarding experience. Key metrics to track include activation rate and week-1 retention.\n\nNext steps:\n1. Draft new welcome email sequence.\n2. Simplify signup form.\n3. Setup analytics events for feature usage.',
    date: 'Oct 24, 2026',
    updated: 'Oct 25, 2026'
};

export default function NoteDetail({ id, onNavigate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(mockNote.title);
    const [content, setContent] = useState(mockNote.content);
    const [showSummary, setShowSummary] = useState(false);
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);

    const handleAiSummary = () => {
        setShowSummary(true);
        setIsLoadingSummary(true);
        setTimeout(() => {
            setIsLoadingSummary(false);
        }, 1500);
    };

    return (
        <div className="w-full min-h-screen bg-[#0f0c29] text-white flex flex-col font-sans relative z-10">
            <nav className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button
                    onClick={() => onNavigate('dashboard')}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-none group"
                >
                    <div className="p-2 bg-white/5 group-hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Back</span>
                </button>

                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-none whitespace-nowrap ${isEditing ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                    >
                        <Edit className="w-4 h-4" />
                        {isEditing ? 'Done Editing' : 'Edit'}
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg font-medium transition-all cursor-none whitespace-nowrap"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                    <button
                        onClick={handleAiSummary}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-medium transition-all cursor-none shadow-lg shadow-purple-900/30 whitespace-nowrap"
                    >
                        <Sparkles className="w-4 h-4" />
                        AI Summary
                    </button>
                </div>
            </nav>

            <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:px-12 pb-20">
                <div className="mb-10">
                    {isEditing ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white/5 border-b border-white/20 text-3xl sm:text-4xl font-bold text-white px-0 py-2 outline-none mb-4 cursor-none focus:border-purple-500 transition-colors"
                        />
                    ) : (
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">{title}</h1>
                    )}

                    <div className="flex items-center gap-4 text-sm text-white/40">
                        <span>Created {mockNote.date}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                        <span>Last updated {mockNote.updated}</span>
                    </div>
                </div>

                <div className="prose prose-invert prose-purple max-w-none w-full">
                    {isEditing ? (
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full min-h-[40vh] bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 text-base sm:text-lg text-white/90 leading-relaxed outline-none cursor-none focus:border-purple-500 transition-colors resize-y"
                        />
                    ) : (
                        <div className="text-base sm:text-lg text-white/80 leading-relaxed whitespace-pre-wrap">
                            {content}
                        </div>
                    )}
                </div>

                {/* AI Summary Section */}
                {showSummary && (
                    <div className="mt-16 bg-gradient-to-b from-purple-900/20 to-transparent p-[1px] rounded-2xl w-full">
                        <div className="bg-[#120f2e] border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <Sparkles className="w-24 h-24" />
                            </div>

                            <div className="flex items-center gap-2 text-purple-400 font-semibold mb-4">
                                <Sparkles className="w-5 h-5" />
                                <h2>AI Summary</h2>
                            </div>

                            {isLoadingSummary ? (
                                <div className="space-y-3 animate-pulse">
                                    <div className="h-4 bg-purple-500/20 rounded w-3/4"></div>
                                    <div className="h-4 bg-purple-500/20 rounded w-full"></div>
                                    <div className="h-4 bg-purple-500/20 rounded w-5/6"></div>
                                </div>
                            ) : (
                                <p className="text-white/80 leading-relaxed relative z-10">
                                    The meeting centered on Q3 goals, prioritizing user retention and onboarding optimization. Key focus areas are activation rates and week-1 retention. Action items include drafting a new welcome sequence, simplifying signups, and implementing feature analytics.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
