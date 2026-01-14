"use client"

import { useState, useEffect } from "react"
import LoginPage from "@/components/auth/login-page"
import Dashboard from "@/components/dashboard/dashboard"

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar usuario desde sessionStorage
    const storedUser = sessionStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-secondary">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-foreground border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage onLoginSuccess={setUser} />
  }

  return (
    <Dashboard
      user={user}
      onLogout={async () => {
        const { authAPI } = await import("@/lib/api")
        await authAPI.logout()
        setUser(null)
      }}
    />
  )
}
