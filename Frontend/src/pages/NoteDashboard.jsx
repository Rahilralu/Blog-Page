import React from 'react';
import { Plus, Trash2, FileText, LogOut, File } from 'lucide-react';

const mockNotes = [
    { id: '1', title: 'Meeting Notes', content: 'Discuss Q3 goals and roadmap. We need to focus on user retention and improving the onboarding experience.', date: 'Oct 24, 2026' },
    { id: '2', title: 'Grocery List', content: 'Milk, eggs, bread, and some fruits. Remember to get the organic ones from the farmers market.', date: 'Oct 23, 2026' },
    { id: '3', title: 'Project Ideas', content: '1. AI habit tracker 2. Personal finance dashboard 3. Smart home remote control app', date: 'Oct 21, 2026' },
];

export default function NoteDashboard({ onNavigate }) {
    const notes = mockNotes;

    return (
        <div className="w-full min-h-screen bg-[#0f0c29] text-white flex flex-col font-sans">
            <nav className="flex justify-between items-center p-6 border-b border-white/10 backdrop-blur-md bg-black/20 z-10 w-full relative">
                <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <FileText className="w-6 h-6 text-purple-400" />
                    NoteVault
                </h1>
                <button
                    onClick={() => onNavigate('login')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10 cursor-none"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </nav>

            <main className="flex-1 max-w-6xl w-full mx-auto p-6 lg:p-12 relative z-10 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Your Notes</h2>
                        <p className="text-white/60">Everything in one place.</p>
                    </div>
                    <button
                        onClick={() => onNavigate('note/new')}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 transform hover:-translate-y-0.5 cursor-none"
                    >
                        <Plus className="w-5 h-5" />
                        New Note
                    </button>
                </div>

                {notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 text-center border border-dashed border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm flex-1">
                        <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                            <File className="w-10 h-10 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
                        <p className="text-white/50 max-w-sm mb-8">Create your first note to get started with capturing your ideas and thoughts.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map(note => (
                            <div
                                key={note.id}
                                onClick={() => onNavigate(`note/${note.id}`)}
                                className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 cursor-none flex flex-col h-64 backdrop-blur-sm shadow-xl"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-xl text-white/90 group-hover:text-purple-300 transition-colors line-clamp-1 pr-6">{note.title}</h3>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); }}
                                        className="absolute top-6 right-6 p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors z-20 cursor-none"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-white/60 line-clamp-4 flex-1 text-sm leading-relaxed">
                                    {note.content}
                                </p>
                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center text-xs text-white/40 font-medium">
                                    {note.date}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
