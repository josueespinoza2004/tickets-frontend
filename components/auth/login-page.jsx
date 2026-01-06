"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Usuarios de demostración
  const defaultUsers = [
    { id: 1, email: "admin@coopefacsa.com", password: "admin123", role: "admin", name: "Administrador" },
    { id: 2, email: "user@coopefacsa.com", password: "user123", role: "user", name: "Juan Pérez" },
  ]

  const handleLogin = (e) => {
    e.preventDefault()
    setError("")

    const user = defaultUsers.find((u) => u.email === email && u.password === password)

    if (user) {
      const { password, ...userWithoutPassword } = user
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
      localStorage.setItem("allUsers", JSON.stringify(defaultUsers))
      onLoginSuccess(userWithoutPassword)
    } else {
      setError("Email o contraseña incorrectos")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Logo y contenido principal */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 relative">
              <img
                src="./coopefacsa.png"
                alt="COOPEFACSA Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Gestión de Tickets</h1>
            <p className="text-xs sm:text-sm text-gray-600 px-2">Cooperativa COOPEFACSA R.L</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-md text-xs sm:text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.nombre@coopefacsa.coop.ni"
                className="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 sm:mb-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <a href="#" className="text-xs text-blue-600 hover:text-blue-800">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 sm:py-3 rounded-md font-medium transition-colors text-sm sm:text-base"
            >
              Iniciar Sesión
            </Button>
          </form>

          {/* Demo info */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              <span className="block sm:inline">Demo: admin@coopefacsa.com / admin123</span>
              <span className="hidden sm:inline"> o </span>
              <span className="block sm:inline">user@coopefacsa.com / user123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
