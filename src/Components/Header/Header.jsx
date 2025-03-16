import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">QuizWhiz</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home" className="text-white" >Home</Nav.Link>
            <Nav.Link as={Link} to="/features" className="text-white" >1V1</Nav.Link>
            <Nav.Link as={Link} to="/Results" className="text-white" >Results</Nav.Link>
            <Nav.Link as={Link} to="/Custom" className="text-white" >Custom</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

    </>
  );
}

export default Header;