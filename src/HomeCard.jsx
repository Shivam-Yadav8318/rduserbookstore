
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import ImageSlider from "./ImageSlider.jsx";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
} from "react-bootstrap";

import {
  CartPlus,
  Lightning,
  Heart,
  StarFill,
} from "react-bootstrap-icons";

import { ThemeContext } from "./Context/ThemeContext";

import { addProduct } from "./features/cart/cartSlice";

const apiurl = import.meta.env.VITE_API_URL;

const HomeCard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { theme } = useContext(ThemeContext);

  // Get cart products from Redux
  const cart = useSelector((state) => state.cart.products);

  // Books and loading state
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Wishlist loading error:", error);
      return [];
    }
  });

  // Fetch books from API
  useEffect(() => {
    axios({
      url: `${apiurl}/user/books`,
      method: "GET",
    })
      .then((res) => {
        console.log("Books API Response:", res.data);

        const fetchedBooks = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

        setBooks(fetchedBooks);
      })
      .catch((error) => {
        console.error("BOOK API ERROR:", error);
        setBooks([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Save wishlist
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Add book to Redux cart
  const addToCart = (book) => {
    dispatch(addProduct(book));
  };

  // Check whether a book is already in the cart
  const isInCart = (id) => {
    return cart.some(
      (item) =>
        String(item._id || item.id) === String(id)
    );
  };

  // Toggle wishlist
  const toggleWishlist = (id) => {
    setWishlist((previousWishlist) => {
      if (previousWishlist.includes(id)) {
        return previousWishlist.filter((item) => item !== id);
      }

      return [...previousWishlist, id];
    });
  };

  // Buy now
  const buyNow = (book) => {
    dispatch(addProduct(book));
    navigate("/checkout");
  };

  // Open book details
  const goToDetails = (id) => {
    navigate(`/user/book/detail/${id}`);
  };

  // Loading screen
  if (loading) {
    return (
      <>
        <ImageSlider />

        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
          <p className="mt-2">Loading books...</p>
        </div>
      </>
    );
  }

  // Main UI
  return (
    <>
      <ImageSlider />

      <Container className="mt-4 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold mb-0">
            📚 Explore Books
          </h3>
        </div>

        <Row>
          {books.map((book) => {
            const price =
              Number(book.price) ||
              Number(book.finalPrice) ||
              Number(book.originalPrice) ||
              0;

            const bookId = book._id || book.id;

            return (
              <Col
                key={bookId}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="mb-4"
              >
                <Card
                  className={`h-100 border-0 shadow-sm overflow-hidden ${
                    theme === "dark"
                      ? "bg-dark text-light border border-secondary"
                      : "bg-white"
                  }`}
                  onClick={() => goToDetails(bookId)}
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                >
                  {/* Book image */}
                  <div className="position-relative">
                    <div className="ratio ratio-1x1">
                      {book.bookImage ? (
                        <Card.Img
                          src={book.bookImage}
                          alt={book.bookTitle || "Book"}
                          className="w-100 h-100 object-fit-contain bg-light"
                        />
                      ) : (
                        <div className="d-flex justify-content-center align-items-center bg-light text-muted">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Wishlist button */}
                    <Button
                      variant="light"
                      className="position-absolute top-0 end-0 m-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                      style={{
                        width: "42px",
                        height: "42px",
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleWishlist(bookId);
                      }}
                    >
                      <Heart
                        className={
                          wishlist.includes(bookId)
                            ? "text-danger"
                            : "text-muted"
                        }
                        fill={
                          wishlist.includes(bookId)
                            ? "red"
                            : "none"
                        }
                      />
                    </Button>

                    {/* Category */}
                    <Badge
                      bg="dark"
                      className="position-absolute top-0 start-0 m-2 px-2 py-1"
                    >
                      {book.category || "New"}
                    </Badge>

                    {/* Sale badge */}
                    {price > 0 && price < 300 && (
                      <Badge
                        bg="danger"
                        className="position-absolute top-0 end-0 mt-5 me-2 px-2"
                      >
                        SALE
                      </Badge>
                    )}
                  </div>

                  {/* Card body */}
                  <Card.Body className="d-flex flex-column">
                    {/* Title */}
                    <Card.Title
                      className="fw-bold fs-6 text-truncate"
                      title={book.bookTitle || ""}
                    >
                      {book.bookTitle || "Untitled Book"}
                    </Card.Title>

                    {/* Author */}
                    <div className="text-muted small mb-1">
                      by {book.authorName || "Unknown Author"}
                    </div>

                    {/* Rating */}
                    <div className="mb-2 text-warning small">
                      <StarFill />
                      <StarFill />
                      <StarFill />
                      <StarFill />
                      <StarFill className="text-secondary" />

                      <span className="text-muted ms-1">
                        4.5
                      </span>
                    </div>

                    {/* Publisher */}
                    <div
                      className="mb-2 small text-muted text-truncate"
                      title={book.publisher || book.publication || ""}
                    >
                      {book.publisher ||
                        book.publication ||
                        "Publisher not available"}
                    </div>

                    {/* Price and buttons */}
                    <div className="mt-auto">
                      <div className="d-flex align-items-center mb-3">
                        <span className="fw-bold fs-5 text-success">
                          ₹{price.toFixed(2)}
                        </span>

                        {price > 0 && (
                          <>
                            <span className="text-muted text-decoration-line-through ms-2 small">
                              ₹{Math.round(price * 1.4)}
                            </span>

                            <Badge
                              bg="success-subtle"
                              text="success"
                              className="ms-auto"
                            >
                              40% OFF
                            </Badge>
                          </>
                        )}
                      </div>

                      {/* Cart and Buy buttons */}
                      <div className="d-grid gap-2">
                        <div className="d-flex gap-2">
                          <Button
                            variant={
                              isInCart(bookId)
                                ? "outline-success"
                                : "outline-dark"
                            }
                            className="w-50 rounded-pill fw-semibold"
                            onClick={(event) => {
                              event.stopPropagation();
                              addToCart(book);
                            }}
                          >
                            <CartPlus className="me-1" />

                            {isInCart(bookId)
                              ? "Add More"
                              : "Add to Cart"}
                          </Button>

                          <Button
                            variant="success"
                            className="w-50 rounded-pill fw-semibold shadow-sm"
                            onClick={(event) => {
                              event.stopPropagation();
                              buyNow(book);
                            }}
                          >
                            <Lightning className="me-1" />
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* No books message */}
        {books.length === 0 && (
          <p className="text-center text-muted py-5 fs-5">
            No books found 😔
          </p>
        )}
      </Container>
    </>
  );
};

export default HomeCard;
