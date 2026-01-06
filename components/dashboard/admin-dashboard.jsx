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
    const storedTickets = JSON.parse(localStorage.getItem("tickets")) || []
    setTickets(storedTickets)

    const storedUsers = JSON.parse(localStorage.getItem("allUsers")) || []
    setUsers(storedUsers)
  }, [])

  const handleNewTicket = (newTicket) => {
    const storedTickets = JSON.parse(localStorage.getItem("tickets")) || []
    const ticket = {
      ...newTicket,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: "Sin Empezar",
      responsible: "",
    }
    storedTickets.push(ticket)
    localStorage.setItem("tickets", JSON.stringify(storedTickets))
    setTickets([...tickets, ticket])
  }

  const handleUpdateTicket = (updatedTicket) => {
    const storedTickets = JSON.parse(localStorage.getItem("tickets")) || []
    const index = storedTickets.findIndex((t) => t.id === updatedTicket.id)
    if (index !== -1) {
      storedTickets[index] = updatedTicket
      localStorage.setItem("tickets", JSON.stringify(storedTickets))
      setTickets(storedTickets)
    }
  }

  const handleAddUser = (newUser) => {
    const storedUsers = JSON.parse(localStorage.getItem("allUsers")) || []
    const user = {
      ...newUser,
      id: Math.max(...storedUsers.map((u) => u.id), 0) + 1,
    }
    storedUsers.push(user)
    localStorage.setItem("allUsers", JSON.stringify(storedUsers))
    setUsers([...users, user])
  }

  return (
    <div className="space-y-6">
      {currentSection === "tickets" && (
        <TicketsView tickets={tickets} isAdmin={true} onUpdateTicket={handleUpdateTicket} />
      )}

      {currentSection === "nueva-incidencia" && <NewTicketForm onSubmit={handleNewTicket} isAdmin={true} />}

      {currentSection === "usuarios" && <UsersManagement users={users} onAddUser={handleAddUser} />}

      {currentSection === "reportes" && <ReportsView tickets={tickets} isAdmin={true} />}

      {currentSection === "estadisticas" && <Statistics tickets={tickets} />}
    </div>
  )
}
