import React from 'react'

function Login() {
    return (
        <>
            {/* Main Container */}
            <div className="d-flex justify-content-center align-items-center"
            style={{marginTop: '50px'}}>
                <div className="shadow p-4 bg-light rounded w-50">
                    {/* Header with Image and Title */}
                    <div className="d-flex align-items-center justify-content-center">
                        <img 
                            src="/Images/LogIn.png" 
                            alt="Log In" 
                            className="img-fluid me-3 w-10"
                        />
                        <span className="fs-4 fw-bold">Welcome Back!</span>
                    </div>
                    
                    {/* Form */}
                    <div>
                        <form>
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
                            {/* Login Button */}
                            <button type="submit" className="btn btn-primary w-100">Log In</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
