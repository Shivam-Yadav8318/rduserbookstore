import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";

import NavBar from "./NavBar.jsx";
import HomeCard from "./HomeCard.jsx";
import BookDetail from "./BookDetail.jsx";
import Footer from "./Footer.jsx";
import {Provider} from 'react-redux';
import store from './app/store.js';
import "bootstrap/dist/css/bootstrap.min.css";

import { ThemeProvider } from "./Context/ThemeContext";
import Cart from "./Cart.jsx";
import MyOrder from "./MyOrder.jsx"
        import PaymentSuccess from "./PaymentSuccess.jsx";
import PaymentFailure from "./PaymentFailure.jsx";
import Checkout from "./Checkout.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
  <BrowserRouter>

    <ThemeProvider>

      <NavBar />

      <Routes>

        <Route
          path="/"
          element={<HomeCard />}
        />

        <Route
          path="/user/book/detail/:id"
          element={<BookDetail />}
        />
          <Route
            path="/cart"
            element={<Cart />}
          />
          <Route path="/checkout" element={<Checkout />}></Route>
          <Route path='/myorders' element={<MyOrder></MyOrder>}></Route>
          <Route path='/payment/success' element={<PaymentSuccess></PaymentSuccess>}></Route>
          <Route path='/payment/failure' element={<PaymentFailure></PaymentFailure>}></Route> 
      </Routes>

      <Footer />

    </ThemeProvider>

  </BrowserRouter>
  </Provider>
);