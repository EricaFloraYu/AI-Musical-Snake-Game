import React, { useState, useEffect, useCallback, useRef } from "react";
import { Terminal, RefreshCw, Play, Pause } from "lucide-react";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

type Point = { x: number; y: number };

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const INITIAL_SPEED = 80;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<{ x: number; y: number; alpha: number }[]>([]);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("snakeHighScore");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (
        !currentSnake.some(
          (segment) => segment.x === newFood.x && segment.y === newFood.y,
        )
      ) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
    setFood(generateFood(INITIAL_SNAKE));
    trailRef.current = [];
  };

  const togglePause = () => {
    if (gameOver) {
      resetGame();
    } else {
      setIsPaused(!isPaused);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (e.key === " ") {
        togglePause();
        return;
      }

      if (isPaused || gameOver) return;

      setDirection((prev) => {
        switch (e.key) {
          case "ArrowUp":
          case "w":
          case "W":
            return prev.y === 1 ? prev : { x: 0, y: -1 };
          case "ArrowDown":
          case "s":
          case "S":
            return prev.y === -1 ? prev : { x: 0, y: 1 };
          case "ArrowLeft":
          case "a":
          case "A":
            return prev.x === 1 ? prev : { x: -1, y: 0 };
          case "ArrowRight":
          case "d":
          case "D":
            return prev.x === -1 ? prev : { x: 1, y: 0 };
          default:
            return prev;
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaused, gameOver]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y,
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem("snakeHighScore", newScore.toString());
            }
            return newScore;
          });
          setFood(generateFood(newSnake));
          setSpeed((s) => Math.max(30, s - 2));
        } else {
          const popped = newSnake.pop();
          if (popped) {
            trailRef.current.push({ x: popped.x, y: popped.y, alpha: 0.8 });
          }
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, isPaused, speed, generateFood, highScore]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid
    ctx.strokeStyle = "#0ff";
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Draw food (Magenta)
    ctx.fillStyle = "#f0f";
    ctx.fillRect(
      food.x * CELL_SIZE + 2,
      food.y * CELL_SIZE + 2,
      CELL_SIZE - 4,
      CELL_SIZE - 4
    );
    // Glitch effect on food
    if (Math.random() > 0.8) {
      ctx.fillStyle = "#0ff";
      ctx.fillRect(
        food.x * CELL_SIZE + 4,
        food.y * CELL_SIZE,
        CELL_SIZE - 8,
        CELL_SIZE
      );
    }

    // Draw trail
    trailRef.current.forEach((t) => {
      ctx.fillStyle = `rgba(0, 255, 255, ${t.alpha})`;
      ctx.fillRect(
        t.x * CELL_SIZE + 2,
        t.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4
      );
      t.alpha -= 0.1;
    });
    trailRef.current = trailRef.current.filter((t) => t.alpha > 0);

    // Draw snake (Cyan)
    snake.forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = "#fff";
      } else {
        ctx.fillStyle = "#0ff";
      }

      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
      
      // Random glitch lines on snake body
      if (Math.random() > 0.9) {
        ctx.fillStyle = "#f0f";
        ctx.fillRect(
          segment.x * CELL_SIZE - 2,
          segment.y * CELL_SIZE + 5,
          CELL_SIZE + 4,
          2
        );
      }
    });

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md mx-auto">
      {/* Score Board */}
      <div className="flex justify-between w-full px-6 py-4 bg-black border-4 border-[#f0f] shadow-[8px_8px_0px_#0ff]">
        <div className="flex flex-col">
          <span className="text-xl text-[#f0f] uppercase tracking-wider font-bold">
            SCORE
          </span>
          <span className="text-6xl text-[#0ff] font-bold glitch-text">
            {score}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xl text-[#0ff] uppercase tracking-wider font-bold flex items-center gap-2">
            <Terminal className="w-5 h-5" /> HIGH_SCORE
          </span>
          <span className="text-6xl text-[#f0f] font-bold glitch-text">
            {highScore}
          </span>
        </div>
      </div>

      {/* Game Canvas Container */}
      <div className="relative p-2 bg-black border-4 border-[#0ff] shadow-[8px_8px_0px_#f0f]">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-black cursor-pointer block"
          style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
          onClick={togglePause}
        />

        {/* Overlays */}
        {(isPaused || gameOver) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 border-4 border-[#f0f] m-2">
            <div className="text-center flex flex-col items-center p-6">
              {gameOver ? (
                <>
                  <h2 className="text-6xl font-black text-[#f0f] mb-2 glitch-text uppercase">
                    FATAL_ERR
                  </h2>
                  <p className="text-[#0ff] mb-8 text-2xl uppercase">
                    SCORE_DUMP: {score}
                  </p>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-3 px-8 py-4 bg-[#0ff] hover:bg-[#f0f] text-black font-bold text-2xl transition-all shadow-[4px_4px_0px_#f0f] hover:shadow-[4px_4px_0px_#0ff] uppercase"
                  >
                    <RefreshCw className="w-8 h-8" /> REBOOT
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={togglePause}
                    className="flex items-center gap-3 px-8 py-4 bg-[#f0f] hover:bg-[#0ff] text-black font-bold text-2xl transition-all shadow-[4px_4px_0px_#0ff] hover:shadow-[4px_4px_0px_#f0f] mb-6 uppercase"
                  >
                    <Play className="w-8 h-8" /> EXECUTE
                  </button>
                  <p className="text-[#0ff] text-xl flex items-center gap-2 uppercase">
                    INPUT: <kbd className="px-3 py-1 bg-black border-2 border-[#0ff] text-[#f0f]">SPACE</kbd> TO HALT
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls Hint */}
      <div className="flex gap-6 text-[#0ff] text-xl uppercase">
        <div className="flex items-center gap-2">
          <kbd className="px-3 py-1 bg-black border-2 border-[#f0f] shadow-[2px_2px_0px_#0ff]">W</kbd>
          <kbd className="px-3 py-1 bg-black border-2 border-[#f0f] shadow-[2px_2px_0px_#0ff]">A</kbd>
          <kbd className="px-3 py-1 bg-black border-2 border-[#f0f] shadow-[2px_2px_0px_#0ff]">S</kbd>
          <kbd className="px-3 py-1 bg-black border-2 border-[#f0f] shadow-[2px_2px_0px_#0ff]">D</kbd>
          <span className="ml-4 text-[#f0f]">OVERRIDE_VECTORS</span>
        </div>
      </div>
    </div>
  );
}
