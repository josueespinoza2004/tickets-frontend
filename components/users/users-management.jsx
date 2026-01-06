"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const roles = ["admin", "user"]

export default function UsersManagement({ users, onAddUser }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formData.name.trim() && formData.email.trim() && formData.password.trim()) {
      onAddUser(formData)
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
      })
      setShowForm(false)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Botón para agregar usuario */}
      {!showForm && (
        <div className="mb-4">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            ➕ Agregar Nuevo Usuario
          </Button>
        </div>
      )}

      {/* Formulario de nuevo usuario */}
      {showForm && (
        <Card className="bg-secondary/30 border-primary">
          <CardHeader className="bg-primary text-white">
            <CardTitle>Crear Nuevo Usuario</CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            {submitted && (
              <div className="bg-accent/10 border border-accent text-accent px-4 py-3 rounded-md mb-4 text-sm">
                ✓ Usuario creado exitosamente
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    className="w-full px-3 py-2 border border-input rounded-md bg-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="juan@coopefacsa.com"
                    className="w-full px-3 py-2 border border-input rounded-md bg-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Contraseña *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-input rounded-md bg-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Rol</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-input"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  Crear Usuario
                </Button>
                <Button type="button" onClick={() => setShowForm(false)} variant="outline">
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de usuarios */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white">
          <CardTitle>Usuarios del Sistema</CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-3">
            {users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No hay usuarios registrados</div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="p-4 border border-border rounded-lg flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin" ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"
                      }`}
                    >
                      {user.role === "admin" ? "Administrador" : "Usuario"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {users.length > 0 && (
            <div className="text-xs text-muted-foreground text-center mt-4">Total: {users.length} usuarios</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
