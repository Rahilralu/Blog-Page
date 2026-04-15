import { useState, useEffect } from 'react'
import Login from './Login'
import Signup from './Signup'
import Dashboard from './Dashboard'
import AnimatedBackground from './components/AnimatedBackground'
import CustomCursor from './components/CustomCursor'
import './App.css'
import { handleLoginSuccess, handle_session } from './app.js'

function App() {
    const [currentPage, setCurrentPage] = useState('login')
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        const checkSession = async () => {
            await handle_session(setCurrentPage)
            setIsLoading(false)
        }
        checkSession()
    }, [])

    if (isLoading) return null

    return (
        <>
            <AnimatedBackground />
            <CustomCursor />
            <div className="app-container">
                {currentPage === 'login' && <Login onNavigate={setCurrentPage} onLoginSuccess={(email, password) => handleLoginSuccess(email, password, setCurrentPage, 'Sign-In')} />}
                {currentPage === 'signup' && <Signup onNavigate={setCurrentPage} onLoginSuccess={(email, password) => handleLoginSuccess(email, password, setCurrentPage, 'Sign-Up')}/>}
                {currentPage === 'dashboard' && <Dashboard setCurrentPage={setCurrentPage} />}
            </div>
        </>
    )
}

export default App
