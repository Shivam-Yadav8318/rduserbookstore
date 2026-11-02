import React from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Image,
  Alert,
} from "react-bootstrap";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  deleteProduct,
  increaseQuantity,
  decreaseQuantity,
} from "./features/cart/cartSlice";

const Cart = () => {
  const { products } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the price of a book
  const getPrice = (product) => {
    return Number(product.price || product.finalPrice ||
      product.originalPrice || 0);
  };

  // Calculate total price
  const totalPrice = products.reduce((total, product) => {
    const quantity = product.quantity || 1;
    return total + getPrice(product) * quantity;
  }, 0);

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h3 className="text-center mb-4">
            Your Shopping Cart
          </h3>

          {products.length === 0 ? (
            <Alert variant="info" className="text-center">
              Your cart is empty. Add some books!
              <div className="mt-3">
                <Button
                  variant="primary"
                  onClick={() => navigate("/books")}
                >
                  Add More Books
                </Button>
              </div>
            </Alert>
          ) : (
            <>
              <div className="table-responsive">
                <Table striped bordered hover responsive="md">
                  <thead className="table-dark">
                    <tr>
                      <th>Image</th>
                      <th>Book Title</th>
                      <th>Author</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                      <th>Language</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product, index) => {
                      const quantity = product.quantity || 1;
                      const price = getPrice(product);

                      return (
                        <tr
                          key={product._id || product.id || index}
                        >
                          <td className="text-center">
                            <Image
                              src={
                                product.bookImage ||
                                product.image ||
                                ""
                              }
                              alt={product.bookTitle || "Book"}
                              width={75}
                              height={95}
                              style={{
                                objectFit: "contain",
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </td>

                          <td>
                            {product.bookTitle || "Title unavailable"}
                          </td>

                          <td>
                            {product.authorName || "Unknown"}
                          </td>

                          <td>₹{price.toFixed(2)}</td>

                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                disabled={quantity <= 1}
                                onClick={() =>
                                  dispatch(
                                    decreaseQuantity(
                                      product._id || product.id
                                    )
                                  )
                                }
                              >
                                −
                              </Button>

                              <span>{quantity}</span>

                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() =>
                                  dispatch(
                                    increaseQuantity(
                                      product._id || product.id
                                    )
                                  )
                                }
                              >
                                +
                              </Button>
                            </div>
                          </td>

                          <td>
                            ₹{(price * quantity).toFixed(2)}
                          </td>

                          <td>{product.language || "English"}</td>

                          <td>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                dispatch(
                                  deleteProduct (
                                    product._id || product.id
                                  )
                                )
                              }
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>

              <Row className="mt-4">
                <Col md={6} className="mb-3">
                  <Button
                    variant="outline-primary"
                    onClick={() => navigate("/")}
                  >
                    ← Add More Books
                  </Button>
                </Col>

                <Col md={6} className="text-md-end">
                  <h4>
                    Total: ₹{totalPrice.toFixed(2)}
                  </h4>

                  <Button
                    variant="success"
                    className="mt-2"
                    onClick={() => navigate("/checkout")}
                  >
                    Buy Now
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
