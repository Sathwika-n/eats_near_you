import React, { useState } from "react";
import "./card-slider.scss";

const CardSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample card data
  const cards = [
    { id: 1, title: "Card 1", description: "This is card 1" },
    { id: 2, title: "Card 2", description: "This is card 2" },
    { id: 3, title: "Card 3", description: "This is card 3" },
    { id: 4, title: "Card 4", description: "This is card 4" },
    { id: 5, title: "Card 5", description: "This is card 5" },
    { id: 6, title: "Card 6", description: "This is card 6" },
    { id: 7, title: "Card 7", description: "This is card 7" },
    { id: 8, title: "Card 8", description: "This is card 8" },
  ];

  const cardsToShow = 4; // Number of cards to show at once on desktop

  // Move to the next set of 4 cards
  const nextCard = () => {
    setCurrentIndex((prevIndex) => {
      // Calculate the next index by adding the number of cards to show
      return (prevIndex + cardsToShow) % cards.length;
    });
  };

  // Move to the previous set of 4 cards
  const prevCard = () => {
    setCurrentIndex((prevIndex) => {
      // Calculate the previous index by subtracting the number of cards to show
      return (prevIndex - cardsToShow + cards.length) % cards.length;
    });
  };

  return (
    <div className="slider-container">
      <button className="slider-btn prev-btn" onClick={prevCard}>
        ←
      </button>

      <div
        className="card-slider"
        style={{
          transform: `translateX(-${(currentIndex / cards.length) * 100}%)`,
        }}
      >
        {cards.map((card) => (
          <div className="card" key={card.id}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>

      <button className="slider-btn next-btn" onClick={nextCard}>
        →
      </button>
    </div>
  );
};

export default CardSlider;
