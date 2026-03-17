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


export default function DevicesPage() {
  const [devices, setDevices] = useState<IDeviceItem[]>([]);
  const [visibleTokens, setVisibleTokens] = useState<{
    [key: string]: boolean;
  }>({});
  const params = useParams();
  const idOrganization = params.id_organization;

  async function buscarDispositivos(){
    const req = await fetch(`/api/organizations/${idOrganization}/devices`);
    const _devices:IDeviceItem[] = await req.json();
    setDevices(_devices)
  }

  useEffect(()=>{
    buscarDispositivos()
  },[])


  const toggleTokenVisibility = (id: string) => {
    setVisibleTokens((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
  };

  const maskToken = (token: string) => {
    return token.substring(0, 8) + "••••••••••••••••";
  };

 

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case 2:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      case 3:
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
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
        <NewDeviceDialog/>
        
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
                    className="border-border hover:bg-primary/30"
                  >
                    <TableCell className="font-medium text-gray-100">
                      {device.name}
                    </TableCell>
                    <TableCell className="text-gray-400">
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
                        <code className="text-xs bg-gray-800 px-3 py-1.5 rounded border border-gray-700 text-gray-300 font-mono">
                          {visibleTokens[device.id]
                            ? device.apiToken
                            : maskToken(device.apiToken)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleTokenVisibility(device.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-100 hover:bg-gray-800"
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
                          className="h-8 w-8 p-0 text-gray-400 hover:text-emerald-400 hover:bg-gray-800"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {device.lastHeartbeat}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-cyan-400 hover:bg-gray-800"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-gray-800"
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
        <Card className="bg-[#111111] border-gray-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">
              Total de Dispositivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100">
              {devices.length}
            </div>
            <p className="text-xs text-gray-400 mt-1">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-gray-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">
              Ativos Agora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">
              {devices.filter((d) => d.status === 1).length}
            </div>
            <p className="text-xs text-gray-400 mt-1">Conectados e operando</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-gray-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">
              Em Manutenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">
              {devices.filter((d) => d.status === 2).length}
            </div>
            <p className="text-xs text-gray-400 mt-1">Requerem atenção</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
