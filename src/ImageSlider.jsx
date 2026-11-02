import React from "react";
import Carousel from "react-bootstrap/Carousel";
import { ArrowRight } from "react-bootstrap-icons";

import slide1 from "./assets/slide1.webp";
import slide2 from "./assets/slide2.webp";
import slide3 from "./assets/slide3.webp";
import slide4 from "./assets/slide4.webp";

import "./ImageSlider.css";

function ImageSlider() {
  

  return (
    <div className="slider-wrapper">

      <Carousel
        fade
        interval={4500}
        pause="hover"
        controls={true}
        indicators={true}
        touch={true}
        className="custom-carousel"
      >

        {/* ================= SLIDE 1 ================= */}
        <Carousel.Item>

          <img
            src={slide1}
            className="d-block w-100 slider-image"
            alt="Discover books"
          />

          <div className="slider-overlay"></div>

          <Carousel.Caption className="custom-caption">

            <span className="caption-badge">
              WELCOME
            </span>

            <h1>
              Discover Your
              <span className="highlight-text">
                {" "}Next Favorite
              </span>
              {" "}Book
            </h1>

            <p>
              Explore thousands of amazing books and discover
              stories that inspire, educate and entertain.
            </p>

            <button className="slider-btn" >
              Explore Books
              <ArrowRight className="ms-2" />
            </button>

          </Carousel.Caption>

        </Carousel.Item>


        {/* ================= SLIDE 2 ================= */}
        <Carousel.Item>

          <img
            src={slide2}
            className="d-block w-100 slider-image"
            alt="Explore books"
          />

          <div className="slider-overlay"></div>

          <Carousel.Caption className="custom-caption">

            <span className="caption-badge">
              EXPLORE
            </span>

            <h1>
              Find Stories
              <span className="highlight-text">
                {" "}Worth Reading
              </span>
            </h1>

            <p>
              From bestselling novels to educational books,
              find something perfect for your reading journey.
            </p>

            <button className="slider-btn">
              Browse Collection
              <ArrowRight className="ms-2" />
            </button>

          </Carousel.Caption>

        </Carousel.Item>


        {/* ================= SLIDE 3 ================= */}
        <Carousel.Item>

          <img
            src={slide3}
            className="d-block w-100 slider-image"
            alt="Featured books"
          />

          <div className="slider-overlay"></div>

          <Carousel.Caption className="custom-caption">

            <span className="caption-badge">
              FEATURED
            </span>

            <h1>
              Stories That
              <span className="highlight-text">
                {" "}Stay With You
              </span>
            </h1>

            <p>
              Discover carefully selected books and make
              every reading moment memorable.
            </p>

            <button className="slider-btn">
              View Featured
              <ArrowRight className="ms-2" />
            </button>

          </Carousel.Caption>

        </Carousel.Item>


        {/* ================= SLIDE 4 ================= */}
        <Carousel.Item>

          <img
            src={slide4}
            className="d-block w-100 slider-image"
            alt="Reading journey"
          />

          <div className="slider-overlay"></div>

          <Carousel.Caption className="custom-caption">

            <span className="caption-badge">
              NEW COLLECTION
            </span>

            <h1>
              Begin Your
              <span className="highlight-text">
                {" "}Reading Journey
              </span>
            </h1>

            <p>
              Choose your next book, add it to your cart
              and start your reading adventure today.
            </p>

            <button className="slider-btn">
              Start Exploring
              <ArrowRight className="ms-2" />
            </button>

          </Carousel.Caption>

        </Carousel.Item>

      </Carousel>

    </div>
  );
}

export default ImageSlider;