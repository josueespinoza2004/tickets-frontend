"use client"

import { useState } from "react"
import Sidebar from "@/components/dashboard/sidebar"
import UserDashboard from "@/components/dashboard/user-dashboard"
import AdminDashboard from "@/components/dashboard/admin-dashboard"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Dashboard({ user, onLogout }) {
  const [currentSection, setCurrentSection] = useState("tickets")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isAdmin = user?.role === "admin"

  return (
    <div className="flex h-screen bg-background">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:transform-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          user={user}
          currentSection={currentSection}
          onSectionChange={(section) => {
            setCurrentSection(section)
            setSidebarOpen(false) // Cerrar sidebar en móvil al seleccionar
          }}
          onLogout={onLogout}
          isAdmin={isAdmin}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <div className="bg-white border-b border-border h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Botón hamburguesa para móvil */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-primary">
                {isAdmin ? "Panel de Administrador" : "Panel de Usuario"}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block">
              <span className="text-sm text-muted-foreground">{user?.name || user?.email}</span>
            </div>
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                isAdmin ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"
              }`}
            >
              {isAdmin ? "Admin" : "Usuario"}
            </span>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10 bg-transparent text-xs sm:text-sm px-2 sm:px-4"
            >
              <span className="hidden sm:inline">Cerrar Sesión</span>
              <span className="sm:hidden">Salir</span>
            </Button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
          {isAdmin ? (
            <AdminDashboard currentSection={currentSection} />
          ) : (
            <UserDashboard currentSection={currentSection} />
          )}
        </div>
      </div>
    </div>
  )
}
