import { useRef, useEffect, useState, ReactHTMLElement } from "react";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";
import "./canvas.css";

export type Player = {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
};

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const refCase = useRef<HTMLDivElement>(null);

  let players: Player[] = [
    // {
    //   x: 50,
    //   y: 100,
    //   size: 20,
    //   speed: 5,
    //   color: "black",
    // },
  ];
  let maxWidth: number;
  let maxHeight: number;

  const keystate: Record<string, boolean> = {};

  const nbRows = 10;
  const nbCols = 20;
  const matrix: JSX.Element[] = [];

  for (let i = 0; i < nbRows; i++) {
    const rowDiv: JSX.Element[] = [];
    for (let j = 0; j < nbCols; j++) {
      rowDiv.push(
        <div
          id={i.toString() + "-" + j.toString()}
          className="testdiv"
          style={{ flex: 1 }}
        ></div>
      );
    }
    matrix.push(
      <div key={i} style={{ display: "flex", flex: 1 }}>
        {rowDiv}
      </div>
    );
  }

  const colorSquare = (id: string, color: string) => {
    const square = document.getElementById(id);
    if (square) {
      square.style.backgroundColor = color;
    }
  };

  const updateMatrix = (
    ctx: CanvasRenderingContext2D | null = null,
    players: Player[] = []
  ) => {
    if (ctx) {
      maxWidth = ctx.canvas.width;
      maxHeight = ctx.canvas.height;

      const rowHeight = Math.round(maxHeight / nbRows);
      const colWidth = Math.round(maxWidth / nbCols);

      // for (let i = 0; i < nbRows; i++) {
      //   for (let j = 0; j < nbCols; j++) {
      //     colorSquare(`${i}-${j}`, "grey");
      //   }
      // }
      if (players) {
        if (players[0]) {
          const goodRow = Math.floor(players[0].y / rowHeight);
          const goodCol = Math.floor(players[0].x / colWidth);
          colorSquare(`${goodRow}-${goodCol}`, players[0].color);
        }
        if (players[1]) {
          const goodRow2 = Math.floor(players[1].y / rowHeight);
          const goodCol2 = Math.floor(players[1].x / colWidth);
          colorSquare(`${goodRow2}-${goodCol2}`, players[1].color);
        }
      }
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, players: Player[] = []) => {
    maxWidth = ctx.canvas.width;
    maxHeight = ctx.canvas.height;
    ctx.clearRect(0, 0, maxWidth, maxHeight);

    players.forEach(function ({ x, y, size, color }) {
      ctx.beginPath();
      //   ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.rect(x - size / 2, y - size / 2, size, size);
      //   ctx.rect(x, y, size, size);
      ctx.fillStyle = color;
      ctx.fill();
      writeText(ctx, { x, y, text: `x=${x} y=${y}` });

      // ctx.fillStyle = "black";
      // ctx.fillText(`x=${x} y=${y}`, x, y);
    });
  };

  const writeText = (
    ctx: CanvasRenderingContext2D,
    info: { x: number; y: number; text: string }
  ) => {
    const { text, x, y } = info;

    const fontSize = 20;
    const fontFamily = "Arial";
    const color = "black";
    const textAlign = "left";
    const textBaseline = "top";
    ctx.beginPath();
    ctx.font = fontSize + "px " + fontFamily;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.stroke();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const move = () => {
    if (socketService.socket) {
      if (keystate.ArrowUp) {
        gameService.movePlayer(socketService.socket, {
          maxWidth,
          maxHeight,
          direction: "UP",
        });
      }
      if (keystate.ArrowDown)
        gameService.movePlayer(socketService.socket, {
          maxWidth,
          maxHeight,
          direction: "DOWN",
        });
      if (keystate.ArrowLeft)
        gameService.movePlayer(socketService.socket, {
          maxWidth,
          maxHeight,
          direction: "LEFT",
        });
      if (keystate.ArrowRight) {
        gameService.movePlayer(socketService.socket, {
          maxWidth,
          maxHeight,
          direction: "RIGHT",
        });
        // console.log(players[0]);
      }
    }
  };

  const connectSocket = async () => {
    await socketService.connect("http://localhost:9000").catch((err) => {
      console.log("Error: ", err);
    });
  };

  useEffect(() => {
    if (!socketService.socket) {
      connectSocket();
    }
  }, []);

  // Add event listeners
  useEffect(() => {
    document.addEventListener("keydown", function (event) {
      keystate[event.code] = true;
    });
    document.addEventListener("keyup", function (event) {
      delete keystate[event.code];
    });
  }, []); // Empty array ensures that effect is only run on mount and unmount

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;
      if (context) {
        if (socketService.socket) {
          gameService.onUpdatePlayers(socketService.socket, (playerList) => {
            players = playerList;
            draw(context, players);
            updateMatrix(context, players);
          });
        }
      }
    }
  }, [draw]);

  useEffect(() => {
    let animationFrameId: number;
    // Game loop
    const updateMove = () => {
      move();
      animationFrameId = window.requestAnimationFrame(updateMove);
    };
    updateMove();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [move]);

  return (
    <div>
      <div className="container">
        {matrix}

        {/* <div style={{ display: "flex", flex: 1 }}>
          <div ref={refCase} className="testdiv" style={{ flex: 1 }}></div>
          <div className="testdiv" style={{ flex: 1 }}></div>
          <div className="testdiv" style={{ flex: 1 }}></div>
          <div className="testdiv" style={{ flex: 1 }}></div>
          <div className="testdiv" style={{ flex: 1 }}></div>
        </div>

        {/* <p id="xy">{players.length ? players[0].x : "cou"}</p> */}
        <canvas className="canvas" ref={canvasRef} />
      </div>
    </div>
  );
}
