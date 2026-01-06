"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Statistics({ tickets }) {
  const stats = useMemo(() => {
    const total = tickets.length
    const byStatus = {
      "Sin Empezar": tickets.filter((t) => t.status === "Sin Empezar").length,
      "En curso": tickets.filter((t) => t.status === "En curso").length,
      Listo: tickets.filter((t) => t.status === "Listo").length,
    }

    const byPriority = {
      Alta: tickets.filter((t) => t.priority === "Alta").length,
      Media: tickets.filter((t) => t.priority === "Media").length,
      Baja: tickets.filter((t) => t.priority === "Baja").length,
    }

    const bySucursal = {}
    tickets.forEach((t) => {
      bySucursal[t.sucursal] = (bySucursal[t.sucursal] || 0) + 1
    })

    return { total, byStatus, byPriority, bySucursal }
  }, [tickets])

  const StatCard = ({ label, value, color }) => (
    <Card className="bg-gradient-to-br from-white to-secondary/20">
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Cards principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total de Incidencias" value={stats.total} color="text-primary" />
        <StatCard label="Sin Empezar" value={stats.byStatus["Sin Empezar"]} color="text-gray-600" />
        <StatCard label="En Curso" value={stats.byStatus["En curso"]} color="text-blue-600" />
        <StatCard label="Completadas" value={stats.byStatus["Listo"]} color="text-accent" />
      </div>

      {/* Gráficos de estado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white">
            <h3 className="text-lg sm:text-xl font-semibold px-6 py-4">Incidencias por Tipo</h3>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {Object.entries(stats.byPriority).map(([priority, count]) => (
                <div key={priority}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-foreground">{priority}</span>
                    <span className="font-bold text-primary">{count}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        priority === "Alta" ? "bg-destructive" : priority === "Media" ? "bg-yellow-500" : "bg-accent"
                      }`}
                      style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="bg-gradient-to-r from-secondary to-blue-300">
            <h3 className="text-lg sm:text-xl font-semibold px-6 py-4">Incidencias por Sucursal</h3>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {Object.entries(stats.bySucursal).map(([sucursal, count]) => (
                <div key={sucursal}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-foreground">{sucursal}</span>
                    <span className="font-bold text-primary">{count}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500 transition-all"
                      style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de resumen */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-blue-600 text-white">
          <h3 className="text-lg sm:text-xl font-semibold px-6 py-4">Resumen General</h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Tasa de Completación</p>
              <p className="text-2xl font-bold text-accent">
                {stats.total > 0 ? Math.round((stats.byStatus["Listo"] / stats.total) * 100) : 0}%
              </p>
            </div>

            <div className="p-4 bg-secondary/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Incidencias Urgentes</p>
              <p className="text-2xl font-bold text-destructive">{stats.byPriority["Alta"]}</p>
            </div>

            <div className="p-4 bg-secondary/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">En Progreso</p>
              <p className="text-2xl font-bold text-blue-600">{stats.byStatus["En curso"]}</p>
            </div>

            <div className="p-4 bg-secondary/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Pendientes</p>
              <p className="text-2xl font-bold text-gray-600">{stats.byStatus["Sin Empezar"]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
