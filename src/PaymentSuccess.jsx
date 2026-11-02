import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function PaymentSuccess() {
    const location = useLocation();
    const { transactionId } = location.state || {};

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="text-center border-0 shadow-lg rounded-4 p-4" style={{ maxWidth: "500px", width: "100%" }}>
                <Card.Body>
                    <div className="text-success mb-3">
                        <i className="bi bi-check-circle-fill display-1"></i>
                    </div>

                    <h2 className="text-success fw-bold mb-3">
                        Payment Successful!
                    </h2>

                    <p className="text-secondary fs-5 mb-4">
                        Your transaction has been completed successfully.
                    </p>
                    <p className="text-secondary fs-5 mb-4">
                        Your transaction ID: <span className="fw-semibold">{transactionId}</span>
                    </p>
                    <p className="text-secondary fs-5 mb-4">    
                    </p>

                    <div className="alert alert-success rounded-3">
                        <i className="bi bi-shield-check me-2"></i>
                        Thank you for your purchase!
                    </div>

                    <Button
                        as={Link}
                        to="/"
                        variant="success"
                        className="rounded-pill px-4 py-2 fw-semibold mt-2"
                    >
                        <i className="bi bi-house-door me-2"></i>
                        Back to Home
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default PaymentSuccess;