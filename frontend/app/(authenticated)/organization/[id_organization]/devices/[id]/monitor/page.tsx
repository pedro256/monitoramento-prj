"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Clock,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  getDevice,
  listDeviceAlerts,
  listDeviceTelemetry,
} from "@/lib/api/devices";
import IDeviceItem, {
  ITelemetryAlert,
  ITelemetryLog,
} from "@/shared/models/devices/IDeviceItem";

const POLL_INTERVAL_MS = 10_000;

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("pt-BR");
}

function statusLabel(status: string) {
  if (status === "online") return "Online";
  if (status === "maintenance") return "Manutenção";
  return "Offline";
}

function statusBadge(status: string) {
  switch (status) {
    case "online":
      return "bg-emerald-500/10 text-primary border-emerald-500/20";
    case "maintenance":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    default:
      return "bg-muted text-text-muted border-text-muted/20";
  }
}

function severityBadge(severity: string) {
  switch (severity) {
    case "critical":
      return "bg-destructive/15 text-destructive border-destructive/30";
    case "warning":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    default:
      return "bg-sky-500/10 text-sky-400 border-sky-500/20";
  }
}

export default function DeviceMonitorPage() {
  const params = useParams();
  const organizationId = params.id_organization as string;
  const deviceId = params.id as string;

  const [device, setDevice] = useState<IDeviceItem | null>(null);
  const [alerts, setAlerts] = useState<ITelemetryAlert[]>([]);
  const [logs, setLogs] = useState<ITelemetryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(
    async (isInitial = false) => {
      if (!organizationId || !deviceId) return;

      if (isInitial) setLoading(true);
      else setRefreshing(true);

      try {
        const [deviceData, alertsData, logsData] = await Promise.all([
          getDevice(organizationId, deviceId),
          listDeviceAlerts(organizationId, deviceId, 50),
          listDeviceTelemetry(organizationId, deviceId, 50),
        ]);

        setDevice(deviceData);
        setAlerts(alertsData);
        setLogs(logsData);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Falha ao carregar dados do dispositivo");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [organizationId, deviceId],
  );

  useEffect(() => {
    loadData(true);
    const interval = setInterval(() => loadData(false), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading) {
    return (
      <div className="py-20 text-center text-text-secondary">
        Carregando monitoramento...
      </div>
    );
  }

  if (!device) {
    return (
      <div className="space-y-4">
        <Link
          href={`/organization/${organizationId}/devices`}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para dispositivos
        </Link>
        <p className="text-destructive">{error || "Dispositivo não encontrado"}</p>
      </div>
    );
  }

  const openAlerts = alerts.filter((a) => !a.resolved).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <Link
            href={`/organization/${organizationId}/devices`}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para dispositivos
          </Link>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="w-7 h-7 text-primary" />
            {device.name}
          </h2>
          <p className="text-text-secondary text-sm">
            Monitoramento em tempo quase real (atualização a cada 10s)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-text-muted flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {lastUpdated
              ? `Atualizado: ${lastUpdated.toLocaleTimeString("pt-BR")}`
              : "—"}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData(false)}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
            Atualizar
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-text-secondary">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={cn("border", statusBadge(device.status))}>
              {statusLabel(device.status)}
            </Badge>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-text-secondary">Modelo</CardTitle>
          </CardHeader>
          <CardContent className="font-medium">{device.model || "—"}</CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-text-secondary">Localização</CardTitle>
          </CardHeader>
          <CardContent className="font-medium inline-flex items-center gap-1">
            <MapPin className="w-4 h-4 text-text-muted" />
            {device.location || "—"}
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-text-secondary">Alertas abertos</CardTitle>
          </CardHeader>
          <CardContent className="font-medium inline-flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            {openAlerts}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Informações do dispositivo</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-text-secondary">ID:</span>{" "}
            <code className="text-xs">{device.id}</code>
          </div>
          <div>
            <span className="text-text-secondary">API Token:</span>{" "}
            <code className="text-xs">{device.apiToken}</code>
          </div>
          <div>
            <span className="text-text-secondary">Última conexão:</span>{" "}
            {formatDate(device.lastHeartbeat)}
          </div>
          <div>
            <span className="text-text-secondary">Criado em:</span>{" "}
            {formatDate(device.createdAt)}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">
              Alertas ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Severidade</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Quando</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id} className="border-border">
                    <TableCell>
                      <Badge className={cn("border", severityBadge(alert.severity))}>
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[240px] truncate">
                      {alert.message}
                    </TableCell>
                    <TableCell>
                      {alert.resolved ? "Resolvido" : "Aberto"}
                    </TableCell>
                    <TableCell className="text-text-muted text-sm">
                      {formatDate(alert.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
                {alerts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-text-secondary py-8">
                      Nenhum alerta registrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">
              Logs de telemetria ({logs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Tag</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Ciclo</TableHead>
                  <TableHead>Quando</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="border-border">
                    <TableCell className="font-medium">{log.tag}</TableCell>
                    <TableCell>{log.value}</TableCell>
                    <TableCell className="text-text-muted">{log.unity || "—"}</TableCell>
                    <TableCell className="text-text-muted">
                      {log.cycleCount ?? "—"}
                    </TableCell>
                    <TableCell className="text-text-muted text-sm">
                      {formatDate(log.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-text-secondary py-8">
                      Nenhum log de telemetria registrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
