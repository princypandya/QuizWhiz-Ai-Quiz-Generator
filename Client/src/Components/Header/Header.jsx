import { useState, useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUserFriends, FaChartLine, FaCogs, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleAuthAction = (action) => {
    setShowProfileDropdown(false);
    navigate(`/${action.toLowerCase()}`);
  };

  return (
    <>
      {/* Header */}
      <Navbar
        expand="lg"
        className="shadow-sm py-3 fixed-top"
        style={{
          background: 'rgba(0, 123, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
        }}
      >
        <Container>
          {/* Brand Name with Logo */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center me-auto"
            style={{
              height: '50px',
            }}
          >
            <img
              src="../../../public/Images/logo.png"
              alt="QuizWhiz Logo"
              style={{
                height: '12vh',
                width: '11vw',
                minHeight: '50px',
                minWidth: '120px',
                maxWidth: '220px',
                maxHeight: '70px',
                objectFit: 'cover',
              }}
            />
          </Navbar.Brand>

          {/* Toggle Button for Mobile */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>

          {/* Navigation Links */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link
                as={Link}
                to="/"
                className="text-dark d-flex align-items-center mx-3 hover-effect"
              >
                <FaHome className="me-2" /> Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/Results"
                className="text-dark d-flex align-items-center mx-3 hover-effect"
              >
                <FaChartLine className="me-2" /> Results
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/Quiz"
                className="text-dark d-flex align-items-center mx-3 hover-effect"
              >
                <FaCogs className="me-2" /> Quiz
              </Nav.Link>

              {/* Profile Icon */}
              <div className="position-relative ms-3" ref={dropdownRef}>
                <motion.button
                  onClick={handleProfileClick}
                  className="btn btn-link text-dark p-2 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    background: 'rgba(255, 255, 255, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUser size={18} />
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="position-absolute top-100 end-0 mt-2"
                      style={{ zIndex: 1001 }}
                    >
                      <div
                        className="bg-white rounded-lg shadow-lg border border-gray-200"
                        style={{ minWidth: '200px' }}
                      >
                        {isAuthenticated ? (
                          <>
                            {/* User Info */}
                            <div className="p-3 border-bottom border-gray-200">
                              <div className="d-flex align-items-center">
                                <div
                                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                  }}
                                >
                                  <FaUser size={16} />
                                </div>
                                <div>
                                  <div className="fw-bold text-dark">
                                    {user?.name || 'User'}
                                  </div>
                                  <div className="text-muted small">
                                    {user?.email || 'user@example.com'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Logout Button */}
                            <motion.button
                              onClick={handleLogout}
                              className="w-100 btn btn-link text-danger text-decoration-none p-3 d-flex align-items-center"
                              whileHover={{ background: 'rgba(220, 53, 69, 0.1)' }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <FaSignOutAlt className="me-2" />
                              Logout
                            </motion.button>
                          </>
                        ) : (
                          <>
                            {/* Login Button */}
                            <motion.button
                              onClick={() => handleAuthAction('Login')}
                              className="w-100 btn btn-link text-dark text-decoration-none p-3 d-flex align-items-center"
                              whileHover={{ background: 'rgba(0, 0, 0, 0.05)' }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <FaUser className="me-2" />
                              Login
                            </motion.button>

                            {/* Signup Button */}
                            <motion.button
                              onClick={() => handleAuthAction('Signup')}
                              className="w-100 btn btn-link text-primary text-decoration-none p-3 d-flex align-items-center border-top border-gray-200"
                              whileHover={{ background: 'rgba(0, 123, 255, 0.1)' }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <FaUser className="me-2" />
                              Signup
                            </motion.button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Padding to Prevent Header Overlap */}
      <div style={{ paddingTop: '80px' }}></div>

      {/* Custom CSS for Hover Effect */}
      <style>
        {`
          .hover-effect {
            position: relative;
            transition: all 0.3s ease;
          }
          .hover-effect::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: #4f6dff;
            transition: width 0.3s ease;
          }
          .hover-effect:hover::after {
            width: 100%;
          }
          .hover-effect:hover {
            color: #4f6dff !important;
          }
        `}
      </style>
    </>
  );
}

export default Header;