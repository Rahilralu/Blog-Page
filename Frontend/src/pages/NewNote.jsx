import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function NewNote({ onNavigate }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    return (
        <div className="w-full min-h-screen bg-[#0f0c29] text-white flex flex-col font-sans relative z-10">
            <nav className="p-6">
                <button
                    onClick={() => onNavigate('dashboard')}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-none w-fit group"
                >
                    <div className="p-2 bg-white/5 group-hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Back to Dashboard</span>
                </button>
            </nav>

            <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:px-12 pb-20 flex flex-col h-full">
                <div className="mb-8">
                    <h1 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">Create New Note</h1>
                </div>

                <input
                    type="text"
                    placeholder="Note title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent text-4xl font-bold text-white placeholder-white/20 border-none outline-none mb-6 cursor-none"
                />

                <textarea
                    placeholder="Start writing your note..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full flex-1 bg-transparent text-lg text-white/80 placeholder-white/30 border-none outline-none resize-none leading-relaxed cursor-none min-h-[40vh]"
                />

                <div className="flex justify-between items-center mt-4 text-sm text-white/40 mb-12">
                    <span>{content.length} characters</span>
                </div>

                <div className="flex gap-4 mt-auto pt-8 border-t border-white/10">
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="flex-1 py-4 px-6 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all cursor-none"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onNavigate('/dashboard')}
                        className="flex-[2] py-4 px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-900/40 cursor-none"
                    >
                        Save Note
                    </button>
                </div>
            </main>
        </div>
    );
}
