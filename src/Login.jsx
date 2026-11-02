
import React, { useState } from "react";
import { Button, Form, Modal, Alert } from "react-bootstrap";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Login({ show, handleClose, onSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function login(e) {
    e.preventDefault();

    if (!email || !password) {
      setMsg({
        type: "danger",
        text: "Please enter email and password",
      });
      return;
    }

    setLoading(true);
    setMsg({ type: "", text: "" });

    axios({
      url: `${apiUrl}/login/user`,
      method: "POST",
      data: { email, password },
    })
      .then((res) => {
        console.log("Login Response:", res.data);

        const token =
          res.data?.token ||
          res.data?.data?.token ||
          res.data?.accessToken;

        const user =
          res.data?.user ||
          res.data?.data?.user ||
          res.data?.data;

        const userEmail =
          res.data?.user?.email ||
          res.data?.data?.email ||
          res.data?.email ||
          email;

        if (!token) {
          setMsg({
            type: "danger",
            text: "Backend did not send token!",
          });
          return;
        }

        // Save login session
        localStorage.setItem("userToken", token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("email", userEmail);
    console.log("Current URL:", window.location.href);
console.log("Login flag:", localStorage.getItem("isLoggedIn"));
console.log("Token exists:", !!localStorage.getItem("userToken"));
console.log("All storage:", { ...localStorage });
        if (user) {
          localStorage.setItem(
            "loggedInUser",
            JSON.stringify(user)
          );
        }

        setMsg({
          type: "success",
          text: "Login successful!",
        });

        if (onSuccess) onSuccess();

        setTimeout(() => {
          handleClose();
          setEmail("");
          setPassword("");
          setMsg({ type: "", text: "" });
        }, 600);
      })
      .catch((err) => {
        setMsg({
          type: "danger",
          text:
            err.response?.data?.message ||
            "Invalid email or password",
        });
      })
      .finally(() => setLoading(false));
  }

  function signUp(e) {
    e.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setMsg({
        type: "danger",
        text: "Please fill all fields",
      });
      return;
    }

    if (password !== confirmPassword) {
      setMsg({
        type: "danger",
        text: "Password mismatch",
      });
      return;
    }

    setLoading(true);
    setMsg({ type: "", text: "" });

    axios({
      url: `${apiUrl}/create/user`,
      method: "POST",
      data: { firstName, lastName, email, password },
    })
      .then((res) => {
        setMsg({
          type: "success",
          text: res.data?.message || "Account created! Please login.",
        });

        setTimeout(() => {
          setIsSignUp(false);
          setFirstName("");
          setLastName("");
          setPassword("");
          setConfirmPassword("");
          setMsg({ type: "", text: "" });
        }, 1000);
      })
      .catch((err) => {
        setMsg({
          type: "danger",
          text:
            err.response?.data?.message ||
            "Something went wrong",
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-3">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {msg.text && <Alert variant={msg.type}>{msg.text}</Alert>}

        {!isSignUp ? (
          <Form onSubmit={login}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="lg"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="lg"
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 rounded-pill py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center mt-4">
              <span className="text-muted">
                Don't have an account?{" "}
              </span>
              <Button
                variant="link"
                className="p-0 fw-semibold text-decoration-none"
                onClick={() => {
                  setIsSignUp(true);
                  setMsg({ type: "", text: "" });
                }}
              >
                Create an account
              </Button>
            </div>
          </Form>
        ) : (
          <Form onSubmit={signUp}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              className="w-100 rounded-pill py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>

            <div className="text-center mt-4">
              <span className="text-muted">
                Already have an account?{" "}
              </span>
              <Button
                variant="link"
                className="p-0 fw-semibold text-decoration-none"
                onClick={() => {
                  setIsSignUp(false);
                  setMsg({ type: "", text: "" });
                }}
              >
                Login
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default Login;
