import React, { useEffect, useRef } from "react";

export const HUD = () => {
  const wheel = useRef();

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

  return (
    <div className="overlay"> dadasd
      <div className="logo">
        <img src="./logo.png" alt="logo" />
      </div>
      <div className="wheel">
        <img
ref={wheel}
          src="./steering_wheel.png"
          alt="steering wheel"
          className="steering-wheel"
          style={{
            position: "absolute",
            pointerEvents: "none",
            transformOrigin: "center",
          }}
        />
      </div>
    </div>
  );
};
