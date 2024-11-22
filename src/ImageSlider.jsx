import React from "react";
import Slider from "react-slick";
import "./App.scss"; // Assuming you import slick-carousel styles here

const ImageSlider = () => {
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Infinite scrolling
    speed: 500, // Transition speed
    slidesToShow: 3, // Default number of slides to show
    slidesToScroll: 1, // Number of slides to scroll per swipe
    responsive: [
      {
        breakpoint: 1024, // If the screen is less than 1024px
        settings: {
          slidesToShow: 3, // 3 slides on medium-sized screens
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600, // If the screen is less than 600px
        settings: {
          slidesToShow: 1, // Show only 1 slide on small screens
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // If the screen is less than 480px
        settings: {
          slidesToShow: 1, // Show only 1 slide on very small screens
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div>
          <img src="https://via.placeholder.com/800x400" alt="Slide 1" />
        </div>
        <div>
          <img src="https://via.placeholder.com/800x400" alt="Slide 2" />
        </div>
        <div>
          <img src="https://via.placeholder.com/800x400" alt="Slide 3" />
        </div>
        <div>
          <img src="https://via.placeholder.com/800x400" alt="Slide 4" />
        </div>
        <div>
          <img src="https://via.placeholder.com/800x400" alt="Slide 5" />
        </div>
      </Slider>
    </div>
  );
};

export default ImageSlider;
