"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { fetchApi } from "@/lib/api"

export default function NewTicketForm({ onSubmit, isAdmin }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "Media",
    sucursal: "", // Default empty, wait for load
  })

  const [submitted, setSubmitted] = useState(false)

  // State for dynamic branches
  const [sucursales, setSucursales] = useState([])
  const [loadingBranches, setLoadingBranches] = useState(true)

  // Fetch branches on mount
  useEffect(() => {
    async function loadBranches() {
      try {
        const data = await fetchApi('get_branches.php')
        if (Array.isArray(data)) {
          setSucursales(data)
          // Set default selected branch if available
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, sucursal: data[0].id }))
          }
        }
      } catch (error) {
        console.error("Error loading branches:", error)
      } finally {
        setLoadingBranches(false)
      }
    }
    loadBranches()
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
    if (formData.name.trim() && formData.description.trim()) {
      onSubmit(formData)
      setFormData({
        name: "",
        description: "",
        priority: "Media",
        sucursal: "Nueva Guinea",
      })
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
            <label className="block text-sm font-medium text-foreground mb-1">Descripción *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el problema en detalle..."
              rows="4"
              className="w-full px-3 py-2 border border-input rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Sucursal</label>
            <select
              name="sucursal"
              value={formData.sucursal}
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
