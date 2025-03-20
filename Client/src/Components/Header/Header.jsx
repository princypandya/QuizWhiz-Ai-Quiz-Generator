import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { FaHome, FaUserFriends, FaChartLine, FaCogs } from 'react-icons/fa'; // Icons for navigation

function Header() {
  return (
    <>
      {/* Header */}
      <Navbar
        expand="lg"
        className="shadow-sm py-3 fixed-top" // Sticky header
        style={{
          background: 'rgba(0, 123, 255, 0.7)', // Light blue with transparency
          backdropFilter: 'blur(10px)', // Glassmorphism effect
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)', // Subtle border
        }}
      >
        <Container>
          {/* Brand Name with Logo */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center me-auto" // Push logo to the left
            style={{
              height: '50px', // Set header height
            }}
          >
            <img
              src="../../../public/Images/logo.png" // Path to your logo
              alt="QuizWhiz Logo"
              style={{
                height: '12vh', // Scales with viewport height
                width: '11vw', // Scales with viewport width
                minHeight: '50px',
                minWidth: '120px',
                maxWidth: '220px',
                maxHeight: '70px',
                objectFit: 'cover', // Ensure the logo fits without distortion
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
                to="/1V1"
                className="text-dark d-flex align-items-center mx-3 hover-effect"
              >
                <FaUserFriends className="me-2" /> 1V1
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
                to="/Custom"
                className="text-dark d-flex align-items-center mx-3 hover-effect"
              >
                <FaCogs className="me-2" /> Custom
              </Nav.Link>

              {/* Login/Signup Pill */}
              <div className="d-flex rounded-pill bg-white border border-1 border-dark/10 overflow-hidden">
                <Nav.Link
                  as={Link}
                  to="/Login"
                  className="text-dark px-4 py-2 text-decoration-none hover-effect"
                >
                  Login
                </Nav.Link>
                <div className="border-start border-dark/10"></div> {/* Divider */}
                <Link
                  to="/Signup"
                  className="text-dark px-4 py-2 text-decoration-none hover-effect"
                >
                  Signup
                </Link>
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
            background: #4f6dff; // Accent color
            transition: width 0.3s ease;
          }
          .hover-effect:hover::after {
            width: 100%;
          }
          .hover-effect:hover {
            color: #4f6dff !important; // Accent color on hover
          }
        `}
      </style>
    </>
  );
}

export default Header;