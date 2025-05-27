"use client"

declare global {
  interface Window {
    google: any
    googleSignInCallback: (response: any) => void
  }
}

export interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
  given_name: string
  family_name: string
}

export const initializeGoogleAuth = () => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is undefined"))
      return
    }

    // Check if Google Identity Services script is already loaded
    if (window.google?.accounts?.id) {
      resolve()
      return
    }

    // Load Google Identity Services script
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => {
      try {
        if (window.google?.accounts?.id) {
          // Initialize with a more permissive configuration
          window.google.accounts.id.initialize({
            client_id: "demo-client-id", // Using demo for development
            callback: window.googleSignInCallback,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false, // Disable FedCM to avoid the error
          })
          resolve()
        } else {
          reject(new Error("Google Identity Services failed to load"))
        }
      } catch (error) {
        console.warn("Google Sign-In initialization failed:", error)
        reject(error)
      }
    }
    script.onerror = () => {
      reject(new Error("Failed to load Google Identity Services script"))
    }
    document.head.appendChild(script)
  })
}

export const signInWithGoogle = (): Promise<GoogleUser> => {
  return new Promise((resolve, reject) => {
    // For demo purposes, simulate Google Sign-In with mock data
    // In production, replace this with actual Google OAuth flow

    const mockGoogleUser: GoogleUser = {
      id: `google_${Date.now()}`,
      email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
      name: `Google User ${Math.floor(Math.random() * 100)}`,
      picture: `https://ui-avatars.com/api/?name=Google+User&background=4285f4&color=fff&size=128`,
      given_name: "Google",
      family_name: "User",
    }

    // Simulate network delay
    setTimeout(() => {
      resolve(mockGoogleUser)
    }, 1000)
  })
}

export const renderGoogleSignInButton = (elementId: string) => {
  // For demo purposes, we'll handle this in the component
  console.log("Google Sign-In button would be rendered for element:", elementId)
}

// Alternative implementation for production use
export const signInWithGooglePopup = (): Promise<GoogleUser> => {
  return new Promise((resolve, reject) => {
    // This would be the actual implementation for production
    // using Google OAuth 2.0 popup flow

    const clientId = "YOUR_ACTUAL_GOOGLE_CLIENT_ID"
    const redirectUri = window.location.origin
    const scope = "openid email profile"

    const authUrl =
      `https://accounts.google.com/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=code&` +
      `access_type=offline`

    // For now, we'll use the mock implementation
    // In production, you would open a popup window to authUrl
    // and handle the OAuth callback

    reject(new Error("Production Google OAuth not configured. Using mock data instead."))
  })
}
