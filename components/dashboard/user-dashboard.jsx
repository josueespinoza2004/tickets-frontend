"use client"

import { useState, useEffect } from "react"
import TicketsView from "@/components/tickets/tickets-view"
import NewTicketForm from "@/components/tickets/new-ticket-form"
import ReportsView from "@/components/reports/reports-view"
import UserProfile from "@/components/profile/user-profile"

export default function UserDashboard({ currentSection }) {
  const [tickets, setTickets] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"))
    setUser(storedUser)

    const storedTickets = JSON.parse(localStorage.getItem("tickets")) || []
    const userTickets = storedTickets.filter((t) => t.userId === storedUser?.id)
    setTickets(userTickets)
  }, [])

  const handleNewTicket = (newTicket) => {
    const storedTickets = JSON.parse(localStorage.getItem("tickets")) || []
    const ticket = {
      ...newTicket,
      id: Date.now(),
      userId: user?.id,
      createdAt: new Date().toISOString(),
      status: "Sin Empezar",
      responsible: "",
    }
    storedTickets.push(ticket)
    localStorage.setItem("tickets", JSON.stringify(storedTickets))
    setTickets([...tickets, ticket])
  }

  if (!user) return <div className="text-center py-8">Cargando...</div>

  return (
    <div className="space-y-4 sm:space-y-6">
      {currentSection === "tickets" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 order-2 xl:order-1">
            <TicketsView tickets={tickets} isAdmin={false} />
          </div>
          <div className="order-1 xl:order-2">
            <NewTicketForm onSubmit={handleNewTicket} />
          </div>
        </div>
      )}

      {currentSection === "reportes" && <ReportsView tickets={tickets} isAdmin={false} />}
      {currentSection === "perfil" && <UserProfile user={user} />}
    </div>
  )
}
