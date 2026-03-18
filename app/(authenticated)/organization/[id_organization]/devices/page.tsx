"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Copy,
  Trash2,
  CreditCard as Edit,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import IDeviceItem from "@/shared/models/devices/IDeviceItem";
import NewDeviceDialog from "./_components/new-device-dialog";
import { useParams } from "next/navigation";
import EditDeviceDialog from "./_components/edit-device-dialog";


export default function DevicesPage() {
  const [devices, setDevices] = useState<IDeviceItem[]>([]);
  const [deviceToEdit, setDeviceToEdit] = useState<IDeviceItem | null>(null);
  const [visibleTokens, setVisibleTokens] = useState<{
    [key: string]: boolean;
  }>({});
  const params = useParams();
  const idOrganization = params.id_organization;

  async function buscarDispositivos() {
    const req = await fetch(`/api/organizations/${idOrganization}/devices`);
    const _devices: IDeviceItem[] = await req.json();
    setDevices(_devices)
  }

  useEffect(() => {
    buscarDispositivos()
  }, [])


  const toggleTokenVisibility = (id: string) => {
    setVisibleTokens((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
  };

  const maskToken = (token: string) => {
    return token.substring(0, 8) + "••••••••••••••••";
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este dispositivo?")) return;

    const res = await fetch(`/api/organizations/${idOrganization}/devices?id=${id}`, {
      method: "DELETE"
    });

    if (res.ok) buscarDispositivos();
  };


  const getStatusBadge = (status: number) => {
    switch (status) {
      // case 1:
      //   return "bg-emerald-500/10 text-primary border-emerald-500/20";
      // case 2:
      //   return "bg-gray-500/10 text-text-muted border-gray-500/20";
      // case 3:
      //   return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default:
        return "bg-muted text-text-muted border-text-muted/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Gestão de Dispositivos</h2>
          <p className="text-text-secondary mt-1">
            Configure e gerencie suas máquinas industriais
          </p>
        </div>
        <NewDeviceDialog />

      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Dispositivos Cadastrados ({devices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent font-semibold">
                  <TableHead>Nome</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>API Token</TableHead>
                  <TableHead>Última Conexão</TableHead>
                  <TableHead className=" font-semibold text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow
                    key={device.id}
                    className="border-border hover:bg-primary/10"
                  >
                    <TableCell className="font-medium text-gray-100">
                      {device.name}
                    </TableCell>
                    <TableCell className="text-text-muted">
                      {device.model}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn("border", getStatusBadge(device.status))}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                        {device.status === 1
                          ? "Online"
                          : device.status === 2
                            ? "Manutenção"
                            : "Offline"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-accent px-3 py-1.5 rounded border border-accent-foreground/25 text-accent-foreground font-mono">
                          {visibleTokens[device.id]
                            ? device.apiToken
                            : maskToken(device.apiToken)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleTokenVisibility(device.id)}
                          className="h-8 w-8 p-0 text-text-muted hover:bg-primary-800"
                        >
                          {visibleTokens[device.id] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToken(device.apiToken)}
                          className=" h-8 w-8 p-0 text-text-muted hover:text-primary"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-muted text-sm">
                      {device.lastHeartbeat}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeviceToEdit(device)}
                          className="h-8 w-8 p-0 text-text-secondary  hover:text-primary-200 hover:bg-primary-800"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(device.id)}
                          className="h-8 w-8 p-0 text-text-secondary hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-card-foreground/5">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-text-muted">
              Total de Dispositivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100">
              {devices.length}
            </div>
            <p className="text-xs text-text-muted mt-1">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-foreground/5">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-text-muted">
              Ativos Agora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {devices.filter((d) => d.status === 1).length}
            </div>
            <p className="text-xs text-text-muted mt-1">Conectados e operando</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-foreground/5">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-text-muted">
              Em Manutenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">
              {devices.filter((d) => d.status === 2).length}
            </div>
            <p className="text-xs text-text-muted mt-1">Requerem atenção</p>
          </CardContent>
        </Card>
      </div>
      {deviceToEdit && (
        <EditDeviceDialog
          device={deviceToEdit}
          isOpen={!!deviceToEdit}
          onClose={() => setDeviceToEdit(null)}
          onSuccess={buscarDispositivos}
        />
      )}
    </div>
  );
}
