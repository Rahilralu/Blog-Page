import { useState } from 'react'
import './App.css'

function Login({ onLoginSuccess, onNavigate }) {
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
                <h2>Welcome Back</h2>
                <p className="subtitle">Enter your credentials to access the dashboard.</p>
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
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit" className="login-btn">Sign In</button>
                </form>
                <p className="auth-switch">
                    Don't have an account? <span onClick={() => onNavigate('signup')}>Sign Up</span>
                </p>
                {errorMessage && (
                <p style={{ color: "red", marginTop: "10px" }}>
                    THe password is mismatched
                </p>
                )}
            </div>
        </div>
    )
}

export default Login
