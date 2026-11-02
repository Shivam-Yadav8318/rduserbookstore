
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Spinner,
  Badge,
} from "react-bootstrap";
import {
  CartPlus,
  ArrowLeft,
  Lightning,
  StarFill,
} from "react-bootstrap-icons";
import axios from "axios";
import { useDispatch } from "react-redux";
import {addProduct} from './features/cart/cartSlice';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

const BookDetail = () => {
  const dispatch = useDispatch();

  // Get ID from URL
  const { id } = useParams();

  // Navigation
  const navigate = useNavigate();

  // Book state
  const [book, setBook] = useState(null);

  // Loading
  const [loading, setLoading] = useState(true);

  // Error
  const [error, setError] = useState("");

  // ==============================
  // GET BOOK DETAILS
  // ==============================
  useEffect(() => {

    if (!id) {
      setError("Book ID not found.");
      setLoading(false);
      return;
    }

    axios({
      url: `${apiUrl}/user/book/${id}`,
      method: "GET",
    })
      .then((res) => {

        console.log("Book Detail Response:", res.data);

        // Handle different possible API response structures
        const bookData =
          res.data.data ||
          res.data.book ||
          res.data;

        setBook(bookData);

      })
      .catch((err) => {

        console.log("BOOK DETAIL ERROR:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load book details."
        );

      })
      .finally(() => {

        setLoading(false);

      });

  }, [id]);

  // ==============================
  // ADD TO CART
  // ==============================
  const addToCart = () => {
dispatch(addProduct(book));
  };

  // ==============================
  // BUY NOW
  // ==============================
  const buyNow = () => {
    if (!book) return;
    dispatch(addProduct(book));
    navigate("/checkout");
  };

  // ==============================
  // LOADING
  // ==============================
  if (loading) {

    return (
      <Container className="py-5 text-center">

        <Spinner
          animation="border"
          variant="success"
        />

        <p className="mt-3">
          Loading book details...
        </p>

      </Container>
    );

  }

  // ==============================
  // ERROR
  // ==============================
  if (error) {

    return (
      <Container className="py-5 text-center">

        <h4 className="text-danger">
          {error}
        </h4>

        <Button
          variant="dark"
          className="mt-3"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="me-2" />
          Back to Books
        </Button>

      </Container>
    );

  }

  // ==============================
  // BOOK NOT FOUND
  // ==============================
  if (!book) {

    return (
      <Container className="py-5 text-center">

        <h4>
          Book not found 😔
        </h4>

        <Button
          variant="dark"
          className="mt-3"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="me-2" />
          Back to Books
        </Button>

      </Container>
    );

  }

  // ==============================
  // PRICE
  // ==============================
  const price =
    Number(book.originalPrice) ||
    Number(book.price) ||
    0;

  return (

    <Container className="py-5">

      {/* BACK BUTTON */}

      <Button
        variant="outline-dark"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="me-2" />
        Back
      </Button>

      <Card className="border-0 shadow-sm overflow-hidden">

        <Card.Body className="p-4">

          <Row>

            {/* ==============================
                BOOK IMAGE
            ============================== */}

            <Col
              xs={12}
              md={5}
              className="text-center mb-4 mb-md-0"
            >

              <div
                className="d-flex justify-content-center align-items-center bg-light rounded"
                style={{
                  minHeight: "400px",
                }}
              >

                {book.bookImage ? (

                  <img
                    src={book.bookImage}
                    alt={
                      book.bookTitle ||
                      "Book"
                    }
                    style={{
                      maxWidth: "100%",
                      maxHeight: "400px",
                      objectFit: "contain",
                    }}
                  />

                ) : (

                  <div className="text-muted">
                    No Image Available
                  </div>

                )}

              </div>

              {/* ADD TO CART */}

              <div className="d-flex gap-2 mt-4">

                <Button
                  variant="outline-success"
                  className="w-50 rounded-pill fw-semibold"
                  onClick={addToCart}
                >
                  <CartPlus className="me-2" />
                  Add To Cart
                </Button>

                <Button
                  variant="success"
                  className="w-50 rounded-pill fw-semibold"
                  onClick={buyNow}
                >
                  <Lightning className="me-2" />
                  Buy Now
                </Button>

              </div>

            </Col>

            {/* ==============================
                BOOK INFORMATION
            ============================== */}

            <Col
              xs={12}
              md={7}
            >

              {/* TITLE */}

              <h2 className="fw-bold mb-2">
                {book.bookTitle ||
                  "Untitled Book"}
              </h2>

              {/* AUTHOR */}

              <p className="text-muted mb-2">

                By{" "}
                <strong>
                  {book.authorName ||
                    "Unknown Author"}
                </strong>

              </p>

              {/* RATING */}

              <div className="text-warning mb-3">

                <StarFill />
                <StarFill />
                <StarFill />
                <StarFill />

                <StarFill className="text-secondary" />

                <span className="text-muted ms-2">
                  4.5
                </span>

              </div>

              {/* PRICE */}

              <div className="d-flex align-items-center mb-4">

                <h3 className="text-success fw-bold mb-0">

                  ₹{price}

                </h3>

                {price > 0 && (

                  <span className="text-muted text-decoration-line-through ms-3">

                    ₹{Math.round(
                      price * 1.4
                    )}

                  </span>

                )}

                {price > 0 && (

                  <Badge
                    bg="success"
                    className="ms-3"
                  >
                    40% OFF
                  </Badge>

                )}

              </div>

              <hr />

              {/* PRODUCT HIGHLIGHTS */}

              <h4 className="fw-bold mb-3">
                Product Highlights
              </h4>

              {/* ISBN */}

              <p>

                <strong>
                  ISBN No:
                </strong>{" "}

                <span className="text-muted">
                  {book.isbnNo ||
                    book.ISBN ||
                    "Not Available"}
                </span>

              </p>

              {/* SHORT DESCRIPTION */}

              <p>

                <strong>
                  Short Description:
                </strong>{" "}

                <span className="text-muted">
                  {book.shortDescription ||
                    "Not Available"}
                </span>

              </p>

              {/* LONG DESCRIPTION */}

              <p>

                <strong>
                  Long Description:
                </strong>{" "}

                <span className="text-muted">
                  {book.longDescription ||
                    "Not Available"}
                </span>

              </p>

              {/* PUBLISHER */}

              <p>

                <strong>
                  Published By:
                </strong>{" "}

                <span className="text-muted">
                  {book.publisher ||
                    book.publication ||
                    "Not Available"}
                </span>

              </p>

              {/* PUBLICATION YEAR */}

              <p>

                <strong>
                  Publication Year:
                </strong>{" "}

                <span className="text-muted">
                  {book.publicationYear ||
                    "Not Available"}
                </span>

              </p>

              {/* EDITION */}

              <p>

                <strong>
                  Edition:
                </strong>{" "}

                <span className="text-muted">
                  {book.edition ||
                    book.Edition ||
                    "Not Available"}
                </span>

              </p>

              {/* NUMBER OF PAGES */}

              <p>

                <strong>
                  Number of Pages:
                </strong>{" "}

                <span className="text-muted">
                  {book.nop ||
                    book.numberOfPages ||
                    "Not Available"}
                </span>

              </p>

            </Col>

          </Row>

        </Card.Body>

      </Card>

    </Container>

  );
};

export default BookDetail;
