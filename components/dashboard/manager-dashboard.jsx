"use client"

import { useState, useEffect } from "react"
import TicketsView from "@/components/tickets/tickets-view"
import NewTicketForm from "@/components/tickets/new-ticket-form"
import ReportsView from "@/components/reports/reports-view"
import Statistics from "@/components/stats/statistics"
import Swal from 'sweetalert2'

export default function ManagerDashboard({ currentSection }) {
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    async function loadData() {
        try {
            const { ticketsAPI } = await import("@/lib/api")
            
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
        
        await Swal.fire({
          title: 'Éxito',
          text: 'Incidencia creada correctamente',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        })
    } catch (error) {
        console.error("Error creating ticket:", error)
        await Swal.fire({
          title: 'Error',
          text: 'No se pudo crear la incidencia',
          icon: 'error',
          confirmButtonColor: '#2563eb'
        })
    }
  }

  return (
    <div className="space-y-6">
      {currentSection === "tickets" && (
        <TicketsView 
          tickets={tickets} 
          isAdmin={false}
          isGerente={true}
        />
      )}

      {currentSection === "nueva-incidencia" && <NewTicketForm onSubmit={handleNewTicket} isAdmin={false} />}

      {currentSection === "reportes" && <ReportsView tickets={tickets} isAdmin={false} />}

      {currentSection === "estadisticas" && <Statistics tickets={tickets} />}
    </div>
  )
}
