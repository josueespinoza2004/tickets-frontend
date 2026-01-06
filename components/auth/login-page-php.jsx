"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // URL base de tu API PHP (cambiar por tu dominio)
  const API_BASE = '/api'

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE}/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Guardar usuario y token
        localStorage.setItem("currentUser", JSON.stringify(data.user))
        localStorage.setItem("authToken", data.user.token)
        onLoginSuccess(data.user)
      } else {
        setError(data.error || 'Error al iniciar sesión')
      }
    } catch (error) {
      console.error('Error de conexión:', error)
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-lg shadow-lg mx-auto mb-4 flex items-center justify-center">
            <div className="text-3xl font-bold text-primary">C</div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">COOPEFACSA</h1>
          <p className="text-blue-100">Sistema de Gestión de Tickets - IT</p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          </CardHeader>

          <CardContent className="pt-8">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@coopefacsa.com"
                  className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-md font-semibold transition"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}