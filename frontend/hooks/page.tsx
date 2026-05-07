"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useDevicesInfoRealtime } from "@/hooks/useDevicesInfoRealtime";
import { Activity, Server, AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function OrganizationDashboardPage() {
  const params = useParams();
  // Garantindo que pegamos o ID corretamente (se não existir, mockamos para testes)
  const organizationId = typeof params?.id === "string" ? params.id : "org-teste";
  
  // Consumindo nosso hook customizado para dados em tempo real
  const { telemetry, devices, onlineCount } = useDevicesInfoRealtime(organizationId);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10 flex flex-col gap-8">
      {/* Cabeçalho da página */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Análise em Tempo Real</h1>
          <p className="text-muted-foreground mt-1">Monitoramento da Organização: {organizationId}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20 shadow-[0_0_10px_rgba(var(--primary),0.2)]">
          <Zap className="h-4 w-4 animate-pulse" />
          <span>Conexão WebSocket Ativa</span>
        </div>
      </header>

      {/* KPIs (Key Performance Indicators) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-4 bg-primary/10 text-primary rounded-xl">
            <Server className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total de CLPs</p>
            <h2 className="text-3xl font-extrabold">{devices.length}</h2>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-4 bg-green-500/10 text-green-500 rounded-xl">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Operando / Online</p>
            <h2 className="text-3xl font-extrabold">{onlineCount}</h2>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-4 bg-amber-500/10 text-amber-500 rounded-xl">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Alertas Ativos</p>
            <h2 className="text-3xl font-extrabold">2</h2>
          </div>
        </div>
      </div>

      {/* Área de Gráficos e Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico de Telemetria Contínua */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Histórico Vivo (Telemetria)
              </h3>
              <p className="text-sm text-muted-foreground">Média de Temperatura e Pressão da planta</p>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetry} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                <XAxis dataKey="timestamp" strokeOpacity={0.5} fontSize={12} tickMargin={10} />
                <YAxis yAxisId="left" strokeOpacity={0.5} fontSize={12} />
                <YAxis yAxisId="right" orientation="right" strokeOpacity={0.5} fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line yAxisId="left" type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#ef4444" strokeWidth={3} dot={false} isAnimationActive={false} />
                <Line yAxisId="right" type="monotone" dataKey="pressure" name="Pressão (Bar)" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Painel Status Individual dos Equipamentos */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col">
          <h3 className="text-xl font-bold mb-4">Status dos CLPs</h3>
          <div className="flex-1 overflow-auto space-y-3 pr-2">
            {devices.map((dev) => (
              <div key={dev.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/40 hover:bg-background transition-colors">
                <div>
                  <p className="font-bold text-sm">{dev.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Visto em: {dev.lastHeartbeat}</p>
                </div>
                <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${dev.status === 'online' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {dev.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}