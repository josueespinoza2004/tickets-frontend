"use client"

import { useState, useEffect } from "react"
import TicketsView from "@/components/tickets/tickets-view"
import NewTicketForm from "@/components/tickets/new-ticket-form"
import UsersManagement from "@/components/users/users-management"
import ReportsView from "@/components/reports/reports-view"
import Statistics from "@/components/stats/statistics"

export default function AdminDashboard({ currentSection }) {
  const [tickets, setTickets] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    async function loadData() {
        try {
            const { usersAPI, ticketsAPI } = await import("@/lib/api")
            
            // Cargar usuarios
            const usersData = await usersAPI.getAll()
            if (Array.isArray(usersData)) {
                setUsers(usersData)
            }

            // Cargar tickets
            const ticketsData = await ticketsAPI.getAll()
            if (Array.isArray(ticketsData)) {
                setTickets(ticketsData)
            }
        } catch (error) {
            console.error("Error loading data:", error)
        }
    }
    loadData()
  }, [])

  const handleNewTicket = async (newTicketData) => {
    try {
        const { ticketsAPI } = await import("@/lib/api")
        await ticketsAPI.create(newTicketData)
        
        // Recargar tickets
        const data = await ticketsAPI.getAll()
        setTickets(data)
    } catch (error) {
        console.error("Error creating ticket:", error)
        alert("Error al crear ticket")
    }
  }

  const handleUpdateTicket = async (updatedTicket) => {
    try {
        const { ticketsAPI } = await import("@/lib/api")
        await ticketsAPI.update(updatedTicket.id, updatedTicket)
        
        // Update local state optimistic or refetch
        setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t))
    } catch (error) {
        console.error("Error updating ticket:", error)
        alert("Error al actualizar ticket")
    }
  }

  const handleAddUser = async (newUser) => {
    try {
        const { usersAPI } = await import("@/lib/api")
        const response = await usersAPI.create(newUser)
        if (response && response.id) {
            // Refetch or append locally
            setUsers(prev => [...prev, { ...newUser, id: response.id }])
        }
    } catch (error) {
        console.error("Error creating user:", error)
        alert("Error al crear usuario: " + error.message)
    }
  }

  const handleUpdateUser = async (id, updatedUser) => {
    try {
        const { usersAPI } = await import("@/lib/api")
        await usersAPI.update(id, updatedUser)
        // Update local state
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedUser } : u))
    } catch (error) {
        console.error("Error updating user:", error)
        alert("Error al actualizar usuario")
    }
  }

  const handleDeleteUser = async (id) => {
    try {
        const { usersAPI } = await import("@/lib/api")
        await usersAPI.delete(id)
        // Update local state
        setUsers(prev => prev.filter(u => u.id !== id))
    } catch (error) {
        console.error("Error deleting user:", error)
        alert("Error al eliminar usuario")
    }
  }

  return (
    <div className="space-y-6">
      {currentSection === "tickets" && (
        <TicketsView tickets={tickets} isAdmin={true} onUpdateTicket={handleUpdateTicket} />
      )}

      {currentSection === "nueva-incidencia" && <NewTicketForm onSubmit={handleNewTicket} isAdmin={true} />}

      {currentSection === "usuarios" && (
        <UsersManagement 
            users={users} 
            onAddUser={handleAddUser} 
            onUpdateUser={handleUpdateUser} 
            onDeleteUser={handleDeleteUser} 
        />
      )}

      {currentSection === "reportes" && <ReportsView tickets={tickets} isAdmin={true} />}

      {currentSection === "estadisticas" && <Statistics tickets={tickets} />}
    </div>
  )
}
