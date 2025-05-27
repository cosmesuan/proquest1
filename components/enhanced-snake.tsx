"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button-enhanced"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, X, Pause, Play, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"

interface EnhancedSnakeProps {
  onWin: () => void
  onClose: () => void
}

export default function EnhancedSnake({ onWin, onClose }: EnhancedSnakeProps) {
  const [snake, setSnake] = useState([[10, 10]])
  const [food, setFood] = useState([15, 15])
  const [powerUp, setPowerUp] = useState<[number, number] | null>(null)
  const [obstacles, setObstacles] = useState<[number, number][]>([])
  const [direction, setDirection] = useState([0, 1])
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speed, setSpeed] = useState(200)
  const [highScore, setHighScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [showEffects, setShowEffects] = useState(false)

  const gridSize = 20
  const winScore = 5

  useEffect(() => {
    const savedHighScore = localStorage.getItem("snake-high-score")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore))
    }
  }, [])

  const generateFood = useCallback(() => {
    let newFood
    do {
      newFood = [Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)]
    } while (
      snake.some((segment) => segment[0] === newFood[0] && segment[1] === newFood[1]) ||
      obstacles.some((obs) => obs[0] === newFood[0] && obs[1] === newFood[1])
    )
    return newFood
  }, [snake, obstacles])

  const generatePowerUp = useCallback(() => {
    if (Math.random() < 0.2) {
      let newPowerUp
      do {
        newPowerUp = [Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)]
      } while (
        snake.some((segment) => segment[0] === newPowerUp[0] && segment[1] === newPowerUp[1]) ||
        obstacles.some((obs) => obs[0] === newPowerUp[0] && obs[1] === newPowerUp[1]) ||
        (food[0] === newPowerUp[0] && food[1] === newPowerUp[1])
      )
      return newPowerUp
    }
    return null
  }, [snake, food, obstacles])

  const generateObstacles = useCallback(() => {
    const newObstacles: [number, number][] = []
    const numObstacles = Math.floor(score / 3) // Add obstacles as score increases

    for (let i = 0; i < Math.min(numObstacles, 8); i++) {
      let obstacle
      do {
        obstacle = [Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)] as [number, number]
      } while (
        snake.some((segment) => segment[0] === obstacle[0] && segment[1] === obstacle[1]) ||
        (food[0] === obstacle[0] && food[1] === obstacle[1]) ||
        newObstacles.some((obs) => obs[0] === obstacle[0] && obs[1] === obstacle[1])
      )
      newObstacles.push(obstacle)
    }

    return newObstacles
  }, [snake, food, score])

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted || isPaused) return

    setSnake((currentSnake) => {
      const newSnake = [...currentSnake]
      const head = [newSnake[0][0] + direction[0], newSnake[0][1] + direction[1]]

      // Check wall collision
      if (head[0] < 0 || head[0] >= gridSize || head[1] < 0 || head[1] >= gridSize) {
        setGameOver(true)
        return currentSnake
      }

      // Check self collision
      if (newSnake.some((segment) => segment[0] === head[0] && segment[1] === head[1])) {
        setGameOver(true)
        return currentSnake
      }

      // Check obstacle collision
      if (obstacles.some((obs) => obs[0] === head[0] && obs[1] === head[1])) {
        setGameOver(true)
        return currentSnake
      }

      newSnake.unshift(head)

      // Check food collision
      if (head[0] === food[0] && head[1] === food[1]) {
        const newScore = score + 1
        setScore(newScore)
        setCombo(combo + 1)
        setShowEffects(true)
        setTimeout(() => setShowEffects(false), 500)

        if (newScore > highScore) {
          setHighScore(newScore)
          localStorage.setItem("snake-high-score", newScore.toString())
        }

        if (newScore >= winScore) {
          setTimeout(() => onWin(), 500)
        }

        setFood(generateFood())
        setPowerUp(generatePowerUp())
        setObstacles(generateObstacles())
        setSpeed((prev) => Math.max(80, prev - 8))
      } else {
        newSnake.pop()
        setCombo(0)
      }

      // Check power-up collision
      if (powerUp && head[0] === powerUp[0] && head[1] === powerUp[1]) {
        setScore((prev) => prev + 3)
        setCombo((prev) => prev + 2)
        setPowerUp(null)
        setShowEffects(true)
        setTimeout(() => setShowEffects(false), 500)
        // Temporary speed boost
        setSpeed((prev) => Math.max(60, prev - 30))
        setTimeout(() => setSpeed((prev) => prev + 20), 2000)
      }

      return newSnake
    })
  }, [
    direction,
    food,
    powerUp,
    obstacles,
    gameOver,
    gameStarted,
    isPaused,
    generateFood,
    generatePowerUp,
    generateObstacles,
    score,
    combo,
    highScore,
    onWin,
  ])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) return

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault()
          if (direction[0] !== 1) setDirection([-1, 0])
          break
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault()
          if (direction[0] !== -1) setDirection([1, 0])
          break
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault()
          if (direction[1] !== 1) setDirection([0, -1])
          break
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault()
          if (direction[1] !== -1) setDirection([0, 1])
          break
        case " ":
          e.preventDefault()
          setIsPaused((prev) => !prev)
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [direction, gameStarted])

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, speed)
    return () => clearInterval(gameInterval)
  }, [moveSnake, speed])

  const resetGame = () => {
    setSnake([[10, 10]])
    setFood([15, 15])
    setPowerUp(null)
    setObstacles([])
    setDirection([0, 1])
    setGameOver(false)
    setScore(0)
    setCombo(0)
    setGameStarted(false)
    setIsPaused(false)
    setSpeed(200)
    setShowEffects(false)
  }

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  const handleDirectionClick = (newDirection: [number, number]) => {
    if (!gameStarted || isPaused || gameOver) return

    // Prevent reversing into self
    if (direction[0] !== -newDirection[0] || direction[1] !== -newDirection[1]) {
      setDirection(newDirection)
    }
  }

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-between px-4">
        <div className="text-base sm:text-lg font-semibold">
          {!gameStarted
            ? "Enhanced Snake"
            : gameOver
              ? "💀 Game Over!"
              : score >= winScore
                ? "🎉 Victory!"
                : isPaused
                  ? "⏸️ Paused"
                  : "🐍 Snake Game"}
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">{`${score}/${winScore}`}</Badge>
          {highScore > 0 && <Badge variant="outline" className="text-yellow-400 text-xs">{`Best: ${highScore}`}</Badge>}
          {combo > 1 && (
            <Badge variant="outline" className="text-green-400 text-xs animate-pulse">{`${combo}x Combo!`}</Badge>
          )}
          {gameStarted && !gameOver && (
            <Button onClick={togglePause} variant="outline" size="sm">
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      <div
        className={`relative bg-gray-900 border-2 border-gray-600 mx-auto rounded-lg overflow-hidden shadow-lg transition-all ${
          showEffects ? "ring-4 ring-green-400 ring-opacity-50" : ""
        }`}
        style={{ width: "min(360px, 90vw)", height: "min(360px, 90vw)" }}
      >
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: gridSize }).map((_, row) =>
            Array.from({ length: gridSize }).map((_, col) => (
              <div
                key={`${row}-${col}`}
                className="absolute border border-gray-700"
                style={{
                  left: `${(col / gridSize) * 100}%`,
                  top: `${(row / gridSize) * 100}%`,
                  width: `${100 / gridSize}%`,
                  height: `${100 / gridSize}%`,
                }}
              />
            )),
          )}
        </div>

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute transition-all duration-150 rounded-sm ${
              index === 0
                ? "bg-gradient-to-br from-white to-gray-300 shadow-lg border-2 border-gray-300 z-20"
                : "bg-gradient-to-br from-gray-300 to-gray-500 border border-gray-400 z-10"
            }`}
            style={{
              left: `${(segment[1] / gridSize) * 100}%`,
              top: `${(segment[0] / gridSize) * 100}%`,
              width: `${100 / gridSize}%`,
              height: `${100 / gridSize}%`,
              transform: index === 0 && showEffects ? "scale(1.1)" : "scale(1)",
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg animate-pulse z-10"
          style={{
            left: `${(food[1] / gridSize) * 100}%`,
            top: `${(food[0] / gridSize) * 100}%`,
            width: `${100 / gridSize}%`,
            height: `${100 / gridSize}%`,
          }}
        />

        {/* Power-up */}
        {powerUp && (
          <div
            className="absolute bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg animate-bounce z-10"
            style={{
              left: `${(powerUp[1] / gridSize) * 100}%`,
              top: `${(powerUp[0] / gridSize) * 100}%`,
              width: `${100 / gridSize}%`,
              height: `${100 / gridSize}%`,
            }}
          />
        )}

        {/* Obstacles */}
        {obstacles.map((obstacle, index) => (
          <div
            key={`obstacle-${index}`}
            className="absolute bg-gradient-to-br from-gray-600 to-gray-800 rounded border border-gray-500 z-5"
            style={{
              left: `${(obstacle[1] / gridSize) * 100}%`,
              top: `${(obstacle[0] / gridSize) * 100}%`,
              width: `${100 / gridSize}%`,
              height: `${100 / gridSize}%`,
            }}
          />
        ))}

        {/* Game overlay */}
        {(!gameStarted || isPaused) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
            <div className="text-white text-center">
              {!gameStarted ? (
                <div>
                  <div className="text-3xl mb-2">🐍</div>
                  <div className="text-sm">Ready to start?</div>
                </div>
              ) : (
                <div>
                  <div className="text-3xl mb-2">⏸️</div>
                  <div className="text-sm">Game Paused</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Effects overlay */}
        {showEffects && (
          <div className="absolute inset-0 bg-green-400 bg-opacity-10 animate-pulse z-20 pointer-events-none" />
        )}
      </div>

      {/* Mobile Controls */}
      <div className="block sm:hidden">
        <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
          <div></div>
          <Button
            onClick={() => handleDirectionClick([-1, 0])}
            variant="outline"
            size="sm"
            className="aspect-square"
            disabled={!gameStarted || isPaused || gameOver}
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
          <div></div>
          <Button
            onClick={() => handleDirectionClick([0, -1])}
            variant="outline"
            size="sm"
            className="aspect-square"
            disabled={!gameStarted || isPaused || gameOver}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={togglePause}
            variant="outline"
            size="sm"
            className="aspect-square"
            disabled={!gameStarted || gameOver}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button
            onClick={() => handleDirectionClick([0, 1])}
            variant="outline"
            size="sm"
            className="aspect-square"
            disabled={!gameStarted || isPaused || gameOver}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
          <div></div>
          <Button
            onClick={() => handleDirectionClick([1, 0])}
            variant="outline"
            size="sm"
            className="aspect-square"
            disabled={!gameStarted || isPaused || gameOver}
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
          <div></div>
        </div>
      </div>

      {!gameStarted && (
        <div className="space-y-2 px-4">
          <p className="text-sm text-gray-400">🎯 Collect {winScore} red dots to win!</p>
          <p className="text-xs text-gray-500">Desktop: WASD/Arrow Keys • Mobile: Touch controls • Space: pause</p>
          <p className="text-xs text-gray-500">
            🟡 Power-ups give bonus points • ⬛ Avoid obstacles • Combo streaks for extra points!
          </p>
        </div>
      )}

      <div className="flex gap-3 justify-center px-4 flex-wrap">
        {!gameStarted ? (
          <Button
            onClick={() => setGameStarted(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 flex-1 sm:flex-none min-w-32"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Game
          </Button>
        ) : (
          <Button onClick={resetGame} variant="outline" size="sm" className="flex-1 sm:flex-none">
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        )}
        <Button onClick={onClose} variant="outline" size="sm" className="flex-1 sm:flex-none">
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  )
}
