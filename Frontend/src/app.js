import { setToken } from './auth.js';

export const handleLoginSuccess = async (email, password, setCurrentPage, type) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, type }),
    });

    const data = await res.json();
    if (data.success) {
        setToken(data.access_token);
        setCurrentPage('dashboard');
        return false;  // no error
    }
    return true;  // show error
};

export const handle_session = async (setCurrentPage) => {
    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });
        if (res.ok) {
            const data = await res.json();
            setToken(data.access_token);
            setCurrentPage('dashboard');
        }
    } catch (err) {
        console.error('Session restore failed:', err);
    }
};