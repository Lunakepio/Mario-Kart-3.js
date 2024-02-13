import React, { useEffect, useRef, useState } from "react";
import { useStore } from "./components/store";
import gsap from "gsap";

export const Landing = () => {
  const { gameStarted, actions } = useStore();

  const logo = useRef();
  const startButton = useRef();
  const homeRef = useRef();
  const [setupStatus, setSetupStatus] = useState(0);
  const [controlStyle, setControlStyle] = useState("");

  useEffect(() => {
    const tl = gsap.timeline();

    if (setupStatus === 0) {
      if (logo.current && startButton.current) {
        tl.from(logo.current, {
          scale: 122,
          opacity: 0,
          duration: 0,
          ease: "power4.out",
        })
          .to(logo.current, {
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
          })
          .to(startButton.current, {
            opacity: 1,
            duration: 3,
            delay: 1,
            ease: "power4.out",
          });
      }
    }
  }, [setupStatus]);

  if (gameStarted) {
    return null; 
  }
  return (
    <>
      {setupStatus === 0 && (
        <div className="home" ref={homeRef}>
          <div className="logo">
            <img ref={logo} src="./logo.png" alt="logo" />
          </div>
          <div className="start" ref={startButton}>
            <button className="start-button" onClick={() => setSetupStatus(1)}>
              PRESS ENTER TO START
            </button>
          </div>
        </div>
      )}
      {setupStatus === 1 && (
        <div className="home">
          <div className="glassy">
            <h1>CHOOSE YOUR CONTROL STYLE</h1>

            <div className="articles">
            <div className={controlStyle === "keyboard" ? "article selected" : "article"} onClick={() => 
              setControlStyle("keyboard")}>
                <h2>Keyboard</h2>
                <img src="./images/keyboard.png" alt="keyboard" />
              </div>
              <div className={controlStyle === "gamepad" ? "article selected" : "article"} onClick={() => 
              setControlStyle("gamepad")}>
                <h2>Gamepad</h2>
                <img src="./images/gamepad.png" alt="gamepad" />
              </div>
              <div className={controlStyle === "mouseKeyboard" ? "article selected" : "article"} onClick={() => 
              setControlStyle("mouseKeyboard")}>
                <h2>Mouse & Keybaord</h2>
                <img src="./images/mousekeyboard.png" alt="mouse & keyboard" />
              </div>
            </div>

            <div className={controlStyle != "" ? "submit" : "submit disabled"}>
              <button
                className={controlStyle != "" ? "submit-button" : "submit-button disabled"}
                onClick={() => {
                  actions.setControls(controlStyle);
                  actions.setGameStarted(true);
                }}
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </>

  );
};
