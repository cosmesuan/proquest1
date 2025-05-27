"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button-enhanced"
import { Input } from "@/components/ui/input"
import { User, Mail, Lock, Gamepad2, ArrowRight } from "lucide-react"
import { initializeGoogleAuth, signInWithGoogle, type GoogleUser } from "../lib/google-auth"

interface AuthFormProps {
  onLogin: (userData: any) => void
}

export default function AuthForm({ onLogin }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    initializeGoogleAuth().catch(console.error)
  }, [])

  const handleLogin = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = JSON.parse(localStorage.getItem("proquest-users") || "{}")
    const user = users[loginEmail]

    if (user && user.password === loginPassword) {
      onLogin(user)
    } else {
      alert("Invalid credentials!")
    }
    setLoading(false)
  }

  const handleSignup = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = JSON.parse(localStorage.getItem("proquest-users") || "{}")

    if (users[signupEmail]) {
      alert("User already exists!")
      setLoading(false)
      return
    }

    const newUser = {
      id: Date.now().toString(),
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      xp: 0,
      level: 1,
      streak: 0,
      tasksCompletedToday: 0,
      tasks: [],
      achievements: [
        { id: "first-task", unlocked: false },
        { id: "streak-3", unlocked: false },
        { id: "tasks-10", unlocked: false },
        { id: "level-5", unlocked: false },
        { id: "level-5", unlocked: false },
      ],
      gamesWon: 0,
      joinedDate: new Date().toISOString(),
    }

    users[signupEmail] = newUser
    localStorage.setItem("proquest-users", JSON.stringify(users))
    onLogin(newUser)
    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      // Try to initialize Google Auth first
      await initializeGoogleAuth()

      // Use the mock Google Sign-In for demo purposes
      const googleUser: GoogleUser = await signInWithGoogle()

      const users = JSON.parse(localStorage.getItem("proquest-users") || "{}")
      let user = users[googleUser.email]

      if (!user) {
        // Create new user from Google profile
        user = {
          id: googleUser.id,
          name: googleUser.name,
          email: googleUser.email,
          picture: googleUser.picture,
          xp: 0,
          level: 1,
          streak: 0,
          tasksCompletedToday: 0,
          tasks: [],
          achievements: [
            { id: "first-task", unlocked: false },
            { id: "streak-3", unlocked: false },
            { id: "tasks-10", unlocked: false },
            { id: "level-5", unlocked: false },
          ],
          gamesWon: 0,
          joinedDate: new Date().toISOString(),
        }
        users[googleUser.email] = user
        localStorage.setItem("proquest-users", JSON.stringify(users))
      } else {
        // Update existing user with Google profile info
        user.picture = googleUser.picture
        users[googleUser.email] = user
        localStorage.setItem("proquest-users", JSON.stringify(users))
      }

      onLogin(user)
    } catch (error) {
      console.error("Google Sign-In failed:", error)

      // Provide a more user-friendly error message
      if (error.message?.includes("FedCM") || error.message?.includes("identity-credentials-get")) {
        alert(
          "Google Sign-In is not available in this environment. Please use email/password authentication or try in a different browser.",
        )
      } else {
        alert("Google Sign-In is currently unavailable. Please use email/password authentication.")
      }
    }
    setGoogleLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm space-y-6 sm:space-y-8">
        {/* Logo & Branding */}
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="flex justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center">
              <Gamepad2 className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">ProQuest</h1>
            <p className="text-gray-400 text-sm">Level up through productivity</p>
          </div>
        </div>

        {/* Google Sign In */}
        <Button
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full h-12 bg-white text-black hover:bg-gray-100 rounded-xl font-medium text-base flex items-center justify-center space-x-3"
        >
          {googleLoading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-gray-400">Or continue with email</span>
          </div>
        </div>

        {/* Auth Toggle */}
        <div className="flex bg-gray-900 rounded-xl p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 sm:py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              isLogin ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 sm:py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              !isLogin ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Form */}
        <div className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Full name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="pl-12 h-12 sm:h-12 bg-gray-900 border-gray-800 text-white placeholder-gray-500 rounded-xl focus:border-gray-600 text-base"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="email"
              placeholder="Email address"
              value={isLogin ? loginEmail : signupEmail}
              onChange={(e) => (isLogin ? setLoginEmail(e.target.value) : setSignupEmail(e.target.value))}
              className="pl-12 h-12 sm:h-12 bg-gray-900 border-gray-800 text-white placeholder-gray-500 rounded-xl focus:border-gray-600 text-base"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="password"
              placeholder="Password"
              value={isLogin ? loginPassword : signupPassword}
              onChange={(e) => (isLogin ? setLoginPassword(e.target.value) : setSignupPassword(e.target.value))}
              className="pl-12 h-12 sm:h-12 bg-gray-900 border-gray-800 text-white placeholder-gray-500 rounded-xl focus:border-gray-600 text-base"
              onKeyDown={(e) => e.key === "Enter" && (isLogin ? handleLogin() : handleSignup())}
            />
          </div>

          <Button
            onClick={isLogin ? handleLogin : handleSignup}
            disabled={
              loading || (isLogin ? !loginEmail || !loginPassword : !signupName || !signupEmail || !signupPassword)
            }
            className="w-full h-12 sm:h-12 bg-white text-black hover:bg-gray-100 rounded-xl font-medium text-base flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? "Sign In" : "Create Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
