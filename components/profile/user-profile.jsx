"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UserProfile({ user }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white">
        <h3 className="text-lg sm:text-2xl font-semibold px-6 py-4">Mi Perfil</h3>
      </div>

      <div className="p-6">
        <div className="max-w-md">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nombre Completo</p>
              <p className="font-semibold text-foreground">{user?.full_name || user?.name || "—"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-semibold text-foreground">{user?.email}</p>
            </div>

            {user?.cargo && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cargo</p>
                <p className="font-semibold text-foreground">{user.cargo}</p>
              </div>
            )}

            {user?.branch_name && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sucursal</p>
                <p className="font-semibold text-foreground">{user.branch_name}</p>
              </div>
            )}

            {user?.area_name && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Área</p>
                <p className="font-semibold text-foreground">{user.area_name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
