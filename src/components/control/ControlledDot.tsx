import React, { useState, useEffect } from "react";

const ControlledDot = () => {
  // State to hold the dot's position (in pixels)
  const [position, setPosition] = useState({ top: 200, left: 200 });
  // State to track the movement direction (for continuous movement)
  const [moving, setMoving] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  // State to track if the component is below the dot
  const [isBelow, setIsBelow] = useState(false);

  const step = 5; // Number of pixels the dot moves per key press

  // Function to handle keydown event for continuous movement
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
      case "w":
        setMoving((prev) => ({ ...prev, up: true }));
        break;
      case "ArrowDown":
      case "s":
        setMoving((prev) => ({ ...prev, down: true }));
        break;
      case "ArrowLeft":
      case "a":
        setMoving((prev) => ({ ...prev, left: true }));
        break;
      case "ArrowRight":
      case "d":
        setMoving((prev) => ({ ...prev, right: true }));
        break;
      case "f":
        // Spacebar pressed, check if component is below the dot
        if (position.top > window.innerHeight / 2) {
          setIsBelow(true);
          console.log("Component is below the dot.");
        } else {
          setIsBelow(false);
          console.log("Component is above the dot.");
        }
        break;
      default:
        break;
    }
  };

  // Function to handle keyup event to stop movement when the key is released
  const handleKeyUp = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
      case "w":
        setMoving((prev) => ({ ...prev, up: false }));
        break;
      case "ArrowDown":
      case "s":
        setMoving((prev) => ({ ...prev, down: false }));
        break;
      case "ArrowLeft":
      case "a":
        setMoving((prev) => ({ ...prev, left: false }));
        break;
      case "ArrowRight":
      case "d":
        setMoving((prev) => ({ ...prev, right: false }));
        break;
      default:
        break;
    }
  };

  // Update position based on movement direction without boundary detection
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        let newTop = prev.top;
        let newLeft = prev.left;

        if (moving.up) newTop -= step;
        if (moving.down) newTop += step;
        if (moving.left) newLeft -= step;
        if (moving.right) newLeft += step;

        return { top: newTop, left: newLeft };
      });
    }, 20); // Move every 20ms for smooth movement

    // Cleanup interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, [moving]);

  // Add event listeners for keydown and keyup
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup event listeners when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  });

  return (
    <div
      className="dot"
      style={{
        position: "absolute",
        top: `${position.top}px`, // Position the dot using pixel values
        left: `${position.left}px`,
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: "red",
        transform: "translate(-50%, -50%)", // Center the dot at the position
        transition: "top 0.1s ease, left 0.1s ease", // Smooth transition for the movement
      }}
    ></div>
  );
};

export default ControlledDot;
