"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UserProfile({ user }) {
  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white">
        <CardTitle className="text-2xl">Mi Perfil</CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="max-w-md">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.[0] || "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nombre Completo</p>
              <p className="font-semibold text-foreground">{user?.name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-semibold text-foreground">{user?.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Rol</p>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent">
                {user?.role === "admin" ? "Administrador" : "Usuario"}
              </span>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Miembro desde</p>
              <p className="font-semibold text-foreground">
                {new Date().toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
