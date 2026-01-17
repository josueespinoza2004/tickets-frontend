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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const sucursales = ["Nueva Guinea", "San Carlos", "Muelle de los Bueyes", "El Rama"]

  const applyFilters = () => {
    let filtered = [...tickets] // Create a copy

    if (startDate) {
      filtered = filtered.filter((t) => {
        const dateVal = t.incident_date || t.created_at || t.createdAt
        if (!dateVal) return false
        return dateVal.substring(0, 10) >= startDate
      })
    }

    if (endDate) {
      filtered = filtered.filter((t) => {
        const dateVal = t.incident_date || t.created_at || t.createdAt
        if (!dateVal) return false
        return dateVal.substring(0, 10) <= endDate
      })
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

    // Sort by incident_date desc (Newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.incident_date || a.created_at || a.createdAt)
      const dateB = new Date(b.incident_date || b.created_at || b.createdAt)
      return dateB - dateA // Descending
    })

    setFilteredTickets(filtered)
    setCurrentPage(1) // Reset to page 1 on filter change
  }

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  useEffect(() => {
    applyFilters()
  }, [startDate, endDate, statusFilter, priorityFilter, sucursalFilter, tickets])

  const handleExportExcel = async () => {
    try {
      const ExcelJS = (await import("exceljs")).default
      const { saveAs } = (await import("file-saver"))

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet("Reporte de Incidencias")

      // Title and Logo Header
      
      // Title and Logo Header
      
      // Title and Logo Header using a single merged block as requested
      
      // Merge A1:G4 (4 rows high)
      worksheet.mergeCells("A1:G4")
      const headerCell = worksheet.getCell("A1")
      headerCell.value = "REPORTE DE INCIDENCIAS - COOPEFACSA R.L."
      headerCell.font = { name: "Arial", size: 20, bold: true }
      // Align center implies the text is in the middle
      // To prevent text overlapping the logo (if logo is left), we might want 'center' or 'right'?, 
      // but user said "centradas". So we keep it centered.
      headerCell.alignment = { vertical: "middle", horizontal: "center" }

      try {
        const response = await fetch("/coopefacsa.png")
        const buffer = await response.arrayBuffer()
        const logoId = workbook.addImage({
          buffer: buffer,
          extension: "png",
        })

        // Place Logo inside the merged block, closer to text and better aspect ratio
        worksheet.addImage(logoId, {
          tl: { col: 1.1, row: 0.4 }, 
          ext: { width: 100, height: 60 },
        })
      } catch (error) {
        console.error("Error loading logo:", error)
      }

      // User explicitly requested to REMOVE the "Generado" / Date rows.
      // And also requested to remove empty spacer rows.
      // So we go straight to table headers.

      // Table Headers (No ID)
      const headers = [
        "Nombre de tarea",
        "Estado",
        "Responsable",
        "Fecha",
        "Tipo",
        "Sucursal",
        "Descripción",
      ]
      
      const headerRow = worksheet.addRow(headers)
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } }
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF2563EB" }, // Primary Blue
        }
        cell.alignment = { vertical: "middle", horizontal: "center" }
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        }
      })

      // Data Rows
      filteredTickets.forEach((ticket) => {
        const dateVal = ticket.incident_date || ticket.created_at || ticket.createdAt
        const safeDate = (typeof dateVal === 'string' && dateVal.length === 10) 
                         ? dateVal + 'T00:00:00' 
                         : dateVal
        const displayDate = dateVal ? new Date(safeDate).toLocaleDateString("es-ES") : "—"

        const row = worksheet.addRow([
          ticket.title,
          ticket.status,
          ticket.assigned_to_name || "—",
          displayDate,
          ticket.priority,
          ticket.branch_name,
          ticket.description,
        ])

        // Style data cells
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          }
          cell.alignment = { vertical: "middle", wrapText: true }

          // Estado Column (Column 2)
          if (colNumber === 2) {
            let argbFill = "FFFFFFFF" // White default
            let argbFont = "FF000000" // Black default
            
            if (ticket.status === "Listo") {
              argbFill = "FFDCFCE7" // Green 100
              argbFont = "FF166534" // Green 800
            } else if (ticket.status === "En curso") {
              argbFill = "FFDBEAFE" // Blue 100
              argbFont = "FF1E40AF" // Blue 800
            } else {
              // Sin Empezar or others
              argbFill = "FFF3F4F6" // Gray 100
              argbFont = "FF1F2937" // Gray 800
            }
            
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: argbFill } }
            cell.font = { color: { argb: argbFont }, bold: true }
          }
          
          // Tipo/Priority Column (Column 5)
          else if (colNumber === 5) {
            let argbFill = "FFFFFFFF"
            let argbFont = "FF000000"
            
            if (ticket.priority === "Alta") {
              argbFill = "FFFEE2E2" // Red 100
              argbFont = "FF991B1B" // Red 800
            } else if (ticket.priority === "Media") {
              argbFill = "FFFEF9C3" // Yellow 100
              argbFont = "FF854D0E" // Yellow 800
            } else {
               // Baja
              argbFill = "FFDCFCE7" // Green 100
              argbFont = "FF166534" // Green 800
            }

            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: argbFill } }
            cell.font = { color: { argb: argbFont }, bold: true }
          }
        })
      })

      // Adjust column widths
      worksheet.getColumn(1).width = 50  // Nombre de tarea (Increased)
      worksheet.getColumn(2).width = 15  // Estado
      worksheet.getColumn(3).width = 35  // Responsable (Increased for single line)
      worksheet.getColumn(4).width = 15  // Fecha
      worksheet.getColumn(5).width = 15  // Tipo
      worksheet.getColumn(6).width = 20  // Sucursal
      worksheet.getColumn(7).width = 100 // Descripción (Increased significantly)

      // Generate Buffer and Save
      const buffer = await workbook.xlsx.writeBuffer()
      const fileName = `reporte_incidencias_${new Date().toISOString().split("T")[0]}.xlsx`
      saveAs(new Blob([buffer], { type: "application/octet-stream" }), fileName)

    } catch (error) {
      console.error("Error generating Excel:", error)
      alert("Hubo un error al generar el reporte en Excel.")
    }
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

            {isAdmin && (
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
            )}
          </div>

          <div className="mt-4">
            <Button
              onClick={handleExportExcel}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              📊 Descargar Excel
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
                {currentTickets.map((ticket) => (
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
            
            {filteredTickets.length > 0 && (
              <div className="flex flex-col items-center gap-4 mt-6">
                  <div className="flex justify-center flex-wrap gap-2">
                      <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                          Anterior
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-1 text-sm border rounded ${
                                  currentPage === page ? "bg-primary text-white" : "hover:bg-gray-100"
                              }`}
                          >
                              {page}
                          </button>
                      ))}
                      <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                          Siguiente
                      </button>
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                      Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredTickets.length)} de {filteredTickets.length} incidencias
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
