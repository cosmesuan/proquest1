"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button-enhanced"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Crown, Zap, Calendar, Trophy } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  picture?: string
  level: number
  xp: number
  streak: number
  gamesWon: number
  isOnline: boolean
  lastSeen?: string
}

interface Message {
  id: string
  userId: string
  userName: string
  userPicture?: string
  text: string
  timestamp: string
  type: "message" | "achievement" | "level_up"
}

interface SocialChatProps {
  currentUser: User
  isOpen: boolean
}

export default function SocialChat({ currentUser, isOpen }: SocialChatProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "leaderboard">("chat")
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "Alex Rodriguez",
        email: "alex@example.com",
        picture: "/placeholder.svg?height=40&width=40",
        level: 12,
        xp: 2450,
        streak: 15,
        gamesWon: 89,
        isOnline: true,
      },
      {
        id: "2",
        name: "Sarah Chen",
        email: "sarah@example.com",
        picture: "/placeholder.svg?height=40&width=40",
        level: 8,
        xp: 1680,
        streak: 7,
        gamesWon: 45,
        isOnline: true,
      },
      {
        id: "3",
        name: "Mike Johnson",
        email: "mike@example.com",
        level: 15,
        xp: 3200,
        streak: 23,
        gamesWon: 156,
        isOnline: false,
        lastSeen: "2 hours ago",
      },
      {
        id: "4",
        name: "Emma Wilson",
        email: "emma@example.com",
        picture: "/placeholder.svg?height=40&width=40",
        level: 6,
        xp: 980,
        streak: 4,
        gamesWon: 28,
        isOnline: true,
      },
    ]

    const mockMessages: Message[] = [
      {
        id: "1",
        userId: "1",
        userName: "Alex Rodriguez",
        userPicture: "/placeholder.svg?height=40&width=40",
        text: "Just hit level 12! This snake game is getting intense 🐍",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: "message",
      },
      {
        id: "2",
        userId: "2",
        userName: "Sarah Chen",
        text: "Congrats Alex! I'm still stuck on the chess puzzles 😅",
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        type: "message",
      },
      {
        id: "3",
        userId: "1",
        userName: "Alex Rodriguez",
        text: "🎉 Leveled up to Level 12!",
        timestamp: new Date(Date.now() - 2400000).toISOString(),
        type: "level_up",
      },
      {
        id: "4",
        userId: "4",
        userName: "Emma Wilson",
        userPicture: "/placeholder.svg?height=40&width=40",
        text: "Anyone want to race on completing tasks today? 🏃‍♀️",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        type: "message",
      },
    ]

    setOnlineUsers(mockUsers)
    setMessages(mockMessages)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        userPicture: currentUser.picture,
        text: newMessage,
        timestamp: new Date().toISOString(),
        type: "message",
      }
      setMessages((prev) => [...prev, message])
      setNewMessage("")
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  const leaderboardUsers = [...onlineUsers, currentUser].sort((a, b) => b.xp - a.xp).slice(0, 10)

  return (
    <div
      className={`fixed right-4 bottom-4 w-80 h-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl transition-all duration-300 ${
        isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "chat" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "leaderboard" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Leaders
          </button>
        </div>
        <div className="flex items-center space-x-1 text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs">{onlineUsers.filter((u) => u.isOnline).length} online</span>
        </div>
      </div>

      {/* Content */}
      <div className="h-80">
        {activeTab === "chat" ? (
          <div className="flex flex-col h-full">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="flex space-x-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={message.userPicture || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gray-700 text-white text-xs">
                        {message.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-white truncate">{message.userName}</span>
                        <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                      </div>
                      <div
                        className={`text-sm mt-1 ${
                          message.type === "level_up"
                            ? "text-yellow-400 font-medium"
                            : message.type === "achievement"
                              ? "text-green-400 font-medium"
                              : "text-gray-300"
                        }`}
                      >
                        {message.type === "level_up" && "🎉 "}
                        {message.type === "achievement" && "🏆 "}
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="bg-gray-800 border-gray-600 text-white text-sm"
                />
                <Button onClick={sendMessage} size="sm" className="bg-blue-600 hover:bg-blue-700 px-3">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full p-4">
            <div className="space-y-3">
              {leaderboardUsers.map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    user.id === currentUser.id
                      ? "bg-blue-900/30 border border-blue-600"
                      : "bg-gray-800 hover:bg-gray-750"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm font-bold ${
                        index === 0
                          ? "text-yellow-400"
                          : index === 1
                            ? "text-gray-300"
                            : index === 2
                              ? "text-orange-400"
                              : "text-gray-400"
                      }`}
                    >
                      {index === 0 ? <Crown className="w-4 h-4" /> : `#${index + 1}`}
                    </span>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.picture || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gray-700 text-white text-xs">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white truncate">
                        {user.name}
                        {user.id === currentUser.id && " (You)"}
                      </span>
                      {user.isOnline && <div className="w-2 h-2 bg-green-400 rounded-full" />}
                    </div>
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-gray-400">L{user.level}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-gray-400">{user.xp}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-gray-400">{user.streak}d</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
