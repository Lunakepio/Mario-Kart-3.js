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

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        setSetupStatus(1);
      }
    };

    document.body.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.removeEventListener('keydown', handleKeyDown);
    };
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
            <button className="start-button"
                    onClick={() => setSetupStatus(1)} 
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        setSetupStatus(1);
                    }}} autoFocus>
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
                <img src="./images/keyboard.png" alt="keyboard" />
                <div className="article_label">
                  <p>Keyboard</p>
                </div> 
              </div>
              <div className={controlStyle === "gamepad" ? "article selected" : "article"} onClick={() => 
              setControlStyle("gamepad")}>
                <img src="./images/gamepad.png" alt="gamepad" />
                <div className="article_label">
                  <p>Gamepad</p>
                </div>
              </div>
              <div className={controlStyle === "mouseKeyboard" ? "article selected" : "article"} onClick={() => 
              setControlStyle("mouseKeyboard")}>
                <img src="./images/mousekeyboard.png" alt="mouse & keyboard" />
                <div className="article_label">
                  <p>Mouse & Keyboard</p>
                </div>
              </div>
              <div className={controlStyle === "touch" ? "article selected" : "article"} onClick={() => 
              setControlStyle("touch")}>
                <img src="./images/mobile.png" alt="mobile" />
                <div className="article_label">
                  <p>Mobile</p>
                </div>
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
