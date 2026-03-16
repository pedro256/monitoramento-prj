'use client';

import { useState } from 'react';
import { Plus, Eye, EyeOff, Copy, Trash2, CreditCard as Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Device {
  id: string;
  name: string;
  model: string;
  apiToken: string;
  status: 'online' | 'offline' | 'maintenance';
  lastConnection: string;
}

/**
 * id: string
 * name:string
 * model:string
 * apiToken:string
 * status:number
 * datacriacao: datetime
 */

const initialDevices: Device[] = [
  { id: '1', name: 'Prensa Hidráulica 01', model: 'PH-2000X', apiToken: 'tk_prod_4x8n2k9m1p7q3r5s', status: 'online', lastConnection: '2024-03-11 14:25:30' },
  { id: '2', name: 'CNC Router 04', model: 'CNC-R500', apiToken: 'tk_prod_6y3m8k1n4p9r2s7t', status: 'online', lastConnection: '2024-03-11 14:24:45' },
  { id: '3', name: 'Torno Automático 02', model: 'TA-1500', apiToken: 'tk_prod_9z5n2m7k3p1r8s4t', status: 'online', lastConnection: '2024-03-11 14:23:12' },
  { id: '4', name: 'Fresadora CNC 03', model: 'F-CNC-800', apiToken: 'tk_prod_2x7m4k8n1p6r3s9t', status: 'online', lastConnection: '2024-03-11 14:22:58' },
  { id: '5', name: 'Injetora Plástico 01', model: 'IP-3000', apiToken: 'tk_prod_5y9m2k6n3p8r1s7t', status: 'maintenance', lastConnection: '2024-03-11 12:15:20' },
  { id: '6', name: 'Esteira Transportadora A', model: 'ET-500A', apiToken: 'tk_prod_8z3m5k9n2p7r4s1t', status: 'online', lastConnection: '2024-03-11 14:25:15' },
];

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [visibleTokens, setVisibleTokens] = useState<{ [key: string]: boolean }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({ name: '', model: '' });

  const toggleTokenVisibility = (id: string) => {
    setVisibleTokens(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
  };

  const maskToken = (token: string) => {
    return token.substring(0, 8) + '••••••••••••••••';
  };

  const handleAddDevice = () => {
    const newId = (devices.length + 1).toString();
    const token = `tk_prod_${Math.random().toString(36).substring(2, 15)}`;
    const device: Device = {
      id: newId,
      name: newDevice.name,
      model: newDevice.model,
      apiToken: token,
      status: 'offline',
      lastConnection: 'Nunca',
    };
    setDevices([...devices, device]);
    setNewDevice({ name: '', model: '' });
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'offline': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'maintenance': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-100">Gestão de Dispositivos</h2>
          <p className="text-gray-400 mt-1">Configure e gerencie suas máquinas industriais</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Máquina
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#111111] border-gray-800 text-gray-100">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Adicionar Nova Máquina</DialogTitle>
              <DialogDescription className="text-gray-400">
                Preencha os dados da nova máquina que será integrada ao sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Nome da Máquina</Label>
                <Input
                  id="name"
                  placeholder="Ex: Prensa Hidráulica 05"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-gray-100 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model" className="text-gray-300">Modelo</Label>
                <Input
                  id="model"
                  placeholder="Ex: PH-3000X"
                  value={newDevice.model}
                  onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-gray-100 focus:border-emerald-500"
                />
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                <p className="text-sm text-cyan-400">
                  Um token de API será gerado automaticamente após a criação da máquina.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddDevice}
                disabled={!newDevice.name || !newDevice.model}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
              >
                Adicionar Máquina
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-[#111111] border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-100">
            Dispositivos Cadastrados ({devices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400 font-semibold">Nome</TableHead>
                  <TableHead className="text-gray-400 font-semibold">Modelo</TableHead>
                  <TableHead className="text-gray-400 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-400 font-semibold">API Token</TableHead>
                  <TableHead className="text-gray-400 font-semibold">Última Conexão</TableHead>
                  <TableHead className="text-gray-400 font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id} className="border-gray-800 hover:bg-gray-800/30">
                    <TableCell className="font-medium text-gray-100">{device.name}</TableCell>
                    <TableCell className="text-gray-400">{device.model}</TableCell>
                    <TableCell>
                      <Badge className={cn("border", getStatusBadge(device.status))}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                        {device.status === 'online' ? 'Online' :
                         device.status === 'maintenance' ? 'Manutenção' : 'Offline'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-800 px-3 py-1.5 rounded border border-gray-700 text-gray-300 font-mono">
                          {visibleTokens[device.id] ? device.apiToken : maskToken(device.apiToken)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleTokenVisibility(device.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                        >
                          {visibleTokens[device.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    <TableCell className="text-gray-400 text-sm">{device.lastConnection}</TableCell>
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
            <CardTitle className="text-sm font-medium text-gray-400">Total de Dispositivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100">{devices.length}</div>
            <p className="text-xs text-gray-400 mt-1">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-gray-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">Ativos Agora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">
              {devices.filter(d => d.status === 'online').length}
            </div>
            <p className="text-xs text-gray-400 mt-1">Conectados e operando</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-gray-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">Em Manutenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">
              {devices.filter(d => d.status === 'maintenance').length}
            </div>
            <p className="text-xs text-gray-400 mt-1">Requerem atenção</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
