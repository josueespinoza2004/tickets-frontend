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
            // Cargar usuarios
            const { usersAPI } = await import("@/lib/api")
            const usersData = await usersAPI.getAll()
            if (Array.isArray(usersData)) {
                setUsers(usersData)
            }
        } catch (error) {
            console.error("Error loading users:", error)
        }
    }
    loadData()

    // Tickets siguen en sessionStorage por ahora hasta que implementemos ticketsAPI fully
    const storedTickets = JSON.parse(sessionStorage.getItem("tickets")) || []
    setTickets(storedTickets)
  }, [])

  const handleNewTicket = (newTicket) => {
    // ... (mantener lógica de tickets por ahora o actualizar si create_ticket ya se usa)
    // El usuario pidió Auth y Users primero. Tickets se hará después.
    const storedTickets = JSON.parse(sessionStorage.getItem("tickets")) || []
    const ticket = {
      ...newTicket,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: "Sin Empezar",
      responsible: "",
    }
    storedTickets.push(ticket)
    sessionStorage.setItem("tickets", JSON.stringify(storedTickets))
    setTickets([...tickets, ticket])
  }

  const handleUpdateTicket = (updatedTicket) => {
    const storedTickets = JSON.parse(sessionStorage.getItem("tickets")) || []
    const index = storedTickets.findIndex((t) => t.id === updatedTicket.id)
    if (index !== -1) {
      storedTickets[index] = updatedTicket
      sessionStorage.setItem("tickets", JSON.stringify(storedTickets))
      setTickets(storedTickets)
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
