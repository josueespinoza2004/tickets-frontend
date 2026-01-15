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
    async function loadData() {
        const storedUser = JSON.parse(sessionStorage.getItem("currentUser"))
        setUser(storedUser)

        if (storedUser) {
            try {
                const { ticketsAPI } = await import("@/lib/api")
                const data = await ticketsAPI.getAll()
                // API fetches filtered tickets for non-admins automatically, so we trust backend or filter if needed?
                // Backend "api/tickets.php" logic: "if (!$isAdmin) ... WHERE creator_id = userId"
                // So getAll() returns only user's tickets.
                if (Array.isArray(data)) {
                    setTickets(data)
                }
            } catch (e) {
                console.error("Error loading tickets", e)
            }
        }
    }
    loadData()
  }, [])

  const handleNewTicket = async (newTicketData) => {
    try {
        const { ticketsAPI } = await import("@/lib/api")
        // newTicketData is FormData
        await ticketsAPI.create(newTicketData)
        
        // Reload list
        const data = await ticketsAPI.getAll()
        setTickets(data)
    } catch (error) {
        console.error("Error creating ticket:", error)
        alert("Error al crear ticket")
    }
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
            <NewTicketForm onSubmit={handleNewTicket} user={user} isAdmin={false} />
          </div>
        </div>
      )}

      {currentSection === "reportes" && <ReportsView tickets={tickets} isAdmin={false} />}
      {currentSection === "perfil" && <UserProfile user={user} />}
    </div>
  )
}
