import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Signup.css';

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError("");
        setPasswordError("");

        // Password validation
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);

        try {
            const result = await signup(name, email, password);
            
            if (result.success) {
                console.log("Signup successful:", result.data);
                navigate('/');
            } else {
                setEmailError(result.error || 'Signup failed');
            }
        } catch (err) {
            console.log("Signup error:", err);
            setEmailError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="d-flex justify-content-center align-items-center vh-100 mt-5 mb-5">
                <div className="shadow p-4 bg-light rounded w-50">
                    <div className="d-flex align-items-center justify-content-center mb-4">
                        <span className="fs-4 fw-bold">Create an account!</span>
                    </div>
                    <form className='fs-0' onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="name" 
                                placeholder="Enter your full name" 
                                required 
                                onChange={(e)=> setName(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        {/* Email */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email" 
                                placeholder="Enter your email address" 
                                required 
                                onChange={(e)=> setEmail(e.target.value)}
                                disabled={loading}
                            />
                            {emailError && <div className="text-danger mt-1">{emailError}</div>}
                        </div>
                        {/* Password */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="password" 
                                placeholder="Enter your password" 
                                required 
                                onChange={(e)=> setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        {/* Confirm Password */}
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="confirmPassword" 
                                placeholder="Confirm your password" 
                                required 
                                onChange={(e)=> setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
                            {passwordError && <div className="text-danger mt-1">{passwordError}</div>}
                        </div>
                        {/* Sign Up Button */}
                        <button 
                            type="submit" 
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Signup;
