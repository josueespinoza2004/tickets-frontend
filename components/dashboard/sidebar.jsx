"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Sidebar({ user, currentSection, onSectionChange, onLogout, isAdmin, isGerente, onClose }) {
  const userMenuItems = [
    { id: "tickets", label: "Mis Incidencias", icon: "🎫" },
    { id: "reportes", label: "Reportes", icon: "📊" },
    { id: "perfil", label: "Mi Perfil", icon: "👤" },
  ]

  const adminMenuItems = [
    { id: "tickets", label: "Todas las Incidencias", icon: "🎫" },
    { id: "nueva-incidencia", label: "Nueva Incidencia", icon: "➕" },
    { id: "usuarios", label: "Gestión de Usuarios", icon: "👥" },
    { id: "reportes", label: "Reportes Avanzados", icon: "📊" },
    { id: "estadisticas", label: "Estadísticas", icon: "📈" },
  ]

  const gerenteMenuItems = [
    { id: "tickets", label: "Todas las Incidencias", icon: "🎫" },
    { id: "nueva-incidencia", label: "Nueva Incidencia", icon: "➕" },
    { id: "reportes", label: "Reportes Avanzados", icon: "📊" },
    { id: "estadisticas", label: "Estadísticas", icon: "📈" },
  ]

  const menuItems = isAdmin ? adminMenuItems : isGerente ? gerenteMenuItems : userMenuItems

  return (
    <div className="w-64 bg-primary text-primary-foreground shadow-md flex flex-col h-full">
      {/* Header con botón cerrar para móvil */}
      <div className="p-4 sm:p-6 border-b border-primary-foreground/15">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center p-1">
              <img
                src="./coopefacsa.png"
                alt="COOPEFACSA"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-bold text-sm">Gestion de Tickets y Incidencias</h1>
              <p className="text-xs opacity-70">COOPEFACSA R.L</p>
            </div>
          </div>
          {/* Botón cerrar solo visible en móvil */}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-primary-foreground hover:bg-primary-foreground/10 p-1"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Menú */}
      <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition text-sm sm:text-base ${
              currentSection === item.id ? "bg-primary-foreground/15 font-semibold" : "hover:bg-primary-foreground/10"
            }`}
          >
            <span className="mr-2 sm:mr-3 text-base sm:text-lg">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Usuario */}
      <div className="p-3 sm:p-4 border-t border-primary-foreground/15">
        <div className="bg-primary-foreground/10 rounded-lg p-2.5 sm:p-3 mb-2 sm:mb-3">
          <p className="text-xs opacity-70">Conectado como</p>
          <p className="font-semibold text-xs sm:text-sm truncate">{user?.full_name}</p>
          <p className="text-xs opacity-70 mt-1">
            {isAdmin ? "Administrador" : isGerente ? "Gerente" : "Usuario"}
          </p>
        </div>
        
        {/* Botón logout para móvil */}
        <Button
          onClick={onLogout}
          variant="ghost"
          size="sm"
          className="w-full lg:hidden text-primary-foreground hover:bg-primary-foreground/10 text-xs"
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
