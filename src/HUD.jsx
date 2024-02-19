import React, { useEffect, useRef, useState } from "react";
import { useStore } from "./components/store";
import { Joystick } from "react-joystick-component";

export const HUD = () => {
  const wheel = useRef();
  const [image, setImage] = useState("");
  const { item, gameStarted, actions, controls } = useStore();

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

  const handleMove = (e) => {
    actions.setJoystickX(e.x);
  };

  const handleStop = () => {
    actions.setJoystickX(0);
  };

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
          {controls === "touch" && (
            <>
            <div className="controls joystick">
            <Joystick
              size={100}
              sticky={false}
              baseColor="rgba(255, 255, 255, 0.5)"
              stickColor="rgba(255, 255, 255, 0.5)"
              move={handleMove}
              stop={handleStop}
            ></Joystick>
          </div>
          <div
            className="controls drift"
            onMouseDown={(e) => {
              actions.setDriftButton(true);
            }}
            onMouseUp={(e) => {
              actions.setDriftButton(false);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              actions.setDriftButton(true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              actions.setDriftButton(false);
            }}
          >
            drift
          </div>
          <div
            className="controls itemButton"
            onMouseDown={(e) => {
              actions.setItemButton(true);
            }}
            onMouseUp={(e) => {
              actions.setItemButton(false);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              actions.setItemButton(true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              actions.setItemButton(false);
            }}

          >
            item
          </div>
          <div
            className="controls menuButton"
            onMouseDown={(e) => {
              actions.setMenuButton(true);
            }}
            onMouseUp={(e) => {
              actions.setMenuButton(false);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              actions.setMenuButton(true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              actions.setMenuButton(false);
            }}

          >
            menu
          </div>
          </>
          )}
        </>
      )}
    </div>
  );
};
