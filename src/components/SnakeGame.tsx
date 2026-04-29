import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

type Point = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = "UP";
const GAME_SPEED = 150; // ms per tick

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y,
    );
  }
  return newFood!;
};

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  // Ref to keep track of the current direction to prevent 180-degree turns
  // in the same tick.
  const currentDirectionRef = useRef<Direction>(INITIAL_DIRECTION);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    currentDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  useEffect(() => {
    // Initial food generation
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case "UP":
          newHead.y -= 1;
          break;
        case "DOWN":
          newHead.y += 1;
          break;
        case "LEFT":
          newHead.x -= 1;
          break;
        case "RIGHT":
          newHead.x += 1;
          break;
      }
      currentDirectionRef.current = direction;

      // Check boundary collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      // Check self collision
      if (
        prevSnake.some(
          (segment) => segment.x === newHead.x && segment.y === newHead.y,
        )
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        // Don't pop we grow!
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling for arrow keys in game
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (e.key === " ") {
        if (isGameOver) resetGame();
        else setIsPaused((p) => !p);
        return;
      }

      const currentDir = currentDirectionRef.current;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (currentDir !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (currentDir !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (currentDir !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (currentDir !== "LEFT") setDirection("RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  // Handle D-Pad for mobile
  const handleMobileControl = (dir: Direction) => {
    const currentDir = currentDirectionRef.current;
    if (dir === "UP" && currentDir !== "DOWN") setDirection("UP");
    if (dir === "DOWN" && currentDir !== "UP") setDirection("DOWN");
    if (dir === "LEFT" && currentDir !== "RIGHT") setDirection("LEFT");
    if (dir === "RIGHT" && currentDir !== "LEFT") setDirection("RIGHT");
  };

  return (
    <div className="flex flex-col h-full items-center lg:items-stretch overflow-hidden">
      {/* Score Header */}
      {document.getElementById("score-portal-target") ? createPortal(
        <>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest opacity-50">Current Score</span>
            <span className="text-3xl font-bold neon-blue tracking-tighter">{score.toString().padStart(6, '0')}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest opacity-50">High Record</span>
            <span className="text-3xl font-bold neon-pink tracking-tighter">{highScore.toString().padStart(6, '0')}</span>
          </div>
        </>,
        document.getElementById("score-portal-target")!
      ) : (
        <div className="flex justify-between w-full mb-4 md:hidden">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest opacity-50">Current Score</span>
            <span className="text-3xl font-bold neon-blue tracking-tighter">{score.toString().padStart(6, '0')}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest opacity-50">High Record</span>
            <span className="text-3xl font-bold neon-pink tracking-tighter">{highScore.toString().padStart(6, '0')}</span>
          </div>
        </div>
      )}

      {/* Game Board */}
      <div className="flex-1 neon-border relative glass flex items-center justify-center p-4 w-full h-full min-h-[300px]">
        <div
          className="relative w-full h-full max-w-[510px] max-h-[510px]"
          style={{
            aspectRatio: "1/1",
          }}
        >
          {/* Game Grid overlay (optional to give retro feel, omitted for pure neon) */}

          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`absolute ${
                  isHead
                    ? "snake-head z-10 rounded-sm"
                    : "snake-body"
                }`}
                style={{
                  width: `${100 / GRID_SIZE}%`,
                  height: `${100 / GRID_SIZE}%`,
                  left: `${(segment.x / GRID_SIZE) * 100}%`,
                  top: `${(segment.y / GRID_SIZE) * 100}%`,
                  transition: "all 0.1s linear",
                }}
              />
            );
          })}

          {/* Food */}
          <div
            className="absolute food animate-pulse"
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(food.x / GRID_SIZE) * 100}%`,
              top: `${(food.y / GRID_SIZE) * 100}%`,
            }}
          />

          {/* Overlays (GameOver / Paused) */}
          {isGameOver && (
            <div className="absolute inset-0 glass flex flex-col items-center justify-center z-20 backdrop-blur-sm">
              <h2 className="text-[#ff00ff] text-3xl font-extrabold mb-4 neon-pink tracking-widest uppercase">
                System Failure
              </h2>
              <p className="neon-blue mb-6 font-mono text-lg">
                Final Score: {score.toString().padStart(6, '0')}
              </p>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-transparent border border-[#39ff14] text-[#39ff14] font-bold uppercase tracking-wider rounded hover:bg-[#39ff14] hover:text-[#020205] transition-all shadow-[0_0_10px_rgba(57,255,20,0.5)] hover:shadow-[0_0_20px_rgba(57,255,20,0.9)]"
              >
                Reboot (Space)
              </button>
            </div>
          )}

          {isPaused && !isGameOver && (
            <div className="absolute inset-0 glass flex items-center justify-center z-20 backdrop-blur-sm">
              <h2 className="text-[#39ff14] text-2xl font-extrabold uppercase tracking-widest neon-text">
                Paused
              </h2>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 h-12 glass border border-white/10 flex items-center px-4 sm:px-6 gap-2 sm:gap-8 flex-wrap justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse shadow-[0_0_8px_#39ff14]"></span>
          <span className="text-xs uppercase tracking-tighter">Engine: Active</span>
        </div>
        <div className="flex items-center gap-2 hidden sm:flex">
          <span className="text-xs uppercase tracking-tighter opacity-50">Difficulty:</span>
          <span className="text-xs neon-blue">CYBER-HARD</span>
        </div>
        <div className="ml-auto flex gap-4">
          <span className="text-xs opacity-50 hidden md:block">[W][A][S][D] TO NAVIGATE</span>
          <span className="text-xs opacity-50 hidden md:block">[SPACE] TO PAUSE</span>
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="mt-8 grid grid-cols-3 gap-2 lg:hidden w-full max-w-[300px] self-center">
        <div />
        <button
          onClick={() => handleMobileControl("UP")}
          className="w-12 h-12 bg-white/5 border border-[#39ff14]/50 rounded-sm flex justify-center items-center text-[#39ff14] active:bg-[#39ff14] active:text-[#020205] mx-auto"
        >
          ▲
        </button>
        <div />
        <button
          onClick={() => handleMobileControl("LEFT")}
          className="w-12 h-12 bg-white/5 border border-[#39ff14]/50 rounded-sm flex justify-center items-center text-[#39ff14] active:bg-[#39ff14] active:text-[#020205] mx-auto"
        >
          ◀
        </button>
        <button
          onClick={() => {
            if (isGameOver) resetGame();
            else setIsPaused(!isPaused);
          }}
          className="w-12 h-12 bg-white/5 border border-[#ff00ff]/50 rounded-sm flex justify-center items-center text-[#ff00ff] active:bg-[#ff00ff] active:text-[#020205] mx-auto"
        >
          {isGameOver ? "↻" : isPaused ? "▶" : "⏸"}
        </button>
        <button
          onClick={() => handleMobileControl("RIGHT")}
          className="w-12 h-12 bg-white/5 border border-[#39ff14]/50 rounded-sm flex justify-center items-center text-[#39ff14] active:bg-[#39ff14] active:text-[#020205] mx-auto"
        >
          ▶
        </button>
        <div />
        <button
          onClick={() => handleMobileControl("DOWN")}
          className="w-12 h-12 bg-white/5 border border-[#39ff14]/50 rounded-sm flex justify-center items-center text-[#39ff14] active:bg-[#39ff14] active:text-[#020205] mx-auto"
        >
          ▼
        </button>
        <div />
      </div>

      <div className="mt-6 font-mono text-[10px] hidden lg:block opacity-50 uppercase tracking-widest text-[#39ff14] self-start ml-2">
        System Node Status: Normal // Memory Segments Allocated // Root Access Granted
      </div>
    </div>
  );
}
