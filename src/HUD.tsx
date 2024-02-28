import { useEffect, useRef, useState } from 'react'
import { useStore } from './components/store'
import { Joystick } from 'react-joystick-component'
import { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick'

export const HUD = () => {
  const wheel = useRef()
  const [image, setImage] = useState('')
  const { item, gameStarted, actions, controls } = useStore()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (wheel.current) {
        const { clientX, clientY } = e
        const screenWidth = window.innerWidth
        const rotation = ((clientX - screenWidth / 2) / screenWidth) * 180

        if (wheel.current) {
          ;(wheel.current as HTMLDivElement).style.left = `${clientX - 100}px`
          ;(wheel.current as HTMLDivElement).style.top = `${clientY - 100}px`
          ;(
            wheel.current as HTMLDivElement
          ).style.transform = `rotate(${rotation}deg)`
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleMove = (e: IJoystickUpdateEvent) => {
    actions.setJoystickX(e.x ?? 0)
  }

  const handleStop = () => {
    actions.setJoystickX(0)
  }

  useEffect(() => {
    switch (item) {
      case 'banana':
        setImage('./images/banana.webp')
        break
      case 'mushroom':
        setImage('./images/mushroom.png')
        break
      case 'shell':
        setImage('./images/shell.webp')
        break
      default:
        setImage('')
    }
  }, [item])

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
          {controls === 'touch' && (
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
                onMouseDown={() => {
                  actions.setDriftButton(true)
                }}
                onMouseUp={() => {
                  actions.setDriftButton(false)
                }}
                onTouchStart={(e) => {
                  e.preventDefault()
                  actions.setDriftButton(true)
                }}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  actions.setDriftButton(false)
                }}
              >
                drift
              </div>
              <div
                className="controls itemButton"
                onMouseDown={() => {
                  actions.setItemButton(true)
                }}
                onMouseUp={() => {
                  actions.setItemButton(false)
                }}
                onTouchStart={(e) => {
                  e.preventDefault()
                  actions.setItemButton(true)
                }}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  actions.setItemButton(false)
                }}
              >
                item
              </div>
              <div
                className="controls menuButton"
                onMouseDown={() => {
                  actions.setMenuButton(true)
                }}
                onMouseUp={() => {
                  actions.setMenuButton(false)
                }}
                onTouchStart={(e) => {
                  e.preventDefault()
                  actions.setMenuButton(true)
                }}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  actions.setMenuButton(false)
                }}
              >
                menu
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
