import { useState, useEffect } from 'react'
import Login from './Login'
import Signup from './Signup'
import Dashboard from './Dashboard'
import NoteDashboard from './pages/NoteDashboard'
import NewNote from './pages/NewNote'
import NoteDetail from './pages/NoteDetail'
import AnimatedBackground from './components/AnimatedBackground'
import CustomCursor from './components/CustomCursor'
import './App.css'
import { handleLoginSuccess } from './app'
import { setToken } from './auth'

function App() {
    const [currentPage, setCurrentPage] = useState('login')

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const res = await fetch('http://localhost:5000/refresh', {
                    method: 'POST',
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.access_token) {
                        setToken(data.access_token);
                    }
                    setCurrentPage('dashboard');
                } else {
                    setCurrentPage('login');
                }
            } catch (err) {
                setCurrentPage('login');
            }
        };
        verifyAuth();
    }, []);


    return (
        <>
            <AnimatedBackground />
            <CustomCursor />
            <div className="app-container">
                {currentPage === 'login' && <Login onLoginSuccess={(email, password) => handleLoginSuccess(email, password, setCurrentPage, 'Sign-In')} onNavigate={setCurrentPage} />}
                {currentPage === 'signup' && <Signup onLoginSuccess={(email, password) => handleLoginSuccess(email, password, setCurrentPage, 'Sign-Up')} onNavigate={setCurrentPage} />}
                {currentPage === 'dashboard' && <NoteDashboard onNavigate={setCurrentPage} />}
                {currentPage === 'note/new' && <NewNote onNavigate={setCurrentPage} />}
                {typeof currentPage === 'string' && currentPage.startsWith('note/') && currentPage !== 'note/new' && <NoteDetail id={currentPage.split('note/')[1]} onNavigate={setCurrentPage} />}
            </div>
        </>
    )
}

export default App
