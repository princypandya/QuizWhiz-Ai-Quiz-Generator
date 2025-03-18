import React from 'react';

function Signup() {
    return (
        <>
            <div className="d-flex justify-content-center align-items-center vh-100 mt-5 mb-5">
                <div className="shadow p-4 bg-light rounded w-50">
                    <div className="d-flex align-items-center justify-content-center mb-4">
                        <img 
                            src="/Images/SignIn.png" 
                            alt="Sign In" 
                            className="img-fluid me-3 w-10"
                        />
                        <span className="fs-4 fw-bold">Create an account!</span>
                    </div>
                    <div>
                        <form className='fs-0'>
                            {/* Username */}
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="username" 
                                    placeholder="Enter your username" 
                                    required 
                                />
                            </div>
                            {/* Name */}
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="name" 
                                    placeholder="Enter your full name" 
                                    required 
                                />
                            </div>
                            {/* Birth Date */}
                            <div className="mb-3">
                                <label htmlFor="birthdate" className="form-label">Birth Date</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    id="birthdate" 
                                    required 
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
                                />
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
                                />
                            </div>
                            {/* Sign Up Button */}
                            <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Signup;
