"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  Cpu,
  Radio,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { listDevices } from "@/lib/api/devices";
import IDeviceItem from "@/shared/models/devices/IDeviceItem";
import {
  RealtimeConnectionStatus,
  useOrganizationRealtime,
} from "@/hooks/useOrganizationRealtime";

type RealtimeLogItem = {
  id: string;
  at: Date;
  type: string;
  summary: string;
  raw: unknown;
  tone: "info" | "success" | "warning" | "critical";
};

const MAX_LOG_ITEMS = 80;

function statusLabel(status: RealtimeConnectionStatus) {
  switch (status) {
    case "connected":
      return "Conectado";
    case "connecting":
      return "Conectando...";
    case "reconnecting":
      return "Reconectando...";
    case "error":
      return "Erro de conexão";
    default:
      return "Desconectado";
  }
}

function summarizeMessage(data: any): Omit<RealtimeLogItem, "id" | "at" | "raw"> {
  const type = String(data?.type ?? "event");

  if (type === "devices_online") {
    return {
      type,
      summary: `${data.value ?? 0} máquina(s) online`,
      tone: "success",
    };
  }

  if (type === "telemetry_flush") {
    return {
      type,
      summary: `Flush: ${data.payloads ?? 0} payload(s), ${data.sensors ?? 0} sensor(es), ${data.alerts ?? 0} alerta(s)`,
      tone: "info",
    };
  }

  if (type === "alert") {
    const severity = String(data.severity ?? "info").toLowerCase();
    return {
      type,
      summary: `[${severity}] ${data.message ?? "Alerta recebido"}${data.deviceId ? ` · ${String(data.deviceId).slice(0, 8)}…` : ""}`,
      tone:
        severity === "critical"
          ? "critical"
          : severity === "warning"
            ? "warning"
            : "info",
    };
  }

  return {
    type,
    summary: JSON.stringify(data),
    tone: "info",
  };
}

function toneClasses(tone: RealtimeLogItem["tone"]) {
  switch (tone) {
    case "success":
      return "border-emerald-500/30 bg-emerald-500/5 text-emerald-300";
    case "warning":
      return "border-yellow-500/30 bg-yellow-500/5 text-yellow-300";
    case "critical":
      return "border-red-500/30 bg-red-500/5 text-red-300";
    default:
      return "border-border bg-background/40 text-text-secondary";
  }
}

