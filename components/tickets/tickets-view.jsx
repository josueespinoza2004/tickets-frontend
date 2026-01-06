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

  useEffect(() => {
    let filtered = tickets

    if (statusFilter !== "todos") {
      filtered = filtered.filter((t) => t.status === statusFilter)
    }

    if (priorityFilter !== "todos") {
      filtered = filtered.filter((t) => t.priority === priorityFilter)
    }

    setFilteredTickets(filtered)
  }, [tickets, statusFilter, priorityFilter])

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
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {tickets.length === 0 ? "No hay incidencias aún" : "No hay incidencias que coincidan con los filtros"}
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="p-4 border border-border rounded-lg hover:bg-secondary/50 cursor-pointer transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{ticket.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                  </div>
                  <span className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex gap-4">
                    <span className={`font-semibold ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                    <span className="text-muted-foreground">{ticket.sucursal}</span>
                    <span className="text-muted-foreground">
                      {new Date(ticket.createdAt).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                  <span className="text-primary font-medium">#{ticket.id}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredTickets.length > 0 && (
          <div className="text-xs text-muted-foreground text-center mt-4">
            Mostrando {filteredTickets.length} de {tickets.length} incidencias
          </div>
        )}
      </div>
    </div>
  )
}
