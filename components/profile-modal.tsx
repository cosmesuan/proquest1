"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button-enhanced"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-enhanced"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { User, Camera, Edit, Save, X, Trophy, Zap, Calendar, Target } from "lucide-react"

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
  tasks: any[]
  achievements: any[]
  gamesWon: number
  location?: string
  favoriteGame?: string
  joinedDate: string
}

interface ProfileModalProps {
  user: UserData
  isOpen: boolean
  onClose: () => void
  onUpdateUser: (userData: UserData) => void
}

export default function ProfileModal({ user, isOpen, onClose, onUpdateUser }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user.name,
    bio: user.bio || "",
    location: user.location || "",
    favoriteGame: user.favoriteGame || "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...editData,
    }
    onUpdateUser(updatedUser)
    setIsEditing(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        const updatedUser = {
          ...user,
          picture: imageUrl,
        }
        onUpdateUser(updatedUser)
      }
      reader.readAsDataURL(file)
    }
  }

  const completedTasks = user.tasks?.filter((task) => task.completed).length || 0
  const completionRate = user.tasks?.length ? Math.round((completedTasks / user.tasks.length) * 100) : 0
  const unlockedAchievements = user.achievements?.filter((a) => a.unlocked).length || 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">{isEditing ? "Edit Profile" : "Your Profile"}</DialogTitle>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            ) : (
              <>
                <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.picture || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-gray-700 text-white text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-gray-600 rounded-full p-2 hover:bg-gray-500 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
            <div className="flex-1 space-y-3">
              {isEditing ? (
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white text-lg font-semibold"
                  placeholder="Your name"
                />
              ) : (
                <h2 className="text-2xl font-bold">{user.name}</h2>
              )}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  Level {user.level}
                </Badge>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  {user.xp} XP
                </Badge>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {user.streak} day streak
                </Badge>
              </div>
              <p className="text-gray-400 text-sm">
                Joined{" "}
                {new Date(user.joinedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Bio Section */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>About</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white resize-none"
                  placeholder="Tell others about yourself..."
                  rows={3}
                />
              ) : (
                <p className="text-gray-300">{user.bio || "No bio yet. Click edit to add one!"}</p>
              )}
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-gray-800 border-gray-700 text-center">
              <CardContent className="p-4">
                <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-xl font-bold">{user.level}</div>
                <div className="text-xs text-gray-400">Level</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 text-center">
              <CardContent className="p-4">
                <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-xl font-bold">{user.xp}</div>
                <div className="text-xs text-gray-400">Total XP</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 text-center">
              <CardContent className="p-4">
                <Calendar className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-xl font-bold">{user.streak}</div>
                <div className="text-xs text-gray-400">Day Streak</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 text-center">
              <CardContent className="p-4">
                <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-xl font-bold">{user.gamesWon}</div>
                <div className="text-xs text-gray-400">Games Won</div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400">Location</label>
                  {isEditing ? (
                    <Input
                      value={editData.location}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white mt-1"
                      placeholder="Your location"
                    />
                  ) : (
                    <p className="text-white">{user.location || "Not specified"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-400">Favorite Game</label>
                  {isEditing ? (
                    <select
                      value={editData.favoriteGame}
                      onChange={(e) => setEditData({ ...editData, favoriteGame: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1"
                    >
                      <option value="">Select a game</option>
                      <option value="tictactoe">Tic Tac Toe</option>
                      <option value="snake">Snake</option>
                      <option value="memory">Memory Match</option>
                      <option value="chess">Chess Puzzles</option>
                    </select>
                  ) : (
                    <p className="text-white">
                      {user.favoriteGame
                        ? user.favoriteGame.charAt(0).toUpperCase() + user.favoriteGame.slice(1)
                        : "None selected"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-base">Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tasks Completed</span>
                  <span className="font-bold">{completedTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Completion Rate</span>
                  <span className="font-bold">{completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Achievements</span>
                  <span className="font-bold">
                    {unlockedAchievements}/{user.achievements?.length || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
