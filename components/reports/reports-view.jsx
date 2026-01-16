"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ReportsView({ tickets, isAdmin }) {
  const [filteredTickets, setFilteredTickets] = useState(tickets)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [priorityFilter, setPriorityFilter] = useState("todos")
  const [sucursalFilter, setSucursalFilter] = useState("todos")

  const sucursales = ["Nueva Guinea", "San Carlos", "Muelle de los Bueyes", "El Rama"]

  const applyFilters = () => {
    let filtered = tickets

    if (startDate) {
      filtered = filtered.filter((t) => new Date(t.createdAt) >= new Date(startDate))
    }

    if (endDate) {
      const endDateTime = new Date(endDate)
      endDateTime.setHours(23, 59, 59)
      filtered = filtered.filter((t) => new Date(t.createdAt) <= endDateTime)
    }

    if (statusFilter !== "todos") {
      filtered = filtered.filter((t) => t.status === statusFilter)
    }

    if (priorityFilter !== "todos") {
      filtered = filtered.filter((t) => t.priority === priorityFilter)
    }

    if (sucursalFilter !== "todos") {
      filtered = filtered.filter((t) => t.sucursal === sucursalFilter)
    }

    setFilteredTickets(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [startDate, endDate, statusFilter, priorityFilter, sucursalFilter, tickets])

  const handleExportPDF = () => {
    let content = "REPORTE DE INCIDENCIAS - COOPEFACSA\n"
    content += `Generado: ${new Date().toLocaleDateString("es-ES")}\n\n`

    if (startDate || endDate) {
      content += `Período: ${startDate || "Inicio"} a ${endDate || "Hoy"}\n\n`
    }

    content += "DETALLE DE INCIDENCIAS:\n"
    content += "─".repeat(120) + "\n"

    filteredTickets.forEach((ticket) => {
      content += `ID: ${ticket.id} | Nombre: ${ticket.name}\n`
      content += `Estado: ${ticket.status} | Tipo: ${ticket.priority} | Sucursal: ${ticket.sucursal}\n`
      content += `Responsable: ${ticket.responsible || "No asignado"}\n`
      content += `Fecha: ${new Date(ticket.createdAt).toLocaleDateString("es-ES")}\n`
      content += `Descripción: ${ticket.description}\n`
      content += "─".repeat(120) + "\n"
    })

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content))
    element.setAttribute("download", `reporte_incidencias_${new Date().toISOString().split("T")[0]}.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-blue-600 text-white">
          <h3 className="text-lg sm:text-xl font-semibold px-6 py-4">Filtros de Búsqueda</h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Desde</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Hasta</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-input"
              >
                <option value="todos">Todos</option>
                <option value="Sin Empezar">Sin Empezar</option>
                <option value="En curso">En curso</option>
                <option value="Listo">Listo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Tipo</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-input"
              >
                <option value="todos">Todos</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Sucursal</label>
              <select
                value={sucursalFilter}
                onChange={(e) => setSucursalFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-input"
              >
                <option value="todos">Todas</option>
                {sucursales.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <Button
              onClick={handleExportPDF}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              📥 Descargar Reporte
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla de resultados */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="bg-gradient-to-r from-secondary to-blue-300">
          <h3 className="text-lg sm:text-xl font-semibold px-6 py-4">Resultados ({filteredTickets.length} incidencias)</h3>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">ID</th>
                  <th className="px-4 py-2 text-left font-semibold">Nombre de tarea</th>
                  <th className="px-4 py-2 text-left font-semibold">Estado</th>
                  <th className="px-4 py-2 text-left font-semibold">Responsable</th>
                  <th className="px-4 py-2 text-left font-semibold">Fecha</th>
                  <th className="px-4 py-2 text-left font-semibold">Tipo</th>
                  <th className="px-4 py-2 text-left font-semibold">Sucursal</th>
                  <th className="px-4 py-2 text-left font-semibold">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-border hover:bg-secondary/30">
                    <td className="px-4 py-2">#{ticket.id}</td>
                    <td className="px-4 py-2 font-medium">{ticket.title}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          ticket.status === "Listo"
                            ? "bg-green-100 text-green-800"
                            : ticket.status === "En curso"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs">{ticket.assigned_to_name || "—"}</td>
                    <td className="px-4 py-2 text-xs whitespace-nowrap">
                      {(() => {
                        const dateVal = ticket.incident_date || ticket.created_at || ticket.createdAt;
                        const safeDate = (typeof dateVal === 'string' && dateVal.length === 10) 
                          ? dateVal + 'T00:00:00' 
                          : dateVal;
                        
                        return dateVal ? new Date(safeDate).toLocaleDateString("es-ES") : "—";
                      })()}
                    </td>
                    <td className="px-4 py-2">
                       <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold sentence-case ${
                          ticket.priority === "Alta"
                            ? "bg-red-100 text-red-800"
                            : ticket.priority === "Media"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[10px]">
                            {ticket.branch_name}
                        </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground max-w-xs truncate" title={ticket.description}>
                        {ticket.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTickets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No hay incidencias que coincidan con los filtros aplicados
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
