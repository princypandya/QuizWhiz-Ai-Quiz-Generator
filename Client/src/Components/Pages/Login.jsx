import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        
        // Email validation
        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        // Password validation
        if (!password.trim()) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters long';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setValidationErrors({});
        
        if (!validateForm()) {
            return;
        }
        
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
            <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '50px', marginBottom: '50px' }}>
                <div className="shadow p-4 bg-light rounded w-50">
                    <div className="d-flex align-items-center justify-content-center">
                        <span className="fs-4 fw-bold">Welcome Back!</span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {validationErrors.email && <div className="invalid-feedback">{validationErrors.email}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {validationErrors.password && <div className="invalid-feedback">{validationErrors.password}</div>}
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Log In</button>

                        {error && <div className="mt-3 alert alert-danger">{error}</div>}
                        
                        <div className="mt-3 text-center">
                            <span className="text-muted">Don't have an account? </span>
                            <Link to="/Signup" className="text-decoration-none fw-semibold">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;