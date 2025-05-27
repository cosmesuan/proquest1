"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button-enhanced"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-enhanced"
import { Badge } from "@/components/ui/badge"
import { Play, Eye, Star, Zap, Brain, Target } from "lucide-react"

interface GamePreviewProps {
  onSelectGame: (game: string) => void
  onClose: () => void
}

export default function GamePreview({ onSelectGame, onClose }: GamePreviewProps) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  const games = [
    {
      id: "tictactoe",
      name: "Tic Tac Toe",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Easy",
      time: "1-2 min",
      description: "Classic strategy game. Beat the AI to win!",
      preview: "🎯 Get 3 in a row before the AI does",
      color: "text-blue-400",
    },
    {
      id: "snake",
      name: "Snake Challenge",
      icon: <Zap className="w-6 h-6" />,
      difficulty: "Medium",
      time: "2-3 min",
      description: "Control the snake and collect 5 food items.",
      preview: "🐍 Use arrow keys to move and grow",
      color: "text-green-400",
    },
    {
      id: "memory",
      name: "Memory Match",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Easy",
      time: "1-3 min",
      description: "Match all pairs of symbols to complete.",
      preview: "🧠 Flip cards and find matching pairs",
      color: "text-purple-400",
    },
    {
      id: "chess",
      name: "Chess Puzzle",
      icon: <Star className="w-6 h-6" />,
      difficulty: "Medium",
      time: "2-4 min",
      description: "Solve checkmate puzzles in one move.",
      preview: "♔ Find the winning move to checkmate",
      color: "text-yellow-400",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold">Choose Your Challenge</h3>
        <p className="text-gray-400 text-sm">Select a mini-game to complete your task</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {games.map((game) => (
          <Card
            key={game.id}
            className={`bg-gray-800 border-gray-700 cursor-pointer transition-all hover:border-gray-600 ${
              selectedGame === game.id ? "ring-2 ring-white" : ""
            }`}
            onClick={() => setSelectedGame(game.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-3">
                <div className={`${game.color}`}>{game.icon}</div>
                <span className="text-base sm:text-lg">{game.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-300 text-sm">{game.description}</p>
              <div className="text-xs text-gray-400">{game.preview}</div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {game.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {game.time}
                  </Badge>
                </div>
                {selectedGame === game.id && (
                  <div className="flex items-center space-x-1 text-green-400">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs">Selected</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Button
          onClick={() => selectedGame && onSelectGame(selectedGame)}
          disabled={!selectedGame}
          className="bg-white text-black hover:bg-gray-100 rounded-xl px-8 h-12 font-medium"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Challenge
        </Button>
        <Button onClick={onClose} variant="outline" className="rounded-xl px-6 h-12">
          Cancel
        </Button>
      </div>
    </div>
  )
}
