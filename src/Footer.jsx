import React from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Footer() {
  return (
    <footer className="bg-dark text-white mt-5">

      {/* ================= TOP FOOTER ================= */}

      <Container className="py-5">

        <Row className="g-4">

          {/* Brand */}

          <Col lg={4} md={6}>

            <h3 className="fw-bold mb-3">
              <i className="bi bi-book-half me-2"></i>
              RDEC
            </h3>

            <p className="text-white-50">
              A simple and reliable platform for managing books,
              users, discounts, branches, subjects and academic
              information in one place.
            </p>

            <div className="d-flex gap-3 mt-4">

              <a
                href="#"
                className="text-white fs-5"
              >
                <i className="bi bi-facebook"></i>
              </a>

              <a
                href="#"
                className="text-white fs-5"
              >
                <i className="bi bi-instagram"></i>
              </a>

              <a
                href="#"
                className="text-white fs-5"
              >
                <i className="bi bi-twitter-x"></i>
              </a>

              <a
                href="#"
                className="text-white fs-5"
              >
                <i className="bi bi-linkedin"></i>
              </a>

              <a
                href="#"
                className="text-white fs-5"
              >
                <i className="bi bi-github"></i>
              </a>

            </div>

          </Col>


          {/* Quick Links */}

          <Col lg={2} md={6}>

            <h5 className="fw-bold mb-3">
              Quick Links
            </h5>

            <ul className="list-unstyled">

              <li className="mb-2">
                <a
                  href="/"
                  className="text-white-50 text-decoration-none"
                >
                  Home
                </a>
              </li>

              <li className="mb-2">
                <a
                  href="/books"
                  className="text-white-50 text-decoration-none"
                >
                  Books
                </a>
              </li>

              <li className="mb-2">
                <a
                  href="/users"
                  className="text-white-50 text-decoration-none"
                >
                  Users
                </a>
              </li>

              <li className="mb-2">
                <a
                  href="/discounts"
                  className="text-white-50 text-decoration-none"
                >
                  Discounts
                </a>
              </li>

            </ul>

          </Col>


          {/* Useful Links */}

          <Col lg={2} md={6}>

            <h5 className="fw-bold mb-3">
              Useful Links
            </h5>

            <ul className="list-unstyled">

              <li className="mb-2">
                <a
                  href="/profile"
                  className="text-white-50 text-decoration-none"
                >
                  My Profile
                </a>
              </li>

              <li className="mb-2">
                <a
                  href="/settings"
                  className="text-white-50 text-decoration-none"
                >
                  Settings
                </a>
              </li>

              <li className="mb-2">
                <a
                  href="#"
                  className="text-white-50 text-decoration-none"
                >
                  Privacy Policy
                </a>
              </li>

              <li className="mb-2">
                <a
                  href="#"
                  className="text-white-50 text-decoration-none"
                >
                  Terms & Conditions
                </a>
              </li>

            </ul>

          </Col>


          {/* Contact */}

          <Col lg={4} md={6}>

            <h5 className="fw-bold mb-3">
              Contact Us
            </h5>

            <p className="text-white-50 mb-2">
              <i className="bi bi-geo-alt-fill me-2"></i>
              Delhi, India
            </p>

            <p className="text-white-50 mb-2">
              <i className="bi bi-envelope-fill me-2"></i>
              support@rdec.com
            </p>

            <p className="text-white-50 mb-4">
              <i className="bi bi-telephone-fill me-2"></i>
              +91 98765 43210
            </p>


            {/* Newsletter */}

            <h6 className="fw-semibold">
              Subscribe to our newsletter
            </h6>

            <div className="d-flex mt-3">

              <Form.Control
                type="email"
                placeholder="Enter your email"
                className="rounded-start"
              />

              <Button
                variant="success"
                className="rounded-end px-3"
              >
                <i className="bi bi-send-fill"></i>
              </Button>

            </div>

          </Col>

        </Row>

      </Container>


      {/* ================= BOTTOM FOOTER ================= */}

      <div className="border-top border-secondary">

        <Container>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center py-3">

            <p className="mb-0 text-white-50">

              © {new Date().getFullYear()}{" "}
              <span className="text-white fw-semibold">
                RDEC
              </span>
              . All Rights Reserved.

            </p>

            <p className="mb-0 text-white-50">

              Made with
              <i className="bi bi-heart-fill text-danger mx-1"></i>
              for students

            </p>

          </div>

        </Container>

      </div>

    </footer>
  );
}

export default Footer;
