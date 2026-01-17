"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { fetchApi } from "@/lib/api"

export default function NewTicketForm({ onSubmit, isAdmin, user }) {
  // State for dynamic branches, areas, and users
  const [sucursales, setSucursales] = useState([])
  const [areas, setAreas] = useState([])
  const [usersList, setUsersList] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false) // Restored missing state

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "Baja",
    status: "Listo", // Requested default
    assigned_to: [], // Array of user IDs
    branch_id: user?.branch_id || "", 
    area_id: "", 
    incident_date: new Date().toISOString().split('T')[0],
    evidence_file: null
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [branchesData, areasData, usersData] = await Promise.all([
            fetchApi('/api/get_branches.php'),
            fetchApi('/api/get_areas.php'),
            fetchApi('/api/users.php')
        ])
        
        if (Array.isArray(branchesData)) {
          setSucursales(branchesData)
          if (branchesData.length > 0 && !user?.branch_id) {
             setFormData(prev => ({ ...prev, branch_id: branchesData[0].id }))
          }
        }
        
        if (Array.isArray(areasData)) {
            setAreas(areasData)
            if (areasData.length > 0) {
              setFormData(prev => ({ ...prev, area_id: areasData[0].id }))
            }
        }

        if (Array.isArray(usersData)) {
            setUsersList(usersData)
        }

      } catch (error) {
        console.error("Error loading form data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (userId) => {
    setFormData(prev => {
        const current = prev.assigned_to 
        if (current.includes(userId)) {
            return { ...prev, assigned_to: current.filter(id => id !== userId) }
        } else {
            return { ...prev, assigned_to: [...current, userId] }
        }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name.trim()) {
      
      const data = new FormData()
      data.append('title', formData.name)
      data.append('description', formData.description.trim() || "Sin descripción proporcionada")
      data.append('priority', formData.priority)
      data.append('status', formData.status)
      if (formData.branch_id) data.append('branch_id', formData.branch_id)
      if (formData.area_id) data.append('area_id', formData.area_id)
      if (formData.incident_date) data.append('incident_date', formData.incident_date)
      if (formData.evidence_file) data.append('evidence_file', formData.evidence_file)
      
      // Append assigned_to as array entries
      formData.assigned_to.forEach(id => {
          data.append('assigned_to[]', id)
      })

      onSubmit(data)
      
      setFormData(prev => ({
        ...prev,
        name: "",
        description: "",
        priority: "Baja",
        status: "Listo", // Reset to default
        assigned_to: [],
        incident_date: new Date().toISOString().split('T')[0],
        evidence_file: null
      }))
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="bg-gradient-to-r from-accent to-green-600 text-white">
        <h3 className="text-lg sm:text-xl font-semibold px-6 py-4">{isAdmin ? "Crear Nueva Incidencia" : "Reportar Incidencia"}</h3>
      </div>

      <div className="p-6">
        {submitted && (
          <div className="bg-accent/10 border border-accent text-accent px-4 py-3 rounded-md mb-4 text-sm">
            ✓ Incidencia creada exitosamente
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Row 1: Name and Priority (if Admin) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nombre de la Incidencia *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Problema con la impresora"
                className="w-full px-3 py-2 border border-input rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {isAdmin && (
              <div>
                 <label className="block text-sm font-medium text-foreground mb-1">Prioridad</label>
                 <select
                   name="priority"
                   value={formData.priority}
                   onChange={handleChange}
                   className="w-full px-3 py-2 border border-input rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                 >
                   <option value="Baja">Baja</option>
                   <option value="Media">Media</option>
                   <option value="Alta">Alta</option>
                 </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Descripción (Opcional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el problema en detalle..."
              rows="3"    
              className="w-full px-3 py-2 border border-input rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Row 2: Status and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Estado</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Sin Empezar">Sin Empezar</option>
                  <option value="En curso">En curso</option>
                  <option value="Listo">Listo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Fecha de la Incidencia</label>
                <input
                  type="date"
                  name="incident_date"
                  value={formData.incident_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
          </div>
          
          {/* Row 3: Branch and Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Sucursal</label>
                <select
                  name="branch_id"
                  value={formData.branch_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {loading ? (
                    <option>Cargando...</option>
                  ) : (
                    sucursales.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Evidencia (Foto/Archivo)</label>
                <input
                  type="file"
                  name="evidence_file"
                  onChange={(e) => setFormData(prev => ({ ...prev, evidence_file: e.target.files[0] }))}
                  className="w-full px-3 py-2 border border-input rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary h-[42px] file:mt-0"
                />
              </div>
          </div>

          {/* Responsibles (Checkboxes) */}
          {isAdmin && (
            <div>
               <label className="block text-sm font-medium text-foreground mb-2">Responsables a resolver</label>
               <div className="bg-input border border-input rounded-md p-3 max-h-40 overflow-y-auto grid grid-cols-1 gap-2">
                  {loading ? (
                       <span className="text-sm text-muted-foreground">Cargando usuarios...</span>
                  ) : (
                      usersList.filter(u => u.role === 'admin').map((u) => (
                          <label key={u.id} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                              <input 
                                  type="checkbox" 
                                  checked={formData.assigned_to.includes(u.id)}
                                  onChange={() => handleCheckboxChange(u.id)}
                                  className="rounded border-gray-300 text-primary focus:ring-primary" 
                              />
                              <span>{u.name}</span>
                          </label>
                      ))
                  )}
               </div>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              className="w-full sm:w-auto px-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2"
            >
              {isAdmin ? "Crear Incidencia" : "Reportar Problema"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
