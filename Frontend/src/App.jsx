import { useState, useEffect } from 'react'
import Login from './Login'
import Signup from './Signup'
import Dashboard from './Dashboard'
import AnimatedBackground from './components/AnimatedBackground'
import CustomCursor from './components/CustomCursor'
import './App.css'
import { handleLoginSuccess, handle_session } from './app'

function App() {
    const [currentPage, setCurrentPage] = useState('login')
    useEffect(() => {
        handle_session(setCurrentPage)
    }, [])

    if (currentPage === null) return null

    return (
        <>
            <AnimatedBackground />
            <CustomCursor />
            <div className="app-container">
                {currentPage === 'login' && <Login onLoginSuccess={(email, password) => handleLoginSuccess(email, password, setCurrentPage, 'Sign-In')} onNavigate={setCurrentPage} />}
                {currentPage === 'signup' && <Signup onLoginSuccess={(email, password) => handleLoginSuccess(email, password, setCurrentPage, 'Sign-Up')} onNavigate={setCurrentPage} />}
                {currentPage === 'dashboard' && <Dashboard />}
            </div>
        </>
    )
}

export default App
