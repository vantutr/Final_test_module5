import { Link, NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar expand="lg" sticky="top" className="app-header">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fs-4">
          ClothingStore
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Danh sách Sản phẩm
            </Nav.Link>
          </Nav>
          <Nav>
            <Button as={Link} to="/add" variant="primary">
              + Thêm sản phẩm
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
