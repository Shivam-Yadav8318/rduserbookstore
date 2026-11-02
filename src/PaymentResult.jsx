import { Alert, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PaymentResult = ({ success = false }) => {
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      <Alert variant={success ? "success" : "danger"}>
        {success
          ? "Payment completed successfully."
          : "Payment could not be completed. Please try again."}
      </Alert>
      <Button onClick={() => navigate(success ? "/myorders" : "/checkout")}>
        {success ? "View my orders" : "Return to checkout"}
      </Button>
    </Container>
  );
};

export default PaymentResult;
