"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { fetchApi } from "@/lib/api"

export default function NewTicketForm({ onSubmit, isAdmin, user }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "Baja", // Default to 'Baja' explicitly
    branch_id: user?.branch_id || "", 
    area_id: "", 
    incident_date: new Date().toISOString().split('T')[0], // Default to today
    evidence_file: null
  })

  const [submitted, setSubmitted] = useState(false)

  // State for dynamic branches
  const [sucursales, setSucursales] = useState([])
  const [areas, setAreas] = useState([])
  const [loadingBranches, setLoadingBranches] = useState(true)
  const [loadingAreas, setLoadingAreas] = useState(true)

  // Fetch branches and areas
  useEffect(() => {
    async function loadData() {
      try {
        const [branchesData, areasData] = await Promise.all([
            fetchApi('/api/get_branches.php'),
            fetchApi('/api/get_areas.php')
        ])
        
        if (Array.isArray(branchesData)) {
          setSucursales(branchesData)
          if (branchesData.length > 0) {
            // If user has a branch, set it. Otherwise default to first one.
            if (user?.branch_id) {
               setFormData(prev => ({ ...prev, branch_id: user.branch_id }))
            } else {
               setFormData(prev => ({ ...prev, branch_id: branchesData[0].id }))
            }
          }
        }
        
        if (Array.isArray(areasData)) {
            setAreas(areasData)
            if (areasData.length > 0) {
              setFormData(prev => ({ ...prev, area_id: areasData[0].id }))
            }
        }

      } catch (error) {
        console.error("Error loading form data:", error)
      } finally {
        setLoadingBranches(false)
        setLoadingAreas(false)
      }
    }
    loadData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name.trim()) {
      
      const data = new FormData()
      data.append('title', formData.name)
      // If description is empty, send a default text to satisfy DB NOT NULL
      data.append('description', formData.description.trim() || "Sin descripción proporcionada")
      data.append('priority', formData.priority)
      if (formData.branch_id) data.append('branch_id', formData.branch_id)
      if (formData.area_id) data.append('area_id', formData.area_id)
      if (formData.incident_date) data.append('incident_date', formData.incident_date)
      if (formData.evidence_file) data.append('evidence_file', formData.evidence_file)

      onSubmit(data)
      
      setFormData({
        name: "",
        description: "",
        priority: "Baja",
        branch_id: user?.branch_id || (sucursales.length > 0 ? sucursales[0].id : ""),
        area_id: areas.length > 0 ? areas[0].id : "",
        incident_date: new Date().toISOString().split('T')[0],
        evidence_file: null
      })
      // Reset file input manually if needed using ref, but simply clearing state ok for now
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Descripción (Opcional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el problema en detalle..."
              rows="4"    
              className="w-full px-3 py-2 border border-input rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
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

          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Tipo de Incidencia</label>
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Sucursal</label>
            <select
              name="branch_id"
              value={formData.branch_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {loadingBranches ? (
                <option>Cargando sucursales...</option>
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
              className="w-full px-3 py-2 border border-input rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2"
          >
            {isAdmin ? "Crear Incidencia" : "Reportar Problema"}
          </Button>
        </form>
      </div>
    </div>
  )
}
