@import url("https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&display=swap");

#root {
  width: 100vw;
  height: 100vh;
  user-select: none;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
* body {
  margin: 0;
  /* cursor:none; */
  overflow-y: none;
  overflow-x: none;
}

body::-webkit-scrollbar {
  display: none;
}

.wheel {
  display: none;
  position: absolute;
  top: 0;

  opacity: 0.2;
  img {
    width: 200px;
  }
}

/* .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}

.logo {
  display: none;
  position: absolute;
  top: 150px;
  left: 500px;

  opacity: 1;
  img {
    width: 600px;
    animation: bounce 0.4s infinite cubic-bezier(0.71, 1.94, 0.5, 0.61);
  }
}
*/
.item {
  width: 152px;
  height: 152px;
  position: absolute;
  top: 75px;
  left: 75px;
  background: linear-gradient(white, rgb(48, 48, 48)) padding-box,
    linear-gradient(to bottom, rgb(255, 255, 255), rgb(48, 48, 48)) border-box;
  border-radius: 50em;
  display: flex;
  justify-content: center;
  align-items: center;
  .borderOut {
    width: 150px;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(white, white) padding-box,
      linear-gradient(to bottom, rgb(110, 110, 110), rgb(48, 48, 48)) border-box;
    border-radius: 50em;
    border: 10px solid transparent;
    .borderIn {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(white, white) padding-box,
        linear-gradient(to bottom, rgb(110, 110, 110), rgb(255, 255, 255))
          border-box;
      border: 2px solid transparent;
      border-radius: 50em;
      .background {
        background-image: url("./scanline.jpg");
        background-position: center;
        background-size: cover;
        width: 100%;
        height: 100%;
        border-radius: 50em;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

.controls {
  position: absolute;
  bottom: 60px;
}

.joystick {
  left: 70px;
}

.drift {
  right: 50px;
  font-family: "Hanken Grotesk";
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.5);
  height: 66.6667px;
  width: 66.6667px;
  border: none;
  flex-shrink: 0;
  touch-action: none;
  color: white;
  display: grid;
  place-content: center;
  cursor: pointer;
}

@keyframes bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.annotation {
  display: flex;
  justify-content: center;
  align-items: center;

  background: none;
  backdrop-filter: blur(10px);
  pointer-events: none;
}

.home {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: grid;
  place-content: center;
  z-index: 2;
  font-family: "Hanken Grotesk";

  .logo {
    img {
      width: 1200px;
      margin: 150px;
    }
  }

  .start {
    opacity: 0;
    display: flex;
    margin: 175px;
    justify-content: center;
    align-items: center;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.795);

    font-size: 60px;
    text-shadow: 0 0 10px rgba(0, 0, 0, 1);
    background: linear-gradient(
      to right,
      rgba(54, 54, 54, 0),
      rgb(54, 54, 54),
      rgba(54, 54, 54, 0)
    );
    animation: blinking 2s infinite;
    transition: all 0.2s ease 0s;
    cursor: pointer;
    &:hover {
      text-shadow: 0 0 40px rgba(255, 255, 255, 1);
      color: white;
      opacity: 1;
      animation: none;
    }
    button {
      all: unset;
      display: flex;
      justify-content: center;
      align-items: center;
      display: inline-block;
    }
  }
}

  .glassy {
    width: 80vw;
    height: 90vh;
    background: #0000008f;
    /* box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 ); */
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: white;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    padding: 40px;
    transition: all 0.5s ease 0s;
    animation : froze 2s ease 1s both;
    .articles {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      column-gap: 4%;
      padding: 80px;
      
      .article {
        position: relative;
        background: rgba(35, 35, 53, 0.685);
        width: calc((100% - 3 * 4%) / 4);
        aspect-ratio: 1;
        border: 3px solid #ffffff;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        padding: 20px;
        transition: all 0.2s ease 0s;
        cursor: pointer;
        overflow: hidden;
        &:hover {
          background: rgba(216, 216, 216, 0.5);
          transform: scale(1.05);
        }
        img {
          max-width: 100%;
          height: auto;
          filter: drop-shadow(5px 5px 5px #0000008f);
        }
      }
      .article.selected {
        background: rgba(216, 216, 216, 0.7);
        box-shadow: 0 0 20px 0 rgb(255, 255, 255);
      }

      .article.mobile {
        img {
          width: 100px;
        }
      }

      .article_label {
        position: absolute;
        display: flex;
        justify-content: center;
        left: 0;
        top: 80%;
        background: rgba(6, 6, 6, 0.936);
        border: 2px solid #272727;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .article_label p {
        margin-top: 6px; 
        font-size: calc(0.01 * (80vw - 400px) + 10px);
        color: white; 
      }
    }
    
    .submit {
      font-weight: 900;
      padding: 10px; 
      color: rgba(255, 255, 255, 0.795);
      border: 3px solid #ffffff;
      background: rgba(35, 35, 53, 0.685);
      border-radius: 10px;
      font-size: 27px;
      transition: all 0.2s ease 0s;
      cursor: pointer;
      &:hover {
        text-shadow: 0 0 40px rgba(255, 255, 255, 0.541);
        color: white;
        opacity: 1;
        animation: none;
      }
      button {
        all: unset;
        display: flex;
        justify-content: center;
        align-items: center;
        display: inline-block;
      }
    }
  }

.disabled {
  pointer-events: none;
  cursor: not-allowed;
  opacity: 0.4;
}
@keyframes blinking {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes froze {
  0% {
    backdrop-filter: blur(0px);
    webkit-backdrop-filter: blur(0px);
  }
  100% {
    backdrop-filter: blur(15px);
    webkit-backdrop-filter: blur(15px);

  }
}
.controls.itemButton {
  right: 150px;
  font-family: "Hanken Grotesk";
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.5);
  height: 66.6667px;
  width: 66.6667px;
  border: none;
  flex-shrink: 0;
  touch-action: none;
  color: white;
  display: grid;
  place-content: center;
  cursor: pointer;
}

.controls.menuButton {
  right: 50px;
  top: 60px;
  font-family: "Hanken Grotesk";
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.5);
  height: 66.6667px;
  width: 66.6667px;
  border: none;
  flex-shrink: 0;
  touch-action: none;
  color: white;
  display: grid;
  place-content: center;
  cursor: pointer;
}

@media screen and (max-width: 1000px) {
  .home {
    gap: 50px;
    .logo {
      img {
        width: 500px;
      }
    }

    .start{
      font-size: 30px;
    }

    @media screen and (max-width: 1000px) {
      .glassy {
        width: 80vw;
        height: 90vh;
        padding: 20px; 
        .articles {
          display: flex;
          flex-wrap: wrap; 
          justify-content: space-between;
          align-items: flex-start;
          column-gap: 4%;
          row-gap: 20px; 
          .article {
            width: calc((100% - 3 * 4%) / 2 - 10px); 
            aspect-ratio: 1; 
            padding: 10px;
            transition: transform 0.3s ease; 
            img {
              width: 100%; 
              height: auto;
            }
            &:hover {
              transform: scale(1.05); 
            }
          }
        }
      }
    }
  }
}
