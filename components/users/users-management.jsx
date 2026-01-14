"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, X, Check } from "lucide-react"

const roles = ["admin", "user"]

export default function UsersManagement(props) {
  const { users, onAddUser, onUpdateUser, onDeleteUser } = props
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    branch_id: "",
    area_id: "",
    cargo: ""
  })
  const [submitted, setSubmitted] = useState(false)
  
  // Estados para sucursales
  const [sucursales, setSucursales] = useState([])
  const [loadingBranches, setLoadingBranches] = useState(true)

  // Cargar sucursales al abrir el formulario
  const loadBranches = async () => {
    // Si ya cargamos, no recargar
    if (sucursales.length > 0) return

    try {
        setLoadingBranches(true)
        const { fetchApi } = await import("@/lib/api")
        const data = await fetchApi('/api/get_branches.php')
        if (Array.isArray(data)) {
            setSucursales(data)
        }
    } catch (e) {
        console.error("Error cargando sucursales para usuarios", e)
    } finally {
        setLoadingBranches(false)
    }
  }

  // Estados para areas
  const [areas, setAreas] = useState([])
  const [loadingAreas, setLoadingAreas] = useState(true)

  const loadAreas = async () => {
    if (areas.length > 0) return
    try {
        setLoadingAreas(true)
        const { fetchApi } = await import("@/lib/api")
        const data = await fetchApi('/api/get_areas.php')
        if (Array.isArray(data)) {
            setAreas(data)
        }
    } catch (e) {
        console.error("Error cargando areas", e)
    } finally {
        setLoadingAreas(false)
    }
  }

  // Al mostrar form, cargar sucursales
  const handleShowForm = () => {
    setShowForm(true)
    loadBranches()
    loadAreas()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Estados para edición
  const [editingUser, setEditingUser] = useState(null)

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
        name: user.name || user.full_name,
        email: user.email,
        password: "", // No llenar password al editar para no sobrescribir sin querer
        role: user.role,
        branch_id: user.branch_id || "",
        area_id: user.area_id || "",
        cargo: user.cargo || ""
    })
    setShowForm(true)
    loadBranches()
  }

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
        // Asumimos que onAddUser maneja creación, necesitamos onDeleteUser y onUpdateUser props
        // Pero como UsersManagement recibe "onAddUser", quizás debamos pedir más props o usar una prop genérica.
        // Por compatibilidad con AdminDashboard, usaremos props nuevas que añadiremos.
        if (props.onDeleteUser) props.onDeleteUser(id)
    }
  }

  // Wrapper para el submit que diferencia crear vs editar
  const handleSubmitWrapper = (e) => {
    e.preventDefault()

    const userPayload = {
      full_name: formData.name,
      email: formData.email,
      role: formData.role,
      branch_id: formData.branch_id,
      area_id: formData.area_id,
      cargo: formData.cargo
    }
    
    // Solo enviar password se si escribió algo (en edición) o siempre (en creación)
    if (formData.password.trim()) {
        userPayload.password = formData.password
    }

    if (editingUser) {
        if (props.onUpdateUser) {
            props.onUpdateUser(editingUser.id, userPayload)
        }
    } else {
        if (!formData.password.trim()) {
            alert("La contraseña es obligatoria para nuevos usuarios")
            return
        }
        props.onAddUser(userPayload)
    }
    
    // Reset
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
      branch_id: "",
      area_id: "",
      cargo: ""
    })
    setEditingUser(null)
    setShowForm(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  // Necesitamos acceder a props dentro del componente, así que ajustaré la definición de la función
  return (
    <div className="space-y-6">
      {/* Botón para agregar usuario */}
      {!showForm && (
        <div className="mb-4">
          <Button
            onClick={() => {
                setEditingUser(null)
                setFormData({ name: "", email: "", password: "", role: "user", branch_id: "", area_id: "", cargo: "" })
                handleShowForm()
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Agregar Nuevo Usuario
          </Button>
        </div>
      )}

      {/* Formulario de nuevo/editar usuario */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden bg-secondary/30 border-primary">
          <div className="bg-primary text-white flex justify-between items-center px-6 py-4">
            <h3 className="text-lg font-semibold">
                {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
            </h3>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="text-white hover:bg-white/20">
                <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmitWrapper} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
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
                    className="w-full px-3 py-2 border border-input rounded-md bg-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {editingUser ? "Contraseña (dejar en blanco para no cambiar)" : "Contraseña *"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-input"
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

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Sucursal</label>
                    <select
                    name="branch_id"
                    value={formData.branch_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-input"
                    >
                    <option value="">-- Seleccionar --</option>
                    {loadingBranches ? (
                        <option>Cargando...</option>
                    ): (
                        sucursales.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))
                    )}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Área</label>
                    <select
                    name="area_id"
                    value={formData.area_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-input"
                    >
                    <option value="">-- Seleccionar --</option>
                    {loadingAreas ? (
                        <option>Cargando...</option>
                    ): (
                        areas.map(a => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                        ))
                    )}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Cargo</label>
                    <input
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-input"
                    />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  {editingUser ? "Guardar Cambios" : "Crear Usuario"}
                </Button>
                <Button type="button" onClick={() => setShowForm(false)} variant="outline">
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de usuarios */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-blue-600 text-white">
          <h3 className="text-lg sm:text-xl font-semibold px-6 py-4">Usuarios del Sistema</h3>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No hay usuarios registrados</div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="p-4 border border-border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{user.name || user.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="text-xs text-gray-500 mt-1">
                        {user.branch_name ? `Sucursal: ${user.branch_name}` : ''}
                        {user.area_name ? ` • Área: ${user.area_name}` : ''} 
                        {user.cargo ? ` • ${user.cargo}` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold mr-2 ${
                        user.role === "admin" ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>
                    
                    <Button 
                        size="sm" 
                        onClick={() => handleEdit(user)} 
                        className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm"
                    >
                        <Pencil className="h-3.5 w-3.5 mr-1" /> Editar
                    </Button>
                    <Button 
                        size="sm" 
                        onClick={() => handleDelete(user.id)} 
                        className="bg-red-600 hover:bg-red-700 text-white border-none shadow-sm"
                    >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Eliminar
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {users.length > 0 && (
            <div className="text-xs text-muted-foreground text-center mt-4">Total: {users.length} usuarios</div>
          )}
        </div>
      </div>
    </div>
  )
}