export default function DashboardPage() {
  const params = useParams();
  const organizationId = params.id_organization as string;

  const [devices, setDevices] = useState<IDeviceItem[]>([]);
  const [onlineFromSocket, setOnlineFromSocket] = useState<number | null>(null);
  const [criticalAlerts, setCriticalAlerts] = useState(0);
  const [logs, setLogs] = useState<RealtimeLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDevices = useCallback(async () => {
    if (!organizationId) return;
    try {
      const data = await listDevices(organizationId);
      setDevices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  const handleRealtimeMessage = useCallback((data: unknown) => {
    const payload = data as any;
    const summarized = summarizeMessage(payload);

    setLogs((prev) => {
      const next: RealtimeLogItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        at: new Date(),
        raw: data,
        ...summarized,
      };
      return [next, ...prev].slice(0, MAX_LOG_ITEMS);
    });

    if (payload?.type === "devices_online") {
      setOnlineFromSocket(Number(payload.value) || 0);
    }

    if (payload?.type === "alert") {
      const severity = String(payload.severity ?? "").toLowerCase();
      if (severity === "critical" && !payload.resolved) {
        setCriticalAlerts((prev) => prev + 1);
      }
    }
  }, []);

  const { status } = useOrganizationRealtime(organizationId, handleRealtimeMessage);

  const totalMachines = devices.length;
  const onlineFromDb = devices.filter((d) => d.status === "online").length;
  const onlineMachines = onlineFromSocket ?? onlineFromDb;
  const offlineMachines = Math.max(totalMachines - onlineMachines, 0);
  const onlinePercent =
    totalMachines > 0 ? Math.round((onlineMachines / totalMachines) * 100) : 0;

  const recentDevices = useMemo(
    () =>
      [...devices]
        .sort((a, b) => {
          const aTime = a.lastHeartbeat ? new Date(a.lastHeartbeat).getTime() : 0;
          const bTime = b.lastHeartbeat ? new Date(b.lastHeartbeat).getTime() : 0;
          return bTime - aTime;
        })
        .slice(0, 6),
    [devices],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-100 mb-2">Visão Geral</h2>
          <p className="text-gray-400">
            Monitore o desempenho em tempo real de suas máquinas industriais
          </p>
        </div>

        <Badge
          className={cn(
            "border px-3 py-1.5 gap-2",
            status === "connected"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : status === "error"
                ? "bg-red-500/10 text-red-400 border-red-500/30"
                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
          )}
        >
          {status === "connected" ? (
            <Wifi className="w-3.5 h-3.5" />
          ) : (
            <WifiOff className="w-3.5 h-3.5" />
          )}
          WebSocket · {statusLabel(status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-card border-border overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Total de máquinas
            </CardTitle>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "—" : totalMachines}
            </div>
            <p className="text-xs text-text-muted mt-1">Cadastradas na organização</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Online agora
            </CardTitle>
            <Activity className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-300">
              {loading ? "—" : onlineMachines}
            </div>
            <p className="text-xs text-text-muted mt-1">
              {onlinePercent}% do parque · via realtime
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Offline
            </CardTitle>
            <Radio className="w-4 h-4 text-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "—" : offlineMachines}</div>
            <p className="text-xs text-text-muted mt-1">Sem heartbeat recente</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Alertas críticos (sessão)
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{criticalAlerts}</div>
            <p className="text-xs text-text-muted mt-1">Recebidos neste dashboard</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <Card className="xl:col-span-3 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Log em tempo real</CardTitle>
              <p className="text-xs text-text-muted mt-1">
                Eventos do hub SignalR (`ReceiveMessage`)
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {logs.length} evento(s)
            </Badge>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[420px] pr-3">
              <div className="space-y-2">
                {logs.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm transition-colors",
                      toneClasses(item.tone),
                    )}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="font-mono text-[11px] uppercase tracking-wide opacity-80">
                        {item.type}
                      </span>
                      <span className="text-[11px] opacity-70">
                        {item.at.toLocaleTimeString("pt-BR")}
                      </span>
                    </div>
                    <p className="leading-relaxed">{item.summary}</p>
                  </div>
                ))}

                {logs.length === 0 && (
                  <div className="h-[360px] flex flex-col items-center justify-center text-center border border-dashed border-border rounded-lg px-6">
                    <Radio className="w-8 h-8 text-text-muted mb-3" />
                    <p className="text-sm text-text-secondary">
                      Aguardando eventos do WebSocket...
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      Quando houver flush de telemetria, os eventos aparecem aqui.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Máquinas</CardTitle>
            <Link
              href={`/organization/${organizationId}/devices`}
              className="text-xs text-primary hover:underline"
            >
              Ver todas
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDevices.map((device) => (
              <Link
                key={device.id}
                href={`/organization/${organizationId}/devices/${device.id}/monitor`}
                className="block rounded-lg border border-border bg-background/30 px-3 py-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{device.name}</p>
                    <p className="text-xs text-text-muted">
                      {device.model || "Sem modelo"} · {device.location || "Sem local"}
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      "border",
                      device.status === "online"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-muted text-text-muted border-border",
                    )}
                  >
                    {device.status === "online" ? "Online" : "Offline"}
                  </Badge>
                </div>
              </Link>
            ))}

            {!loading && recentDevices.length === 0 && (
              <div className="text-sm text-text-secondary py-10 text-center border border-dashed border-border rounded-lg">
                Nenhuma máquina cadastrada.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
