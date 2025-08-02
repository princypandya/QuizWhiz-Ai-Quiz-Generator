import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);
            
            if (result.success) {
                console.log("Login successful:", result.data);
                navigate('/');
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            console.log("Login error:", err);
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '50px' }}>
                <div className="shadow p-4 bg-light rounded w-50">
                    <div className="d-flex align-items-center justify-content-center">
                        <span className="fs-4 fw-bold">Welcome Back!</span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>

                        {error && <div className="mt-3 alert alert-danger">{error}</div>}
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;