import { useGameStore } from "../store";
import { useRef } from "react";

export const Buttons = () => {
  const setJumpButtonPressed = useGameStore((state) => state.setJumpButtonPressed);
  const buttonRef = useRef(null);

  const handleStart = (e) => {
    // e.preventDefault(); 
    setJumpButtonPressed(true);
    buttonRef.current?.classList.add("pressed");
  };

  const handleEnd = () => {
    setJumpButtonPressed(false);
    buttonRef.current?.classList.remove("pressed");
  };

  return (
    <div className="bottom-right">
      <button
        ref={buttonRef}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        className="touch-button"
      >
        A
      </button>
    </div>
  );
};
