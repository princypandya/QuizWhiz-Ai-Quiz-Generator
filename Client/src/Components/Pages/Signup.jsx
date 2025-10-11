import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState(""); // Error message for email validation
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        
        // Name validation
        if (!name.trim()) {
            errors.name = 'Name is required';
        } else if (name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters long';
        }
        
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
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        
        // Confirm password validation
        if (!confirmPassword.trim()) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError(""); // Clear previous errors
        setValidationErrors({});

        if (!validateForm()) {
            return;
        }

        try {
            // Fetch all registered users
            const usersResponse = await axios.get('http://localhost:5175/getUsers'); 
            const users = usersResponse.data;

            // Check if the entered email already exists
            const emailExists = users.some(user => user.email === email);

            if (emailExists) {
                setEmailError("Email already exists. Please use another email.");
                return; // Stop execution
            }

            // Proceed with signup if email is unique
            axios.post('http://localhost:5175/Signup', { name, email, password })
                .then(result => {
                    console.log("Signup successful:", result.data);
                    localStorage.setItem('token', email);
                    navigate('/');
                })
                .catch(err => console.log("Signup error:", err));

        } catch (err) {
            console.log("Error fetching users:", err);
        }
    };

    return (
        <>
            <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '50px', marginBottom: '50px' }}>
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
                                className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                                id="name" 
                                placeholder="Enter your full name" 
                                required 
                                value={name}
                                onChange={(e)=> setName(e.target.value)}
                            />
                            {validationErrors.name && <div className="invalid-feedback">{validationErrors.name}</div>}
                        </div>
                        {/* Email */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input 
                                type="email" 
                                className={`form-control ${validationErrors.email || emailError ? 'is-invalid' : ''}`}
                                id="email" 
                                placeholder="Enter your email address" 
                                required 
                                value={email}
                                onChange={(e)=> setEmail(e.target.value)}
                            />
                            {validationErrors.email && <div className="invalid-feedback">{validationErrors.email}</div>}
                            {emailError && <div className="invalid-feedback">{emailError}</div>}
                        </div>
                        {/* Password */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input 
                                type="password" 
                                className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                                id="password" 
                                placeholder="Enter your password" 
                                required 
                                value={password}
                                onChange={(e)=> setPassword(e.target.value)}
                            />
                            {validationErrors.password && <div className="invalid-feedback">{validationErrors.password}</div>}
                        </div>
                        {/* Confirm Password */}
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input 
                                type="password" 
                                className={`form-control ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                                id="confirmPassword" 
                                placeholder="Confirm your password" 
                                required 
                                value={confirmPassword}
                                onChange={(e)=> setConfirmPassword(e.target.value)}
                            />
                            {validationErrors.confirmPassword && <div className="invalid-feedback">{validationErrors.confirmPassword}</div>}
                        </div>
                        {/* Sign Up Button */}
                        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Signup;
