"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'

export default function Statistics({ tickets }) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [filteredTickets, setFilteredTickets] = useState(tickets)

  useEffect(() => {
    let filtered = [...tickets]

    if (startDate) {
      filtered = filtered.filter((t) => {
        const dateVal = t.incident_date || t.created_at || t.createdAt
        if (!dateVal) return false
        return dateVal.substring(0, 10) >= startDate
      })
    }

    if (endDate) {
      filtered = filtered.filter((t) => {
        const dateVal = t.incident_date || t.created_at || t.createdAt
        if (!dateVal) return false
        return dateVal.substring(0, 10) <= endDate
      })
    }

    setFilteredTickets(filtered)
  }, [startDate, endDate, tickets])

  const stats = useMemo(() => {
    const total = filteredTickets.length
    const byStatus = {
      "Sin Empezar": filteredTickets.filter((t) => t.status === "Sin Empezar").length,
      "En curso": filteredTickets.filter((t) => t.status === "En curso").length,
      Listo: filteredTickets.filter((t) => t.status === "Listo").length,
    }

    const byPriority = {
      Alta: filteredTickets.filter((t) => t.priority === "Alta").length,
      Media: filteredTickets.filter((t) => t.priority === "Media").length,
      Baja: filteredTickets.filter((t) => t.priority === "Baja").length,
    }

    const bySucursal = {}
    filteredTickets.forEach((t) => {
      const branch = t.branch_name || "Sin Sucursal"
      bySucursal[branch] = (bySucursal[branch] || 0) + 1
    })

    // Datos para gráficos
    const statusChartData = [
      { name: 'Sin Empezar', value: byStatus["Sin Empezar"], color: '#6b7280' },
      { name: 'En Curso', value: byStatus["En curso"], color: '#3b82f6' },
      { name: 'Completadas', value: byStatus["Listo"], color: '#10b981' }
    ]

    const priorityChartData = [
      { name: 'Alta', value: byPriority.Alta, color: '#ef4444' },
      { name: 'Media', value: byPriority.Media, color: '#eab308' },
      { name: 'Baja', value: byPriority.Baja, color: '#10b981' }
    ]

    const sucursalChartData = Object.entries(bySucursal)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    return { total, byStatus, byPriority, bySucursal, statusChartData, priorityChartData, sucursalChartData }
  }, [filteredTickets])

  const StatCard = ({ label, value, color, icon, bgGradient }) => (
    <Card className={`${bgGradient} border-none shadow-lg hover:shadow-xl transition-shadow`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80 mb-1">{label}</p>
            <p className={`text-4xl font-bold text-white`}>{value}</p>
          </div>
          <div className="text-5xl opacity-20">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            Cantidad: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Filtro de Fechas */}
      <div className="bg-white rounded-lg shadow-lg border border-border overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-4">
          <h3 className="text-lg font-semibold">Filtrar por Período</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Fecha Desde</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Fecha Hasta</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          {(startDate || endDate) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Mostrando {filteredTickets.length} de {tickets.length} incidencias
              </span>
              <button
                onClick={() => {
                  setStartDate("")
                  setEndDate("")
                }}
                className="text-sm text-primary hover:underline font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards principales con iconos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total de Incidencias" 
          value={stats.total} 
          icon="📊"
          bgGradient="bg-gradient-to-br from-blue-500 to-blue-700"
        />
        <StatCard 
          label="Sin Empezar" 
          value={stats.byStatus["Sin Empezar"]} 
          icon="⏸️"
          bgGradient="bg-gradient-to-br from-gray-500 to-gray-700"
        />
        <StatCard 
          label="En Curso" 
          value={stats.byStatus["En curso"]} 
          icon="⚡"
          bgGradient="bg-gradient-to-br from-blue-400 to-blue-600"
        />
        <StatCard 
          label="Completadas" 
          value={stats.byStatus["Listo"]} 
          icon="✅"
          bgGradient="bg-gradient-to-br from-green-500 to-green-700"
        />
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Dona - Estados */}
        <div className="bg-white rounded-lg shadow-lg border border-border overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-4">
            <h3 className="text-lg font-semibold">Distribución por Estado</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={true}
                >
                  {stats.statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Barras - Prioridades */}
        <div className="bg-white rounded-lg shadow-lg border border-border overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-4">
            <h3 className="text-lg font-semibold">Incidencias por Prioridad</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.priorityChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#374151', fontWeight: 'bold' }}>
                  {stats.priorityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gráfico de Sucursales */}
      <div className="bg-white rounded-lg shadow-lg border border-border overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-4">
          <h3 className="text-lg font-semibold">Incidencias por Sucursal</h3>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.sucursalChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} label={{ position: 'right', fill: '#374151', fontWeight: 'bold' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumen con métricas clave */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-lg border border-border p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              📈
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tasa de Completación</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.total > 0 ? Math.round((stats.byStatus["Listo"] / stats.total) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-border p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">
              🚨
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Incidencias Urgentes</p>
              <p className="text-3xl font-bold text-red-600">{stats.byPriority["Alta"]}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-border p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              ⚙️
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En Progreso</p>
              <p className="text-3xl font-bold text-blue-600">{stats.byStatus["En curso"]}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-border p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
              ⏳
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-3xl font-bold text-gray-600">{stats.byStatus["Sin Empezar"]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
