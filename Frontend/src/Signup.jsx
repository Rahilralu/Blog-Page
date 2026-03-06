import { useState } from 'react'
import './App.css'

function Signup({ onLoginSuccess,onNavigate }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage,setErrorMessage] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const error = await onLoginSuccess(email, password)
        if(error){
            setErrorMessage(true);
        }
    }

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2>Create an Account</h2>
                <p className="subtitle">Sign up to get started.</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="e.g. user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <button type="submit" className="login-btn">Sign Up</button>
                </form>
                <p className="auth-switch">
                    Already have an account? <span onClick={() => onNavigate('login')}>Sign In</span>
                </p>
                {errorMessage && (
                <p style={{ color: "red", marginTop: "10px" }}>
                    User already Exists
                </p>
                )}
            </div>
        </div>
    )
}

export default Signup
