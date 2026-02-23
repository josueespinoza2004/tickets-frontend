"use client"

import { useState, useEffect } from "react"
import TicketsView from "@/components/tickets/tickets-view"
import NewTicketForm from "@/components/tickets/new-ticket-form"
import UsersManagement from "@/components/users/users-management"
import ReportsView from "@/components/reports/reports-view"
import Statistics from "@/components/stats/statistics"
import Swal from 'sweetalert2'

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

  const handleUpdateTicket = async (updatedTicket) => {
    try {
        const { ticketsAPI } = await import("@/lib/api")
        await ticketsAPI.update(updatedTicket.id, updatedTicket)
        
        // Recargar desde el servidor para tener datos actualizados
        const data = await ticketsAPI.getAll()
        setTickets(data)
        
        await Swal.fire({
          title: 'Actualizado',
          text: 'Incidencia actualizada correctamente',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        })
    } catch (error) {
        console.error("Error updating ticket:", error)
        await Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar la incidencia',
          icon: 'error',
          confirmButtonColor: '#2563eb'
        })
    }
  }

  const handleDeleteTicket = async (ticketId) => {
    try {
        const { ticketsAPI } = await import("@/lib/api")
        await ticketsAPI.delete(ticketId)
        
        // Recargar tickets después de eliminar
        const data = await ticketsAPI.getAll()
        setTickets(data)
    } catch (error) {
        console.error("Error deleting ticket:", error)
        await Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la incidencia',
          icon: 'error',
          confirmButtonColor: '#2563eb'
        })
    }
  }

  const handleAddUser = async (newUser) => {
    try {
        const { usersAPI } = await import("@/lib/api")
        await usersAPI.create(newUser)
        
        // Recargar la lista completa desde el servidor para obtener todos los datos
        const usersData = await usersAPI.getAll()
        if (Array.isArray(usersData)) {
            setUsers(usersData)
        }
        
        await Swal.fire({
          title: 'Éxito',
          text: 'Usuario creado correctamente',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        })
    } catch (error) {
        console.error("Error creating user:", error)
        await Swal.fire({
          title: 'Error',
          text: error.message || 'No se pudo crear el usuario',
          icon: 'error',
          confirmButtonColor: '#2563eb'
        })
    }
  }

  const handleUpdateUser = async (id, updatedUser) => {
    try {
        const { usersAPI } = await import("@/lib/api")
        await usersAPI.update(id, updatedUser)
        
        // Recargar la lista completa desde el servidor para obtener datos actualizados
        const usersData = await usersAPI.getAll()
        if (Array.isArray(usersData)) {
            setUsers(usersData)
        }
        
        await Swal.fire({
          title: 'Actualizado',
          text: 'Usuario actualizado correctamente',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        })
    } catch (error) {
        console.error("Error updating user:", error)
        await Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el usuario',
          icon: 'error',
          confirmButtonColor: '#2563eb'
        })
    }
  }

  const handleDeleteUser = async (id) => {
    try {
        const { usersAPI } = await import("@/lib/api")
        await usersAPI.delete(id)
        
        // Recargar la lista completa desde el servidor
        const usersData = await usersAPI.getAll()
        if (Array.isArray(usersData)) {
            setUsers(usersData)
        }
    } catch (error) {
        console.error("Error deleting user:", error)
        await Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el usuario',
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
          isAdmin={true} 
          onUpdateTicket={handleUpdateTicket}
          onDeleteTicket={handleDeleteTicket}
        />
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
