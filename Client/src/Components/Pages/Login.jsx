import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5175/Login', { email, password })
            .then(result => {
                console.log("Login successful:", result.data);
                localStorage.setItem('token', email);
                console.log("Token stored in local storage: "+localStorage.getItem('token'));
                navigate('/');  
            })
            .catch(err => {
                console.log("Login error:", err);
                setError("Invalid email or password");
            });
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
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Log In</button>

                        {error && <div className="mt-3 alert alert-danger">{error}</div>}
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;