
import { useEffect, useState, useContext } from "react";
import {
  Button,
  Container,
  Nav,
  Navbar,
  Dropdown,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  PersonCircle,
  MoonStarsFill,
  SunFill,
  Cart3,
} from "react-bootstrap-icons";

import Login from "./Login";
import { ThemeContext } from "./Context/ThemeContext";
import { useSelector } from "react-redux";

function NavBar() {
  // Navigation
  const navigate = useNavigate();

  // Redux cart state
  const { products } = useSelector((state) => state.cart);

  // Login state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Theme context
  const { theme, toggleTheme } = useContext(ThemeContext);

  // ==============================
  // CART NAVIGATION
  // ==============================
  function handleCartClick() {
    navigate("/cart");
  }

  // ==============================
  // CHECK LOGIN
  // ==============================
  function checkLogin() {
    const token = localStorage.getItem("userToken");
    const userData = localStorage.getItem("loggedInUser");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid user data:", error);
        setUser(null);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }

  // ==============================
  // INITIAL LOAD
  // ==============================
  useEffect(() => {
    checkLogin();

    function handleStorageChange() {
      checkLogin();
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  // ==============================
  // LOGIN
  // ==============================
  function goForLogin() {
    setShowLoginModal(true);
  }

  function closeLogin() {
    setShowLoginModal(false);
    checkLogin();
  }

  // ==============================
  // LOGOUT
  // ==============================
  function logout() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("loggedInUser");

    setIsLoggedIn(false);
    setUser(null);

    console.log("User logged out");
  }

  // ==============================
  // CART COUNT
  // ==============================
  const cartCount = products.reduce(
    (total, product) =>
      total + (product.quantity || 1),
    0
  );

  // ==============================
  // NAVBAR UI
  // ==============================
  return (
    <>
      <Navbar
        expand="lg"
        bg={theme}
        data-bs-theme={theme}
        sticky="top"
        className="shadow-sm"
      >
        <Container>
          {/* LOGO */}
          <Navbar.Brand
            href="#home"
            className="fw-bold fs-3 text-success"
          >
            RDEC
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            {/* NAV LINKS */}
            <Nav className="me-auto mx-lg-4">
              <Nav.Link
                href="/"
                className="fw-semibold px-3"
              >
                Home
              </Nav.Link>

              <Nav.Link
  href="/footer"
  className="fw-semibold px-3"
>
  Features
</Nav.Link>

              <Nav.Link
                href="#pricing"
                className="fw-semibold px-3"
              >
                Pricing
              </Nav.Link>

              <Nav.Link
                href="/footer"
                className="fw-semibold px-3"
              >
                About
              </Nav.Link>
              <Nav.Link href="/myorders" className="fw-semibold px-3">My Order</Nav.Link>
            </Nav>

            {/* RIGHT SIDE */}
            <div className="d-flex align-items-center gap-3 ms-auto mt-3 mt-lg-0">

              {/* THEME TOGGLE */}
              <Button
                variant={
                  theme === "light"
                    ? "outline-dark"
                    : "outline-light"
                }
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "40px",
                  height: "40px",
                }}
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <MoonStarsFill />
                ) : (
                  <SunFill />
                )}
              </Button>

              {/* CART ICON WITH BADGE */}
              <Button
                variant={
                  theme === "light"
                    ? "outline-dark"
                    : "outline-light"
                }
                onClick={handleCartClick}
                aria-label={`Shopping cart, ${cartCount} items`}
                className="rounded-circle position-relative d-flex align-items-center justify-content-center"
                style={{
                  width: "40px",
                  height: "40px",
                }}
              >
                <Cart3 size={18} />

                {cartCount > 0 && (
                  <Badge
                    bg="danger"
                    pill
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{
                      fontSize: "10px",
                      zIndex: 1,
                    }}
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* LOGIN / USER */}
              {!isLoggedIn ? (
                <Button
                  variant="success"
                  className="rounded-pill px-4 fw-semibold"
                  onClick={goForLogin}
                >
                  Login
                </Button>
              ) : (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant={theme}
                    id="user-dropdown"
                    className="border-0 shadow-none d-flex align-items-center p-0"
                    aria-label="User menu"
                  >
                    <PersonCircle
                      size={38}
                      className="text-success"
                    />
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow border-0 rounded-3 mt-2">
                    <Dropdown.Header>
                      <div className="fw-bold">
                        {user?.firstName || "User"}{" "}
                        {user?.lastName || ""}
                      </div>

                      <small className="text-muted">
                        {user?.email}
                      </small>
                    </Dropdown.Header>

                    <Dropdown.Divider />

                    <Dropdown.Item href="#profile">
                      👤 My Profile
                    </Dropdown.Item>

                    <Dropdown.Item href="#settings">
                      ⚙️ Settings
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item
                      onClick={logout}
                      className="text-danger"
                    >
                      🚪 Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <Login
          show={showLoginModal}
          handleClose={closeLogin}
          onSuccess={() => {
            checkLogin();
            setShowLoginModal(false);
          }}
        />
      )}

      {/* CUSTOM STYLES */}
      <style>{`
        #user-dropdown::after {
          display: none;
        }

        .navbar {
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
}

export default NavBar;
