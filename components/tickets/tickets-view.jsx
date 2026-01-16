"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TicketDetail from "@/components/tickets/ticket-detail"

const statusColors = {
  "Sin Empezar": "bg-gray-100 text-gray-800",
  "En curso": "bg-blue-100 text-blue-800",
  Listo: "bg-green-100 text-green-800",
}

const priorityColors = {
  Alta: "text-destructive",
  Media: "text-yellow-600",
  Baja: "text-green-600",
}

export default function TicketsView({ tickets, isAdmin, onUpdateTicket }) {
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [filteredTickets, setFilteredTickets] = useState(tickets)
  const [statusFilter, setStatusFilter] = useState("todos")
  const [priorityFilter, setPriorityFilter] = useState("todos")
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    let filtered = tickets

    if (statusFilter !== "todos") {
      filtered = filtered.filter((t) => t.status === statusFilter)
    }

    if (priorityFilter !== "todos") {
      filtered = filtered.filter((t) => t.priority === priorityFilter)
    }

    setFilteredTickets(filtered)
    setCurrentPage(1) // Reset to page 1 on filter change
  }, [tickets, statusFilter, priorityFilter])

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  if (selectedTicket) {
    return (
      <TicketDetail
        ticket={selectedTicket}
        onBack={() => setSelectedTicket(null)}
        onUpdate={onUpdateTicket}
        isAdmin={isAdmin}
      />
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white">
        <h3 className="text-lg sm:text-2xl font-semibold px-6 py-4">{isAdmin ? "Todas las Incidencias" : "Mis Incidencias"}</h3>
      </div>

      <div className="p-6">
        {/* Filtros */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Filtrar por Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="todos">Todos los estados</option>
              <option value="Sin Empezar">Sin Empezar</option>
              <option value="En curso">En curso</option>
              <option value="Listo">Listo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Filtrar por Prioridad</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="todos">Todas las prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
        </div>

        {/* Lista de tickets */}
        <div className="space-y-2">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {tickets.length === 0 ? "No hay incidencias aún" : "No hay incidencias que coincidan con los filtros"}
            </div>
          ) : (
            currentTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="p-3 border border-border rounded-lg hover:bg-secondary/50 cursor-pointer transition"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground">{ticket.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{ticket.description}</p>
                  </div>
                  <span className={`ml-4 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex gap-3">
                    <span className={`font-semibold ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                    <span className="text-muted-foreground">{ticket.branch_name}</span>
                    <span className="text-muted-foreground">
                      {(() => {
                        const dateVal = ticket.incident_date || ticket.created_at || ticket.createdAt;
                        const safeDate = (typeof dateVal === 'string' && dateVal.length === 10) 
                          ? dateVal + 'T00:00:00' 
                          : dateVal;
                        
                        return dateVal ? new Date(safeDate).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short", 
                          day: "numeric",
                        }) : "Fecha desconocida";
                      })()}
                    </span>
                  </div>
                  <span className="text-primary font-medium">#{ticket.id}</span>
                </div>
              </div>
            ))
          )}
        </div>

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
  )
}
