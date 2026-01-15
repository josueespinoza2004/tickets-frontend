"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchApi } from "@/lib/api"

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
  const [admins, setAdmins] = useState([])
  const [sucursales, setSucursales] = useState([])

  const loadDependencies = async () => {
      try {
          // Load users (admins)
          const users = await fetchApi('/api/users.php')
          if (Array.isArray(users)) {
              setAdmins(users.filter(u => u.role === 'admin'))
          }
          // Load branches
          const branches = await fetchApi('/api/get_branches.php')
          if (Array.isArray(branches)) {
              setSucursales(branches)
          }
      } catch (e) {
          console.error("Error loading dependencies", e)
      }
  }

  const handleEditClick = () => {
      setIsEditing(true)
      loadDependencies()
  }

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
          <p className="text-blue-100 text-sm sm:text-base">{ticket.title}</p>
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
                {isEditing && isAdmin ? (
                  <input
                    type="text"
                    value={editedTicket.title || ""}
                    onChange={(e) => setEditedTicket({ ...editedTicket, title: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md bg-input mt-1"
                  />
                ) : (
                  <p className="font-medium">{ticket.title}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sucursal</p>
                {isEditing && isAdmin ? (
                  <select
                    value={editedTicket.branch_id || ""}
                    onChange={(e) => setEditedTicket({ ...editedTicket, branch_id: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md bg-input mt-1"
                  >
                     <option value="">Seleccionar Sucursal</option>
                     {sucursales.map(branch => (
                         <option key={branch.id} value={branch.id}>{branch.name}</option>
                     ))}
                  </select>
                ) : (
                 <p className="font-medium">{ticket.branch_name}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha</p>
                {isEditing && isAdmin ? (
                   <input
                    type="date"
                    value={editedTicket.incident_date ? editedTicket.incident_date.substring(0, 10) : ""}
                    onChange={(e) => setEditedTicket({ ...editedTicket, incident_date: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md bg-input mt-1"
                  />
                ) : (
                <p className="font-medium">
                  {(() => {
                    const dateVal = ticket.incident_date || ticket.created_at || ticket.createdAt;
                    const safeDate = (typeof dateVal === 'string' && dateVal.length === 10) 
                      ? dateVal + 'T00:00:00' 
                      : dateVal;
                      
                    return new Date(safeDate).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  })()}
                </p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Incidencia</p>
                {isEditing && isAdmin ? (
                  <select
                    value={editedTicket.priority || "Baja"}
                    onChange={(e) => setEditedTicket({ ...editedTicket, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md bg-input mt-1"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                ) : (
                    <p className={`font-medium ${priorityColors[ticket.priority]}`}>{ticket.priority}</p>
                )}
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
                  <div className="border border-input rounded-md bg-input mt-1 p-2 space-y-2 max-h-48 overflow-y-auto">
                    {admins.map((admin) => {
                      const currentIds = editedTicket.assigned_to ? String(editedTicket.assigned_to).split(',') : [];
                      const isChecked = currentIds.includes(String(admin.id));
                      
                      return (
                        <label 
                          key={admin.id} 
                          className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${isChecked ? 'bg-green-100 dark:bg-green-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        >
                          <input
                            type="checkbox"
                            value={admin.id}
                            checked={isChecked}
                            onChange={(e) => {
                              const value = String(e.target.value);
                              const newIds = e.target.checked
                                ? [...currentIds, value]
                                : currentIds.filter(id => id !== value);
                              
                              setEditedTicket({ ...editedTicket, assigned_to: newIds.join(',') });
                            }}
                            className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                          />
                          <span className="text-sm font-medium">{admin.full_name || admin.email}</span>
                        </label>
                      );
                    })}
                    {admins.length === 0 && <p className="text-sm text-muted-foreground p-2">No hay administradores disponibles.</p>}
                  </div>
                ) : (
                  <p className="font-medium">{ticket.assigned_to_name || "No asignado"}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Descripción */}
        <div className="mb-6 p-4 bg-secondary/30 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">Descripción</h3>
          {isEditing && isAdmin ? (
             <textarea
                value={editedTicket.description || ""}
                onChange={(e) => setEditedTicket({ ...editedTicket, description: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-input min-h-[100px]"
             />
          ) : (
            <p className="text-foreground whitespace-pre-wrap">{ticket.description}</p>
          )}
        </div>

        {/* Evidencia */}
        {ticket.evidence_file && (
            <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-2">Evidencia Adjunta</h3>
                <div className="relative aspect-video max-w-md bg-gray-100 rounded-lg overflow-hidden border border-border">
                    <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}/${ticket.evidence_file}`} 
                        alt="Evidencia" 
                        className="object-contain w-full h-full"
                    />
                </div>
            </div>
        )}

        {/* Botones de acción */}
        {isAdmin && (
          <div className="flex gap-3 pt-4 border-t border-border">
            {!isEditing ? (
              <Button
                onClick={handleEditClick}
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
