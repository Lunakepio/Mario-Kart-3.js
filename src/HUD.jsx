import React, { useEffect, useRef, useState } from "react";
import { useStore } from "./components/store";

export const HUD = () => {
  const wheel = useRef();
  const [image, setImage] = useState("");
  const { item, gameStarted } = useStore();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (wheel.current) {
        const { clientX, clientY } = e;
        const screenWidth = window.innerWidth;
        const rotation = ((clientX - screenWidth / 2) / screenWidth) * 180;

        wheel.current.style.left = `${clientX - 100}px`;
        wheel.current.style.top = `${clientY - 100}px`;
        wheel.current.style.transform = `rotate(${rotation}deg)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    switch (item) {
      case "banana":
        setImage("./images/banana.webp");
        break;
      case "mushroom":
        setImage("./images/mushroom.png");
        break;
      case "shell":
        setImage("./images/shell.webp");
        break;
      default:
        setImage("");
    }
  }, [item]);

  return (
    <div className="overlay">
      {gameStarted && (
        <>
          <div className="item">
            <div className="borderOut">
              <div className="borderIn">
                <div className="background">
                  {image && <img src={image} alt="item" width={90} />}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
