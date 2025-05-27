"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button-enhanced"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, X, ChevronLeft, ChevronRight } from "lucide-react"

interface EnhancedChessProps {
  onWin: () => void
  onClose: () => void
}

export default function EnhancedChess({ onWin, onClose }: EnhancedChessProps) {
  const puzzles = [
    {
      id: 1,
      name: "Beginner Mate",
      board: [
        "r",
        null,
        null,
        null,
        "k",
        null,
        null,
        "r",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "P",
        "P",
        "P",
        "P",
        "P",
        "P",
        "P",
        "P",
        "R",
        null,
        null,
        "Q",
        "K",
        null,
        null,
        "R",
      ],
      solution: { from: 59, to: 3 }, // Queen to d8
      hint: "Move your Queen to deliver checkmate on the back rank!",
    },
    {
      id: 2,
      name: "Knight Fork",
      board: [
        "r",
        "n",
        "b",
        "q",
        "k",
        "b",
        null,
        "r",
        "p",
        "p",
        "p",
        "p",
        null,
        "p",
        "p",
        "p",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "p",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "P",
        null,
        null,
        null,
        null,
        null,
        "N",
        null,
        null,
        null,
        null,
        null,
        "P",
        "P",
        "P",
        "P",
        null,
        "P",
        "P",
        "P",
        "R",
        null,
        "B",
        "Q",
        "K",
        "B",
        null,
        "R",
      ],
      solution: { from: 42, to: 19 }, // Knight fork
      hint: "Use your Knight to attack both the King and Queen!",
    },
    {
      id: 3,
      name: "Back Rank Mate",
      board: [
        null,
        null,
        null,
        null,
        null,
        "r",
        "k",
        null,
        null,
        null,
        null,
        null,
        null,
        "p",
        "p",
        "p",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "P",
        "P",
        "P",
        "P",
        "P",
        "P",
        "P",
        "P",
        null,
        null,
        null,
        null,
        null,
        "R",
        "K",
        null,
      ],
      solution: { from: 61, to: 5 }, // Rook to f8
      hint: "Deliver mate on the back rank with your Rook!",
    },
  ]

  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [board, setBoard] = useState(puzzles[0].board)
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null)
  const [solved, setSolved] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [moveHistory, setMoveHistory] = useState<string[]>([])

  const puzzle = puzzles[currentPuzzle]

  const handleSquareClick = (index: number) => {
    if (solved) return

    if (selectedSquare === null) {
      if (board[index] && board[index]?.toUpperCase() === board[index]) {
        setSelectedSquare(index)
      }
    } else {
      if (selectedSquare === index) {
        setSelectedSquare(null)
      } else {
        // Check if this is the correct solution
        if (selectedSquare === puzzle.solution.from && index === puzzle.solution.to) {
          const newBoard = [...board]
          const piece = newBoard[selectedSquare]
          newBoard[index] = piece
          newBoard[selectedSquare] = null
          setBoard(newBoard)
          setSolved(true)

          // Add move to history
          const move = `${getPieceSymbol(piece)} ${getSquareName(selectedSquare)} → ${getSquareName(index)}`
          setMoveHistory((prev) => [...prev, move])

          setTimeout(() => onWin(), 1000)
        } else {
          // Wrong move, show feedback
          setSelectedSquare(null)
          // Could add wrong move feedback here
        }
      }
    }
  }

  const nextPuzzle = () => {
    if (currentPuzzle < puzzles.length - 1) {
      const nextIndex = currentPuzzle + 1
      setCurrentPuzzle(nextIndex)
      setBoard(puzzles[nextIndex].board)
      setSelectedSquare(null)
      setSolved(false)
      setShowHint(false)
      setMoveHistory([])
    }
  }

  const prevPuzzle = () => {
    if (currentPuzzle > 0) {
      const prevIndex = currentPuzzle - 1
      setCurrentPuzzle(prevIndex)
      setBoard(puzzles[prevIndex].board)
      setSelectedSquare(null)
      setSolved(false)
      setShowHint(false)
      setMoveHistory([])
    }
  }

  const resetPuzzle = () => {
    setBoard(puzzle.board)
    setSelectedSquare(null)
    setSolved(false)
    setShowHint(false)
    setMoveHistory([])
  }

  const getPieceSymbol = (piece: string | null) => {
    const pieces: { [key: string]: string } = {
      K: "♔",
      Q: "♕",
      R: "♖",
      B: "♗",
      N: "♘",
      P: "♙",
      k: "♚",
      q: "♛",
      r: "♜",
      b: "♝",
      n: "♞",
      p: "♟",
    }
    return piece ? pieces[piece] : ""
  }

  const getSquareName = (index: number) => {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
    const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"]
    const file = files[index % 8]
    const rank = ranks[Math.floor(index / 8)]
    return file + rank
  }

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-between px-4">
        <div className="text-base sm:text-lg font-semibold">
          {solved ? "🎉 Puzzle Solved!" : `Chess Puzzle ${currentPuzzle + 1}`}
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {puzzle.name}
          </Badge>
          <div className="flex items-center space-x-1">
            <Button onClick={prevPuzzle} disabled={currentPuzzle === 0} variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs text-gray-400">
              {currentPuzzle + 1}/{puzzles.length}
            </span>
            <Button onClick={nextPuzzle} disabled={currentPuzzle === puzzles.length - 1} variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-0 max-w-80 mx-auto border-2 border-gray-600 rounded-lg overflow-hidden shadow-lg">
        {board.map((piece, index) => {
          const row = Math.floor(index / 8)
          const col = index % 8
          const isLight = (row + col) % 2 === 0
          const isSelected = selectedSquare === index
          const isHighlighted =
            (selectedSquare === puzzle.solution.from && index === puzzle.solution.to) ||
            (selectedSquare === puzzle.solution.to && index === puzzle.solution.from)

          return (
            <button
              key={index}
              onClick={() => handleSquareClick(index)}
              className={`aspect-square w-full text-lg sm:text-xl flex items-center justify-center transition-all relative ${
                isLight ? "bg-gray-200" : "bg-gray-600"
              } ${isSelected ? "ring-2 ring-yellow-400" : ""} ${
                isHighlighted ? "ring-2 ring-green-400" : ""
              } hover:opacity-80 active:scale-95`}
            >
              {getPieceSymbol(piece)}

              {/* Square coordinates */}
              {(index >= 56 || index % 8 === 0) && (
                <div className="absolute text-xs text-gray-500">
                  {index >= 56 && (
                    <span className="absolute bottom-0 right-0.5">{String.fromCharCode(97 + (index % 8))}</span>
                  )}
                  {index % 8 === 0 && <span className="absolute top-0.5 left-0.5">{8 - Math.floor(index / 8)}</span>}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {showHint && (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 mx-4">
          <p className="text-sm text-yellow-400">💡 {puzzle.hint}</p>
        </div>
      )}

      {moveHistory.length > 0 && (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 mx-4">
          <p className="text-sm text-gray-400">Last move: {moveHistory[moveHistory.length - 1]}</p>
        </div>
      )}

      <div className="flex gap-2 justify-center flex-wrap px-4">
        <Button
          onClick={() => setShowHint(!showHint)}
          variant="outline"
          size="sm"
          disabled={solved}
          className="flex-1 sm:flex-none"
        >
          {showHint ? "Hide Hint" : "Show Hint"}
        </Button>
        <Button onClick={resetPuzzle} variant="outline" size="sm" className="flex-1 sm:flex-none">
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
        <Button onClick={onClose} variant="outline" size="sm" className="flex-1 sm:flex-none">
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  )
}
