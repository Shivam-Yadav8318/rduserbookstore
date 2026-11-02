import { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const apiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const shippingFields = [
  ["firstName", "First name"],
  ["lastName", "Last name"],
  ["mobileNo", "Mobile number"],
  ["addressLine1", "Address line 1"],
  ["addressLine2", "Address line 2"],
  ["city", "City"],
  ["state", "State"],
  ["country", "Country"],
  ["pincode", "PIN code"],
];

const formatPrice = amount =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

function MyOrder() {
  const navigate = useNavigate();
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem("email")?.trim())
  );
  const [error, setError] = useState(() =>
    localStorage.getItem("email")?.trim()
      ? ""
      : "Your email was not found. Please sign in again."
  );
  const [actionError, setActionError] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [shippingDetails, setShippingDetails] = useState({});
  const [saving, setSaving] = useState(false);
  const [workingOrderId, setWorkingOrderId] = useState("");

  useEffect(() => {
    let active = true;

    const fetchMyOrders = async () => {
      const email = localStorage.getItem("email")?.trim();
      if (!email) return;

      try {
        const response = await axios.post(`${apiUrl}/api/payment/myorders`, {
          email,
        });
        if (!active) return;
        setMyOrders(Array.isArray(response.data.data) ? response.data.data : []);
        setError("");
      } catch (requestError) {
        if (!active) return;
        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Unable to fetch your orders."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchMyOrders();
    return () => {
      active = false;
    };
  }, []);

  const beginEditing = order => {
    setEditingOrder(order);
    setShippingDetails({
      firstName: order.firstName || "",
      lastName: order.lastName || "",
      mobileNo: order.mobileNo || "",
      addressLine1: order.addressLine1 || "",
      addressLine2: order.addressLine2 || "",
      city: order.city || "",
      state: order.state || "",
      country: order.country || "",
      pincode: order.pincode || order.pinCode || "",
    });
    setActionError("");
  };

  const saveShippingDetails = async event => {
    event.preventDefault();
    if (!editingOrder) return;

    setSaving(true);
    setActionError("");
    try {
      const email = localStorage.getItem("email")?.trim();
      const response = await axios.patch(
        `${apiUrl}/api/payment/${encodeURIComponent(editingOrder.transactionId)}/shipping`,
        { ...shippingDetails, email }
      );
      setMyOrders(orders =>
        orders.map(order =>
          order._id === editingOrder._id ? response.data.data : order
        )
      );
      setEditingOrder(null);
    } catch (requestError) {
      setActionError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to update shipping details."
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelOrder = async order => {
    if (
      !window.confirm(
        "Cancel this order? The payment will not be refunded automatically."
      )
    ) {
      return;
    }

    setWorkingOrderId(order._id);
    setActionError("");
    try {
      const email = localStorage.getItem("email")?.trim();
      const response = await axios.post(
        `${apiUrl}/api/payment/${encodeURIComponent(order.transactionId)}/cancel`,
        { email }
      );
      setMyOrders(orders =>
        orders.map(item => (item._id === order._id ? response.data.data : item))
      );
    } catch (requestError) {
      setActionError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to cancel this order."
      );
    } finally {
      setWorkingOrderId("");
    }
  };

  const hideOrder = async order => {
    if (!window.confirm("Remove this order from your order list?")) return;

    setWorkingOrderId(order._id);
    setActionError("");
    try {
      const email = localStorage.getItem("email")?.trim();
      await axios.delete(
        `${apiUrl}/api/payment/${encodeURIComponent(order.transactionId)}`,
        { data: { email } }
      );
      setMyOrders(orders => orders.filter(item => item._id !== order._id));
    } catch (requestError) {
      setActionError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to remove this order."
      );
    } finally {
      setWorkingOrderId("");
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading your orders...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">{error}</Alert>
        <Button variant="success" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const completedTotal = myOrders
    .filter(order => order.status === "Completed")
    .reduce((total, order) => total + Number(order.amount || 0), 0);

  return (
    <Container className="py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Orders</h2>
          <p className="text-muted mb-0">
            {myOrders.length} {myOrders.length === 1 ? "order" : "orders"} total
          </p>
        </div>
        <Card className="border-0 shadow-sm">
          <Card.Body className="py-2 px-3">
            <span className="text-muted me-2">Completed order total</span>
            <strong>{formatPrice(completedTotal)}</strong>
          </Card.Body>
        </Card>
      </div>

      {actionError && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setActionError("")}
        >
          {actionError}
        </Alert>
      )}

      {myOrders.length === 0 ? (
        <div className="text-center py-5">
          <h4>No orders found</h4>
          <p className="text-muted">Your purchases will appear here.</p>
          <Button variant="success" onClick={() => navigate("/")}>
            Shop Now
          </Button>
        </div>
      ) : (
        <Row className="g-4">
          {myOrders.map(order => {
            const products = Array.isArray(order.products) ? order.products : [];
            const isWorking = workingOrderId === order._id;

            return (
              <Col md={6} lg={4} key={order._id}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <h5 className="fw-bold mb-0">
                        {products.length === 1
                          ? products[0].bookTitle || "Book Order"
                          : `${products.length || 1} items`}
                      </h5>
                      <Badge
                        bg={
                          order.status === "Completed"
                            ? "success"
                            : order.status === "Cancelled"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {order.status || "Pending"}
                      </Badge>
                    </div>

                    <p className="small text-muted text-break mb-2">
                      Order ID: {order.transactionId || order._id}
                    </p>

                    {products.length > 0 && (
                      <ul className="list-unstyled mb-3">
                        {products.map((product, index) => (
                          <li
                            key={product._id || `${product.bookTitle}-${index}`}
                            className="d-flex justify-content-between gap-2 small py-1"
                          >
                            <span>
                              {product.bookTitle || "Book"}
                              {Number(product.quantity) > 1 &&
                                ` × ${product.quantity}`}
                            </span>
                            <span className="text-nowrap">
                              {formatPrice(
                                Number(product.price || 0) *
                                  Number(product.quantity || 1)
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <p className="mb-2">
                      <strong>Order total: </strong>
                      {formatPrice(order.amount)}
                    </p>
                    <p className="mb-2">
                      <strong>Date: </strong>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN")
                        : "N/A"}
                    </p>
                    <p className="mb-3">
                      <strong>Ship to: </strong>
                      {[order.city, order.state].filter(Boolean).join(", ") ||
                        "Address not provided"}
                    </p>

                    {order.status === "Cancelled" && (
                      <Alert variant="warning" className="small py-2">
                        Cancelled. No refund has been issued.
                      </Alert>
                    )}

                    <div className="d-flex flex-wrap gap-2 mt-auto pt-2">
                      {order.status !== "Cancelled" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => beginEditing(order)}
                            disabled={isWorking}
                          >
                            Edit shipping
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => cancelOrder(order)}
                            disabled={isWorking}
                          >
                            {isWorking ? "Working..." : "Cancel order"}
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => hideOrder(order)}
                        disabled={isWorking}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal show={Boolean(editingOrder)} onHide={() => setEditingOrder(null)}>
        <Form onSubmit={saveShippingDetails}>
          <Modal.Header closeButton>
            <Modal.Title>Edit shipping details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {actionError && <Alert variant="danger">{actionError}</Alert>}
            <Row className="g-3">
              {shippingFields.map(([name, label]) => (
                <Col xs={name === "addressLine1" || name === "addressLine2" ? 12 : 6} key={name}>
                  <Form.Group controlId={`shipping-${name}`}>
                    <Form.Label>{label}</Form.Label>
                    <Form.Control
                      value={shippingDetails[name] || ""}
                      onChange={event =>
                        setShippingDetails(details => ({
                          ...details,
                          [name]: event.target.value,
                        }))
                      }
                      required={name !== "addressLine2"}
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setEditingOrder(null)}
              disabled={saving}
            >
              Close
            </Button>
            <Button type="submit" variant="success" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default MyOrder;
