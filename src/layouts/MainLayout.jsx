import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Toaster } from "react-hot-toast";
import Header from "../components/Header";

const MainLayout = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Header />
      <Container as="main" className="py-4">
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;
