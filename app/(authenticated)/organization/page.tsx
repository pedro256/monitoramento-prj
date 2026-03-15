"use client";
import {
  Building2,
  Mail,
  Settings,
  Trash2,
  ExternalLink,
  Search,
  Users
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import IOrganizationItem from "@/shared/models/organization/IOrganizationItem";
import { useEffect, useState } from "react";
import Link from "next/link";



export default function OrganizationsPage() {

  const [organizations, setOrganizations] = useState<IOrganizationItem[]>([])

  async function buscarOrganizacoes() {
    const request = await fetch("api/organizations")
    const _organizations: IOrganizationItem[] = await request.json();
    setOrganizations(_organizations)
  }

  useEffect(() => {
    buscarOrganizacoes()
  }, [])



  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight flex items-center gap-3">
            <Building2 className="text-primary w-8 h-8" />
            Suas Organizações
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Gerencie as unidades e permissões vinculadas ao seu perfil técnico.
          </p>
        </div>


      </div>

      {/* SEARCH E FILTROS */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
        <Input
          placeholder="Filtrar organizações..."
          className="pl-10 bg-background/50"
        />
      </div>

      {/* GRID DE ORGANIZAÇÕES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <Card key={org.id} className="group border-border bg-card/50 hover:border-primary/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold tracking-tight">
                {org.name}
              </CardTitle>
              <Building2 className="h-4 w-4 text-text-secondary group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
                <Mail className="h-3 w-3" />
                {org.email}
              </div>

              <div className="flex gap-2">
                <Link href={`/organization/${org.id}/settings`}  className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1 border-border hover:bg-primary/10">
                    <Settings className="h-3 w-3" /> Ajustes
                  </Button>
                </Link>

                <Button variant="outline" size="sm" className="px-3 border-border hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
                <Link href={`/organization/${org.id}/dashboard`}>
                  <Button size="sm" className=" p-3 bg-secondary">
                    <ExternalLink className="h-3 w-3 text-background" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {organizations.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-lg">
            <Users className="mx-auto h-12 w-12 text-text-secondary/20" />
            <p className="mt-4 text-text-secondary text-sm">Nenhuma organização localizada no banco de dados.</p>
          </div>
        )}
      </div>
    </div>
  );
}