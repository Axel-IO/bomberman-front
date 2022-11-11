
import React, { useRef, useEffect, useState } from 'react'
import './bounceBall.css';

const Canvas = props => {

  const canvasRef = useRef(null)

  const player = {
    x: 50,
    y: 100,
    size: 20,
    speed: 5
  };

  const draw = (ctx, frameCount) => {
    const { x, y, size } = player;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(x, y, 10, 0, 2 * Math.PI)
    ctx.fill()
  }

  const move = () => {
    if (arrowDownPress) {
      console.log('HEY HEY')
      player.y += player.speed;
    }
  }

  useEffect(() => {

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId


    //Our draw came here
    const render = () => {
      move()
      frameCount++
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()


    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

  const arrowDownPress = useKeyPress("ArrowDown");

  const handleKeyDown = (event) => {
    console.log('User pressed: ', event.key);
    if (event.key == 'ArrowLeft') player.x -= player.speed; // left
    if (event.key == 'ArrowUp') player.y -= player.speed; // up
    if (event.key == 'ArrowRight') player.x += player.speed; // right
    if (event.key == 'ArrowDown') player.y += player.speed; // down
  }

  // Hook
  function useKeyPress(targetKey) {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);
    // If pressed key is our target key then set to true
    function downHandler({ key }) {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    }
    // If released key is our target key then set to false
    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };
    // Add event listeners
    useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      };
    }, []); // Empty array ensures that effect is only run on mount and unmount
    return keyPressed;
  }


  return (
    // <div className="container" tabIndex={0} onKeyDown={handleKeyDown}>
    <div className="container">
      <canvas className="canvas" ref={canvasRef} {...props} />
    </div>
  );

}

export default Canvas