"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "./components/ui/button-enhanced"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card-enhanced"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Plus,
  Trash2,
  Trophy,
  Zap,
  Target,
  Calendar,
  Star,
  Award,
  X,
  RotateCcw,
  LogOut,
  Menu,
  Users,
  MessageCircle,
} from "lucide-react"

import AuthForm from "./components/auth-form"
import GamePreview from "./components/game-preview"
import EnhancedSnake from "./components/enhanced-snake"
import EnhancedChess from "./components/enhanced-chess"
import ProfileModal from "./components/profile-modal"
import SocialChat from "./components/social-chat"

interface Task {
  id: string
  text: string
  completed: boolean
  priority: "low" | "medium" | "high"
  xp: number
  completedAt?: string
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
}

interface UserData {
  id: string
  name: string
  email: string
  picture?: string
  bio?: string
  xp: number
  level: number
  streak: number
  tasksCompletedToday: number
  tasks: Task[]
  achievements: Achievement[]
  gamesWon: number
  location?: string
  favoriteGame?: string
  joinedDate: string
}

type GameType = "tictactoe" | "snake" | "memory" | "chess"

// Enhanced Tic Tac Toe Component
function TicTacToe({ onWin, onClose }: { onWin: () => void; onClose: () => void }) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [playerWins, setPlayerWins] = useState(0)
  const [aiWins, setAiWins] = useState(0)
  const [showWinAnimation, setShowWinAnimation] = useState(false)

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ]

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const makeAIMove = useCallback(
    (currentBoard: (string | null)[]) => {
      const availableSpots = currentBoard
        .map((spot, index) => (spot === null ? index : null))
        .filter((val) => val !== null) as number[]
      if (availableSpots.length === 0) return currentBoard

      // Enhanced AI based on difficulty
      const checkMove = (board: (string | null)[], player: string) => {
        for (const spot of availableSpots) {
          const testBoard = [...board]
          testBoard[spot] = player
          if (checkWinner(testBoard) === player) {
            return spot
          }
        }
        return null
      }

      // Try to win
      const winMove = checkMove(currentBoard, "O")
      if (winMove !== null) {
        const newBoard = [...currentBoard]
        newBoard[winMove] = "O"
        return newBoard
      }

      // Try to block player win (except on easy mode)
      if (difficulty !== "easy") {
        const blockMove = checkMove(currentBoard, "X")
        if (blockMove !== null) {
          const newBoard = [...currentBoard]
          newBoard[blockMove] = "O"
          return newBoard
        }
      }

      // Strategic moves based on difficulty
      let move: number
      if (difficulty === "hard") {
        // Hard: prioritize center, corners, then edges
        const preferredMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7].filter((i) => availableSpots.includes(i))
        move = preferredMoves[0]
      } else if (difficulty === "medium") {
        // Medium: mix of strategy and randomness
        const strategicMoves = [4, 0, 2, 6, 8].filter((i) => availableSpots.includes(i))
        const randomMoves = availableSpots.filter((i) => ![4, 0, 2, 6, 8].includes(i))

        if (Math.random() < 0.7 && strategicMoves.length > 0) {
          move = strategicMoves[Math.floor(Math.random() * strategicMoves.length)]
        } else {
          move = availableSpots[Math.floor(Math.random() * availableSpots.length)]
        }
      } else {
        // Easy: random moves
        move = availableSpots[Math.floor(Math.random() * availableSpots.length)]
      }

      const newBoard = [...currentBoard]
      newBoard[move] = "O"
      return newBoard
    },
    [difficulty],
  )

  const handleClick = (index: number) => {
    if (board[index] || gameOver || !isPlayerTurn) return

    const newBoard = [...board]
    newBoard[index] = "X"
    setBoard(newBoard)

    const playerWin = checkWinner(newBoard)
    if (playerWin === "X") {
      setWinner("X")
      setGameOver(true)
      setPlayerWins((prev) => prev + 1)
      setShowWinAnimation(true)
      setTimeout(() => {
        setShowWinAnimation(false)
        onWin()
      }, 1500)
      return
    }

    if (newBoard.every((cell) => cell !== null)) {
      setGameOver(true)
      return
    }

    setIsPlayerTurn(false)
    setTimeout(() => {
      const aiBoard = makeAIMove(newBoard)
      setBoard(aiBoard)

      const aiWin = checkWinner(aiBoard)
      if (aiWin === "O") {
        setWinner("O")
        setGameOver(true)
        setAiWins((prev) => prev + 1)
      } else if (aiBoard.every((cell) => cell !== null)) {
        setGameOver(true)
      } else {
        setIsPlayerTurn(true)
      }
    }, 500)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsPlayerTurn(true)
    setGameOver(false)
    setWinner(null)
    setShowWinAnimation(false)
  }

  return (
    <div className="text-center space-y-4">
      <div
        className={`text-base sm:text-lg font-semibold px-4 transition-all ${showWinAnimation ? "animate-bounce text-green-400" : ""}`}
      >
        {gameOver
          ? winner === "X"
            ? "🎉 You Won!"
            : winner === "O"
              ? "🤖 AI Won! Try Again"
              : "🤝 It's a Tie!"
          : isPlayerTurn
            ? "Your Turn (X)"
            : "AI Turn (O)"}
      </div>

      {/* Difficulty Selector */}
      <div className="flex justify-center space-x-2 px-4">
        <span className="text-sm text-gray-400">Difficulty:</span>
        {(["easy", "medium", "hard"] as const).map((diff) => (
          <button
            key={diff}
            onClick={() => setDifficulty(diff)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              difficulty === diff ? "bg-white text-black" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>

      {/* Score Display */}
      <div className="flex justify-center space-x-4 px-4">
        <Badge variant="outline" className="text-blue-400">
          You: {playerWins}
        </Badge>
        <Badge variant="outline" className="text-red-400">
          AI: {aiWins}
        </Badge>
      </div>

      <div
        className={`grid grid-cols-3 gap-2 max-w-64 sm:max-w-60 mx-auto px-4 transition-all ${showWinAnimation ? "scale-105" : ""}`}
      >
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={`aspect-square w-full bg-gray-800 border-2 border-gray-600 text-2xl sm:text-3xl font-bold transition-all rounded-lg hover:scale-105 ${
              !gameOver && !cell ? "hover:bg-gray-700 hover:border-gray-500 active:scale-95" : ""
            } ${cell === "X" ? "text-blue-400" : cell === "O" ? "text-red-400" : ""}`}
            disabled={gameOver || !isPlayerTurn || !!cell}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="flex gap-3 justify-center px-4">
        <Button onClick={resetGame} variant="outline" size="sm" className="flex-1 sm:flex-none">
          <RotateCcw className="w-4 h-4 mr-1" />
          New Game
        </Button>
        <Button onClick={onClose} variant="outline" size="sm" className="flex-1 sm:flex-none">
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  )
}

// Enhanced Memory Game Component
function MemoryGame({ onWin, onClose }: { onWin: () => void; onClose: () => void }) {
  const [cards, setCards] = useState<{ id: number; value: string; flipped: boolean; matched: boolean }[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(90)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [bestMoves, setBestMoves] = useState<number | null>(null)

  const symbols = {
    easy: ["🎯", "🎮", "🏆", "⭐"],
    medium: ["🎯", "🎮", "🏆", "⭐", "🎪", "🎨"],
    hard: ["🎯", "🎮", "🏆", "⭐", "🎪", "🎨", "🚀", "💎"],
  }

  useEffect(() => {
    const savedBestTime = localStorage.getItem(`memory-best-time-${difficulty}`)
    const savedBestMoves = localStorage.getItem(`memory-best-moves-${difficulty}`)

    if (savedBestTime) setBestTime(Number.parseInt(savedBestTime))
    if (savedBestMoves) setBestMoves(Number.parseInt(savedBestMoves))
  }, [difficulty])

  const initializeGame = () => {
    const gameSymbols = symbols[difficulty]
    const gameCards = [...gameSymbols, ...gameSymbols].map((symbol, index) => ({
      id: index,
      value: symbol,
      flipped: false,
      matched: false,
    }))

    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]]
    }

    setCards(gameCards)
    setFlippedCards([])
    setMoves(0)
    setGameStarted(true)
    setTimeLeft(difficulty === "easy" ? 120 : difficulty === "medium" ? 90 : 60)
  }

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [gameStarted, timeLeft])

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || timeLeft === 0) return
    if (cards[cardId].flipped || cards[cardId].matched) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    setCards((prev) => prev.map((card) => (card.id === cardId ? { ...card, flipped: true } : card)))

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1)

      const [first, second] = newFlippedCards
      if (cards[first].value === cards[second].value) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) => (card.id === first || card.id === second ? { ...card, matched: true } : card)),
          )
          setFlippedCards([])

          // Check if all cards are matched
          const allMatched = cards.every((card) => card.id === first || card.id === second || card.matched)
          if (allMatched) {
            const finalTime = (difficulty === "easy" ? 120 : difficulty === "medium" ? 90 : 60) - timeLeft
            const finalMoves = moves + 1

            // Save best scores
            if (!bestTime || finalTime < bestTime) {
              setBestTime(finalTime)
              localStorage.setItem(`memory-best-time-${difficulty}`, finalTime.toString())
            }
            if (!bestMoves || finalMoves < bestMoves) {
              setBestMoves(finalMoves)
              localStorage.setItem(`memory-best-moves-${difficulty}`, finalMoves.toString())
            }

            setTimeout(() => onWin(), 1000)
          }
        }, 1000)
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) => (card.id === first || card.id === second ? { ...card, flipped: false } : card)),
          )
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const matchedPairs = cards.filter((card) => card.matched).length / 2
  const totalPairs = symbols[difficulty].length

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-between px-4">
        <div className="text-base sm:text-lg font-semibold">
          {!gameStarted
            ? "Memory Challenge"
            : matchedPairs === totalPairs
              ? "🎉 Perfect Memory!"
              : timeLeft === 0
                ? "⏰ Time's Up!"
                : "🧠 Memory Game"}
        </div>
        <div className="flex items-center space-x-2">
          {gameStarted && (
            <>
              <Badge variant="outline" className="text-xs">{`${matchedPairs}/${totalPairs}`}</Badge>
              <Badge variant="outline" className={`text-xs ${timeLeft < 20 ? "text-red-400 animate-pulse" : ""}`}>
                {`${timeLeft}s`}
              </Badge>
              <Badge variant="outline" className="text-xs">{`${moves} moves`}</Badge>
            </>
          )}
        </div>
      </div>

      {!gameStarted && (
        <div className="space-y-4 px-4">
          {/* Difficulty Selector */}
          <div className="flex justify-center space-x-2">
            <span className="text-sm text-gray-400">Difficulty:</span>
            {(["easy", "medium", "hard"] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  difficulty === diff ? "bg-white text-black" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {diff} ({symbols[diff].length} pairs)
              </button>
            ))}
          </div>

          {/* Best Scores */}
          {(bestTime || bestMoves) && (
            <div className="flex justify-center space-x-4">
              {bestTime && (
                <Badge variant="outline" className="text-green-400">
                  Best Time: {bestTime}s
                </Badge>
              )}
              {bestMoves && (
                <Badge variant="outline" className="text-blue-400">
                  Best Moves: {bestMoves}
                </Badge>
              )}
            </div>
          )}
        </div>
      )}

      {gameStarted ? (
        <div
          className={`grid gap-2 sm:gap-3 max-w-80 mx-auto px-4 ${
            difficulty === "easy" ? "grid-cols-4" : difficulty === "medium" ? "grid-cols-4" : "grid-cols-4"
          }`}
        >
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square w-full text-lg sm:text-xl border-2 border-gray-600 transition-all rounded-lg hover:scale-105 ${
                card.flipped || card.matched
                  ? "bg-white text-black border-gray-300 transform scale-105"
                  : "bg-gray-800 hover:bg-gray-700 hover:border-gray-500 active:scale-95"
              }`}
              disabled={card.flipped || card.matched || timeLeft === 0}
            >
              {card.flipped || card.matched ? card.value : "?"}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4 px-4">
          <p className="text-gray-400">Match all pairs before time runs out!</p>
          <Button onClick={initializeGame} className="w-full sm:w-auto bg-white text-black hover:bg-gray-200">
            Start Memory Game
          </Button>
        </div>
      )}

      <div className="flex gap-3 justify-center px-4">
        {gameStarted && (
          <Button onClick={initializeGame} variant="outline" size="sm" className="flex-1 sm:flex-none">
            <RotateCcw className="w-4 h-4 mr-1" />
            New Game
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

export default function GamifiedTodo() {
  const [user, setUser] = useState<UserData | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [gameModalOpen, setGameModalOpen] = useState(false)
  const [gamePreviewOpen, setGamePreviewOpen] = useState(false)
  const [currentGame, setCurrentGame] = useState<GameType>("tictactoe")
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  const xpToNextLevel = (user?.level || 1) * 100
  const currentLevelXp = (user?.xp || 0) % 100

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first-task",
      name: "Getting Started",
      description: "Complete your first task",
      icon: <Star className="w-4 h-4" />,
      unlocked: false,
    },
    {
      id: "streak-3",
      name: "On Fire",
      description: "Maintain a 3-day streak",
      icon: <Zap className="w-4 h-4" />,
      unlocked: false,
    },
    {
      id: "tasks-10",
      name: "Productive",
      description: "Complete 10 tasks in one day",
      icon: <Target className="w-4 h-4" />,
      unlocked: false,
    },
    {
      id: "level-5",
      name: "Level Master",
      description: "Reach level 5",
      icon: <Award className="w-4 h-4" />,
      unlocked: false,
    },
  ])

  // Load user data on login
  useEffect(() => {
    if (user) {
      setTasks(user.tasks || [])
      setAchievements((prev) =>
        prev.map((ach) => ({
          ...ach,
          unlocked: user.achievements?.find((userAch) => userAch.id === ach.id)?.unlocked || false,
        })),
      )
    }
  }, [user])

  // Save user data whenever it changes
  useEffect(() => {
    if (user) {
      const users = JSON.parse(localStorage.getItem("proquest-users") || "{}")
      users[user.email] = {
        ...user,
        tasks,
        achievements: achievements.map((ach) => ({ id: ach.id, unlocked: ach.unlocked })),
      }
      localStorage.setItem("proquest-users", JSON.stringify(users))
    }
  }, [user, tasks, achievements])

  const handleLogin = (userData: UserData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
    setTasks([])
    setAchievements((prev) => prev.map((ach) => ({ ...ach, unlocked: false })))
    setChatOpen(false)
    setProfileModalOpen(false)
    setSidebarOpen(false)
  }

  const handleUpdateUser = (updatedUser: UserData) => {
    setUser(updatedUser)
  }

  const getPriorityXP = (priority: string) => {
    switch (priority) {
      case "high":
        return 30
      case "medium":
        return 20
      case "low":
        return 10
      default:
        return 20
    }
  }

  const addTask = () => {
    if (newTask.trim() && user) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        priority,
        xp: getPriorityXP(priority),
      }
      setTasks([...tasks, task])
      setNewTask("")
    }
  }

  const startGameChallenge = (taskId: string) => {
    setPendingTaskId(taskId)
    setGamePreviewOpen(true)
  }

  const handleGameSelect = (gameType: string) => {
    setCurrentGame(gameType as GameType)
    setGamePreviewOpen(false)
    setGameModalOpen(true)
  }

  const handleGameWin = () => {
    if (pendingTaskId && user) {
      completeTask(pendingTaskId)
      setUser((prev) => (prev ? { ...prev, gamesWon: prev.gamesWon + 1 } : null))
    }
    setGameModalOpen(false)
    setPendingTaskId(null)
  }

  const handleGameClose = () => {
    setGameModalOpen(false)
    setGamePreviewOpen(false)
    setPendingTaskId(null)
  }

  const completeTask = (id: string) => {
    if (!user) return

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id && !task.completed) {
          const completedTask = { ...task, completed: true, completedAt: new Date().toISOString() }

          // Update user stats
          setUser((prevUser) =>
            prevUser
              ? {
                  ...prevUser,
                  xp: prevUser.xp + task.xp,
                  tasksCompletedToday: prevUser.tasksCompletedToday + 1,
                }
              : null,
          )

          checkAchievements()
          return completedTask
        }
        return task
      }),
    )
  }

  const toggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task || !user) return

    if (task.completed) {
      // Uncomplete task
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            setUser((prevUser) =>
              prevUser
                ? {
                    ...prevUser,
                    xp: Math.max(0, prevUser.xp - task.xp),
                    tasksCompletedToday: Math.max(0, prevUser.tasksCompletedToday - 1),
                  }
                : null,
            )
            return { ...t, completed: false, completedAt: undefined }
          }
          return t
        }),
      )
    } else {
      // Start game challenge to complete task
      startGameChallenge(id)
    }
  }

  const deleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (task?.completed && user) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              xp: Math.max(0, prev.xp - task.xp),
              tasksCompletedToday: Math.max(0, prev.tasksCompletedToday - 1),
            }
          : null,
      )
    }
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const checkAchievements = () => {
    if (!user) return

    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.unlocked) return achievement

        switch (achievement.id) {
          case "first-task":
            return { ...achievement, unlocked: tasks.some((t) => t.completed) }
          case "streak-3":
            return { ...achievement, unlocked: user.streak >= 3 }
          case "tasks-10":
            return { ...achievement, unlocked: user.tasksCompletedToday >= 10 }
          case "level-5":
            return { ...achievement, unlocked: user.level >= 5 }
          default:
            return achievement
        }
      }),
    )
  }

  useEffect(() => {
    if (user) {
      const newLevel = Math.floor(user.xp / 100) + 1
      if (newLevel > user.level) {
        setUser((prev) => (prev ? { ...prev, level: newLevel } : null))
      }
    }
  }, [user])

  useEffect(() => {
    checkAchievements()
  }, [tasks, user?.streak, user?.tasksCompletedToday, user?.level])

  const renderGame = () => {
    switch (currentGame) {
      case "tictactoe":
        return <TicTacToe onWin={handleGameWin} onClose={handleGameClose} />
      case "snake":
        return <EnhancedSnake onWin={handleGameWin} onClose={handleGameClose} />
      case "memory":
        return <MemoryGame onWin={handleGameWin} onClose={handleGameClose} />
      case "chess":
        return <EnhancedChess onWin={handleGameWin} onClose={handleGameClose} />
      default:
        return <TicTacToe onWin={handleGameWin} onClose={handleGameClose} />
    }
  }

  if (!user) {
    return <AuthForm onLogin={handleLogin} />
  }

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">ProQuest</h1>
              <p className="text-xs text-gray-400">Level {user.level}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setChatOpen(!chatOpen)}>
              <MessageCircle className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setProfileModalOpen(true)}>
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.picture || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-white text-black text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`lg:hidden fixed left-0 top-0 z-50 h-full w-80 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 space-y-4 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Mobile Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-3 text-center">
                  <Trophy className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                  <div className="text-lg font-bold">{user.level}</div>
                  <div className="text-xs text-gray-400">Level</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-3 text-center">
                  <Zap className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <div className="text-lg font-bold">{user.xp}</div>
                  <div className="text-xs text-gray-400">XP</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-3 text-center">
                  <Calendar className="w-4 h-4 text-green-400 mx-auto mb-1" />
                  <div className="text-lg font-bold">{user.streak}</div>
                  <div className="text-xs text-gray-400">Streak</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-3 text-center">
                  <Award className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                  <div className="text-lg font-bold">{user.gamesWon}</div>
                  <div className="text-xs text-gray-400">Games</div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Achievements */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {achievements.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center space-x-2 p-2 rounded-lg ${
                      achievement.unlocked ? "bg-yellow-900/20" : "bg-gray-700/50"
                    }`}
                  >
                    <div className={`p-1 rounded-full ${achievement.unlocked ? "bg-yellow-600" : "bg-gray-600"}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-medium ${achievement.unlocked ? "text-yellow-400" : "text-gray-400"}`}
                      >
                        {achievement.name}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
                ProQuest
              </h1>
              <p className="text-gray-400">Win mini-games to complete tasks and level up</p>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => setChatOpen(!chatOpen)} className="rounded-xl">
                <Users className="w-4 h-4 mr-2" />
                Social
              </Button>
              <div className="flex items-center space-x-3 bg-gray-900/50 backdrop-blur-xl rounded-2xl p-3 border border-gray-800/50">
                <Button variant="ghost" size="icon" onClick={() => setProfileModalOpen(true)}>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.picture || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-white text-black font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
                <div>
                  <div className="font-medium text-white text-sm">{user.name}</div>
                  <div className="text-xs text-gray-400">Level {user.level}</div>
                </div>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm" className="rounded-xl">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Profile Modal */}
          <ProfileModal
            user={user}
            isOpen={profileModalOpen}
            onClose={() => setProfileModalOpen(false)}
            onUpdateUser={handleUpdateUser}
          />

          {/* Social Chat */}
          <SocialChat currentUser={user} isOpen={chatOpen} />

          {/* Game Preview Modal */}
          <Dialog open={gamePreviewOpen} onOpenChange={setGamePreviewOpen}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl mx-4">
              <DialogHeader>
                <DialogTitle className="text-center text-xl">Choose Your Challenge</DialogTitle>
              </DialogHeader>
              <GamePreview onSelectGame={handleGameSelect} onClose={handleGameClose} />
            </DialogContent>
          </Dialog>

          {/* Game Challenge Modal */}
          <Dialog open={gameModalOpen} onOpenChange={setGameModalOpen}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center text-xl">Complete the Challenge</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="text-center mb-4 text-sm text-gray-400">
                  Win this game to mark your task as completed!
                </div>
                {renderGame()}
              </div>
            </DialogContent>
          </Dialog>

          {/* Desktop Stats Dashboard */}
          <div className="hidden lg:grid grid-cols-5 gap-4 mb-6">
            <Card className="bg-gray-900 border-gray-800 hover:bg-gray-850 transition-all">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-gray-400">Level</span>
                </div>
                <div className="text-2xl font-bold">{user.level}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:bg-gray-850 transition-all">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-400">XP</span>
                </div>
                <div className="text-2xl font-bold">{user.xp}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:bg-gray-850 transition-all">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-400">Streak</span>
                </div>
                <div className="text-2xl font-bold">{user.streak} days</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:bg-gray-850 transition-all">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-gray-400">Today</span>
                </div>
                <div className="text-2xl font-bold">{user.tasksCompletedToday}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:bg-gray-850 transition-all">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-orange-400" />
                  <span className="text-sm text-gray-400">Games Won</span>
                </div>
                <div className="text-2xl font-bold">{user.gamesWon}</div>
              </CardContent>
            </Card>
          </div>

          {/* Level Progress */}
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Level {user.level} Progress</span>
                <span className="text-sm text-gray-400">
                  {currentLevelXp}/{xpToNextLevel} XP
                </span>
              </div>
              <Progress value={(currentLevelXp / xpToNextLevel) * 100} className="h-3" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task Management */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Add New Quest</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="What would you like to accomplish today?"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12 text-base"
                  />
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Priority:</span>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white flex-1 sm:flex-none"
                      >
                        <option value="low">Low (10 XP)</option>
                        <option value="medium">Medium (20 XP)</option>
                        <option value="high">High (30 XP)</option>
                      </select>
                    </div>
                    <Button
                      onClick={addTask}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-xl px-6 h-12"
                    >
                      Add Quest
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Task List */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>
                    Active Quests ({completedTasks}/{totalTasks})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No quests yet. Add your first task to begin your journey!</p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center space-x-3 p-4 rounded-lg border transition-all hover:scale-[1.02] ${
                          task.completed
                            ? "bg-gradient-to-r from-green-900/20 to-green-800/20 border-green-600 opacity-90"
                            : "bg-gray-800 border-gray-600 hover:border-gray-500 hover:bg-gray-750"
                        }`}
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                          className="border-gray-600 min-w-[20px] min-h-[20px]"
                        />
                        <div className="flex-1 min-w-0">
                          <span
                            className={`${task.completed ? "line-through text-gray-500" : "text-white"} break-words`}
                          >
                            {task.text}
                          </span>
                          {!task.completed && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                              <span>🎮</span>
                              <span>Complete a mini-game to finish this task</span>
                            </div>
                          )}
                          {task.completed && task.completedAt && (
                            <div className="text-xs text-green-400 mt-1">
                              ✅ Completed {new Date(task.completedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              task.priority === "high"
                                ? "border-red-500 text-red-400"
                                : task.priority === "medium"
                                  ? "border-yellow-500 text-yellow-400"
                                  : "border-green-500 text-green-400"
                            }`}
                          >
                            {task.xp} XP
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                            className="text-gray-400 hover:text-red-400 min-w-[36px] min-h-[36px]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block space-y-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-3 rounded-lg border transition-all hover:scale-105 ${
                        achievement.unlocked
                          ? "bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border-yellow-600"
                          : "bg-gray-800 border-gray-700"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${achievement.unlocked ? "bg-yellow-600" : "bg-gray-700"}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${achievement.unlocked ? "text-yellow-400" : "text-gray-400"}`}>
                            {achievement.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Game Info */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>🎮 Available Games</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2 p-2 bg-gray-800 rounded">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span>Tic Tac Toe</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-gray-800 rounded">
                      <Zap className="w-4 h-4 text-green-400" />
                      <span>Snake</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-gray-800 rounded">
                      <Star className="w-4 h-4 text-purple-400" />
                      <span>Memory</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-gray-800 rounded">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span>Chess</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Enhanced games with difficulty levels, high scores, and special features!
                  </p>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Completion Rate</span>
                    <span className="font-bold">
                      {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total XP Earned</span>
                    <span className="font-bold">{user.xp}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Games Won</span>
                    <span className="font-bold">{user.gamesWon}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Achievements</span>
                    <span className="font-bold">
                      {achievements.filter((a) => a.unlocked).length}/{achievements.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
