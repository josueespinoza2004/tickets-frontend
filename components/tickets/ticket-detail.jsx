"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

export default function TicketDetail({ ticket, onBack, onUpdate, isAdmin }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTicket, setEditedTicket] = useState(ticket)

  const handleStatusChange = (newStatus) => {
    setEditedTicket({ ...editedTicket, status: newStatus })
  }

  const handleSave = () => {
    onUpdate(editedTicket)
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white flex flex-row items-center justify-between px-6 py-4">
        <div>
          <h3 className="text-lg sm:text-2xl font-semibold">Incidencia #{ticket.id}</h3>
          <p className="text-blue-100 text-sm sm:text-base">{ticket.name}</p>
        </div>
        <Button onClick={onBack} variant="outline" className="bg-white text-primary hover:bg-white/90 text-sm sm:text-base">
          ← Volver
        </Button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Información básica */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Información Básica</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">{ticket.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sucursal</p>
                <p className="font-medium">{ticket.sucursal}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha Creación</p>
                <p className="font-medium">
                  {new Date(ticket.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Incidencia</p>
                <p className={`font-medium ${priorityColors[ticket.priority]}`}>{ticket.priority}</p>
              </div>
            </div>
          </div>

          {/* Estado y responsable */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Estado y Control</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Estado Actual</p>
                {isEditing && isAdmin ? (
                  <select
                    value={editedTicket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-input mt-1"
                  >
                    <option value="Sin Empezar">Sin Empezar</option>
                    <option value="En curso">En curso</option>
                    <option value="Listo">Listo</option>
                  </select>
                ) : (
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[ticket.status]}`}
                  >
                    {ticket.status}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Responsable</p>
                {isEditing && isAdmin ? (
                  <input
                    type="text"
                    value={editedTicket.responsible}
                    onChange={(e) => setEditedTicket({ ...editedTicket, responsible: e.target.value })}
                    placeholder="Nombre del responsable"
                    className="w-full px-3 py-2 border border-input rounded-md bg-input mt-1"
                  />
                ) : (
                  <p className="font-medium">{editedTicket.responsible || "No asignado"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-6 p-4 bg-secondary/30 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">Descripción</h3>
          <p className="text-foreground whitespace-pre-wrap">{ticket.description}</p>
        </div>

        {/* Botones de acción */}
        {isAdmin && (
          <div className="flex gap-3 pt-4 border-t border-border">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Editar Incidencia
              </Button>
            ) : (
              <>
                <Button onClick={handleSave} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Guardar Cambios
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false)
                    setEditedTicket(ticket)
                  }}
                  variant="outline"
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
