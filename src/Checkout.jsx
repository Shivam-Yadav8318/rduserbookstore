import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { useSelector ,useDispatch} from 'react-redux'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeleteCart } from "./features/cart/cartSlice";
const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '')

function CheckOut () {
  const { products } = useSelector(state => state.cart)
  const totalCost = products.reduce((total, product) => {
    const price = Number(product.price || product.finalPrice || product.originalPrice || 0)
    return total + price * (product.quantity || 1)
  }, 0)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const paymentInProgress = useRef(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  let [firstName, setFirstName] = useState('')
  let [lastName, setLastName] = useState('')
  let [email, setEmail] = useState('')
  let [mobileNo, setMobileNo] = useState('')
  let [addressLine1, setAddressLine1] = useState('')
  let [addressLine2, setaddressLine2] = useState('')
  let [city, setCity] = useState('')
  let [state, setState] = useState('')
  let [country, setCountry] = useState('')
  let [pinCode, setPinCode] = useState('')

 // let [amount, setAmount] = useState(0)
  const loadScript = src => {
    return new Promise(resolve => {
      const script = document.createElement('script')
      script.src = src

      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }
  async function goForPayment () {
    if (paymentInProgress.current) return
    paymentInProgress.current = true
    setPaymentLoading(true)
    setPaymentError('')

    if (!apiUrl || !razorpayKey) {
      setPaymentError('Payment configuration is missing.')
      paymentInProgress.current = false
      setPaymentLoading(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setPaymentError('Enter a valid email address to place your order.')
      paymentInProgress.current = false
      setPaymentLoading(false)
      return
    }

    if (products.length === 0 || totalCost <= 0) {
      setPaymentError('Your cart is empty or has an invalid total.')
      paymentInProgress.current = false
      setPaymentLoading(false)
      return
    }

    let data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobileNo: mobileNo,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: state,
      country: country,
      pinCode: pinCode,
      amount: totalCost,
      products: products.map(product => ({
        _id: product._id || product.id,
        bookTitle: product.bookTitle || product.bookTittle || 'Book',
        bookImage: product.bookImage || '',
        price: Number(product.price || product.finalPrice || product.originalPrice || 0),
        quantity: product.quantity || 1
      }))
    }
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
    if (!res) {
      setPaymentError('Unable to load Razorpay Checkout. Please try again.')
      paymentInProgress.current = false
      setPaymentLoading(false)
      return
    }
    let orderData
    try {
      const response = await fetch(apiUrl + '/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      orderData = await response.json()
      if (!response.ok) {
        const message = response.status === 429
          ? 'Razorpay is temporarily rate-limiting payment orders. Wait a few minutes before trying again.'
          : orderData.message || 'Unable to create payment order.'
        throw new Error(message)
      }
    } catch (error) {
      setPaymentError(error.message || 'Unable to create payment order.')
      paymentInProgress.current = false
      setPaymentLoading(false)
      return
    }
    const options = {
      key: razorpayKey, // test_key is here
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'G.K.P. Book Store',
      description: 'Payment for Book',
      order_id: orderData.id,
      handler: async function (response) {
        try {
          const verifyResponse = await fetch(
            apiUrl + '/api/payment/verify-payment',
            {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
            }
          )
          const verifyData = await verifyResponse.json()
          if (!verifyResponse.ok) {
            throw new Error(verifyData.message || 'Payment verification failed.')
          }
          localStorage.setItem('email', email.trim().toLowerCase())
          dispatch(DeleteCart())    
          navigate('/payment/success',{ state: { transactionId: response.razorpay_order_id } })
        } catch (error) {
          setPaymentError(error.message || 'Payment verification failed.')
          navigate('/payment/failure')
        } finally {
          paymentInProgress.current = false
          setPaymentLoading(false)
        }
      },
      modal: {
        ondismiss: () => {
          paymentInProgress.current = false
          setPaymentLoading(false)
        }
      },
      prefill: {
        name: 'GouravKumar',
        email: 'gkp@bookstore.com',
        contact: '81xxxxxx32'
      },
      theme: { color: '#3399cc' }
    }
    try {
      if (!orderData.id || !orderData.amount || !orderData.currency) {
        throw new Error('Invalid payment order received from server.')
      }
      const paymentObject = new window.Razorpay(options)
      paymentObject.on('payment.failed', event => {
        setPaymentError(event.error?.description || 'Payment failed. Please try again.')
        paymentInProgress.current = false
        setPaymentLoading(false)
      })
      paymentObject.open()
    } catch (error) {
      setPaymentError(error.message || 'Unable to open Razorpay Checkout.')
      paymentInProgress.current = false
      setPaymentLoading(false)
    }
  }
  return (
    <Container>
      <Row>
        <Col>
          <h4 className='text-center text-danger mt-5'>Shipping Details</h4>
          <Form>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setFirstName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setLastName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className='mt-2'>
              <Col>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    onChange={e => setEmail(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Mobile No.</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setMobileNo(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <h5 className='mt-3 text-primary'>Shipping Address</h5>
            <Row className='mt-2'>
              <Col>
                <Form.Group>
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setAddressLine1(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className='mt-2'>
              <Col>
                <Form.Group>
                  <Form.Label>Address Line 2</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setaddressLine2(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className='mt-2'>
              <Col>
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setCity(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setState(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className='mt-2'>
              <Col>
                <Form.Group>
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setCountry(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Pin Code</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={e => setPinCode(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col>
          <h4 className='text-center text-danger mt-5'>Product Summary</h4>
          {paymentError && <Alert variant='danger' role='alert'>{paymentError}</Alert>}
          <table className='table mt-2'>
            <thead>
              <tr>
                <th>Book Image</th>
                <th>Book Name</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id || product.id}>
                  <td>
                    <img
                      src={product.bookImage}
                      heigth='30px'
                      width='30px'
                    ></img>
                  </td>
                  <td>{product.bookTitle || product.bookTittle}</td>
                  <td>₹ {product.originalPrice}</td>
                </tr>
              ))}
              <tr>
                <td></td>
                <td>Total Cost</td>
                <td colSpan={2}>₹ {totalCost}</td>
              </tr>
            </tbody>
          </table>
          <Button
            style={{ width: '150px', float: 'right' }}
            size='lg'
            variant='warning'
            className='mt-2'
            onClick={goForPayment}
            disabled={paymentLoading || products.length === 0}
          >
            {paymentLoading ? 'Processing...' : 'Pay Now'}
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default CheckOut
