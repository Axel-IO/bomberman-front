
import React, { useRef, useEffect } from 'react'
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

  useEffect(() => {

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId

    //Our draw came here
    const render = () => {
      frameCount++
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

  const handleKeyDown = (event) => {
    console.log('User pressed: ', event.key);
    if (event.key == 'ArrowLeft') player.x -= player.speed; // left
    if (event.key == 'ArrowUp') player.y -= player.speed; // up
    if (event.key == 'ArrowRight') player.x += player.speed; // right
    if (event.key == 'ArrowDown') player.y += player.speed; // down
  }

  return (
    <div className="container" tabIndex={0} onKeyDown={handleKeyDown}>
      <canvas className="canvas" ref={canvasRef} {...props} />
    </div>
  );

}

export default Canvas