import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaChartLine,
  FaCogs,
  FaUserCircle,
} from 'react-icons/fa';
import { useEffect, useState } from 'react';

function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // track route changes
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = token ? token : '';
    console.log("Token:", token);
    console.log("Email:", email);
    setIsLoggedIn(!!token);
    setUserEmail(email || '');
  }, [location]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setIsLoggedIn(false);
    setUserEmail('');
    setShowDropdown(false);
    navigate('/');
  };


  return (
    <>
      <Navbar
        expand="lg"
        className="shadow-sm py-3 fixed-top"
        style={{
          background: 'rgba(119, 185, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center me-auto"
            style={{ height: '50px' }}
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

          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>

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

              {/* Profile Dropdown */}
              <div className="position-relative ms-3">
                <FaUserCircle
                  size={32}
                  className="text-white"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowDropdown((prev) => !prev)}
                />
                {showDropdown && (
                  <div
                    className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm"
                    style={{ minWidth: '160px', zIndex: 1000 }}
                  >
                    {isLoggedIn ? (
                      <>
                        <div className="profile-email-box d-flex align-items-center">
                          <div className="icon-circle me-2">
                            <FaUserCircle size={20} className="text-white" />
                          </div>
                          <div className="text-truncate">
                            <div className="fw-semibold small text-dark">{userEmail}</div>
                            <div className="text-muted" style={{ fontSize: '11px' }}>Logged in</div>
                          </div>
                        </div>


                        <button
                          className="w-100 text-start px-4 py-2 bg-white border-0 text-danger hover-effect red-hover"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/Login"
                          className="d-block px-4 py-2 text-dark text-decoration-none hover-effect blue-hover"
                          onClick={() => setShowDropdown(false)}
                        >
                          Login
                        </Link>
                        <Link
                          to="/Signup"
                          className="d-block px-4 py-2 text-dark text-decoration-none hover-effect blue-hover"
                          onClick={() => setShowDropdown(false)}
                        >
                          Signup
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div style={{ paddingTop: '80px' }}></div>

      <style>
        {`
          .hover-effect {
            position: relative;
            transition: color 0.25s ease, transform 0.2s ease;
          }

          .hover-effect::after {
            content: '';
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
            width: 0%;
            height: 2px;
            background-color: currentColor;
            transition: width 0.3s ease;
          }

          .profile-email-box {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #e0e0e0;
            background: linear-gradient(to right, #f0f4ff, #ffffff);
            border-radius: 6px 6px 0 0;
            box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease-in-out;
          }
                  
          .profile-email-box:hover {
            background: linear-gradient(to right, #e2ecff, #f9f9f9);
          }
                  
          .icon-circle {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #6c63ff;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease;
          }
                  
          .icon-circle:hover {
            transform: scale(1.1);
          }
                  
          .text-truncate {
            max-width: 140px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .hover-effect:hover::after {
            width: 80%;
          }

          .hover-effect:hover {
            color: #ffffff !important;
            transform: translateY(-2px);
          }

          .blue-hover:hover {
            color: #0d6efd !important;
          }

          .red-hover:hover {
            color: #dc3545 !important;
          }
        `}
      </style>
    </>
  );
}

export default Header;
