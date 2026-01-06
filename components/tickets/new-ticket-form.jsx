"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function NewTicketForm({ onSubmit, isAdmin }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "Media",
    sucursal: "Nueva Guinea",
  })

  const [submitted, setSubmitted] = useState(false)

  const sucursales = ["Nueva Guinea", "San Carlos", "Muelle de los Bueyes", "El Rama"]

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
    <Card>
      <CardHeader className="bg-gradient-to-r from-accent to-green-600 text-white">
        <CardTitle>{isAdmin ? "Crear Nueva Incidencia" : "Reportar Incidencia"}</CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
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
              {sucursales.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2"
          >
            {isAdmin ? "Crear Incidencia" : "Reportar Problema"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
