"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function UserProfile({ user }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    new_password: "",
    confirm_password: ""
  })
  const [message, setMessage] = useState({ type: "", text: "" })
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setMessage({ type: "", text: "" })
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden" })
      return
    }
    
    if (passwordData.new_password.length < 6) {
      setMessage({ type: "error", text: "La contraseña debe tener al menos 6 caracteres" })
      return
    }
    
    setLoading(true)
    
    try {
      const token = sessionStorage.getItem('authToken')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/change_password.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          new_password: passwordData.new_password
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage({ type: "success", text: "Contraseña actualizada correctamente" })
        setPasswordData({ new_password: "", confirm_password: "" })
        setTimeout(() => {
          setShowPasswordForm(false)
          setMessage({ type: "", text: "" })
        }, 2000)
      } else {
        setMessage({ type: "error", text: data.error || "Error al cambiar la contraseña" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error de conexión" })
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white">
        <h3 className="text-lg sm:text-2xl font-semibold px-6 py-4">Mi Perfil</h3>
      </div>

      <div className="p-6">
        <div className="max-w-md">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nombre Completo</p>
              <p className="font-semibold text-foreground">{user?.full_name || user?.name || "—"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-semibold text-foreground">{user?.email}</p>
            </div>

            {user?.cargo && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cargo</p>
                <p className="font-semibold text-foreground">{user.cargo}</p>
              </div>
            )}

            {user?.branch_name && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sucursal</p>
                <p className="font-semibold text-foreground">{user.branch_name}</p>
              </div>
            )}

            {user?.area_name && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Área</p>
                <p className="font-semibold text-foreground">{user.area_name}</p>
              </div>
            )}
          </div>

          {/* Sección de cambio de contraseña */}
          <div className="mt-8 pt-6 border-t border-border">
            <Button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              variant="outline"
              className="mb-4"
            >
              {showPasswordForm ? "Cancelar" : "Cambiar Contraseña"}
            </Button>

            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="space-y-4 bg-secondary/30 p-4 rounded-lg">
                {message.text && (
                  <div className={`px-4 py-3 rounded-md text-sm ${
                    message.type === "success" 
                      ? "bg-green-100 text-green-800 border border-green-200" 
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}>
                    {message.text}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Nueva Contraseña *
                  </label>
                  <input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Mínimo 6 caracteres</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Confirmar Nueva Contraseña *
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {loading ? "Actualizando..." : "Actualizar Contraseña"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
