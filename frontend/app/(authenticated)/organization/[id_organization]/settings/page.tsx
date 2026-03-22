'use client';

import { Bell, Shield, Palette, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-100">Configurações</h2>
        <p className="text-gray-400 mt-1">Personalize o sistema de acordo com suas necessidades</p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-[#111111] border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Bell className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-100">Notificações</CardTitle>
                <CardDescription className="text-gray-400">Configure os alertas do sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-alerts" className="text-gray-300">Alertas por E-mail</Label>
                <p className="text-sm text-gray-500">Receba notificações de eventos críticos</p>
              </div>
              <Switch id="email-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-alerts" className="text-gray-300">Notificações Push</Label>
                <p className="text-sm text-gray-500">Alertas em tempo real no navegador</p>
              </div>
              <Switch id="push-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-alerts" className="text-gray-300">Alertas por SMS</Label>
                <p className="text-sm text-gray-500">Notificações para falhas críticas</p>
              </div>
              <Switch id="sms-alerts" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-100">Segurança</CardTitle>
                <CardDescription className="text-gray-400">Gerencie permissões e acessos</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="2fa" className="text-gray-300">Autenticação de Dois Fatores</Label>
                <p className="text-sm text-gray-500">Camada extra de segurança</p>
              </div>
              <Switch id="2fa" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-logout" className="text-gray-300">Logout Automático</Label>
                <p className="text-sm text-gray-500">Após 30 minutos de inatividade</p>
              </div>
              <Switch id="auto-logout" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Palette className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-100">Aparência</CardTitle>
                <CardDescription className="text-gray-400">Personalize a interface do sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme" className="text-gray-300">Tema</Label>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-gray-800 border-emerald-500 text-emerald-400 hover:bg-gray-700"
                >
                  Dark Mode
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                  disabled
                >
                  Light Mode
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Database className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-100">Dados e Backup</CardTitle>
                <CardDescription className="text-gray-400">Configure retenção e backup de dados</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="retention" className="text-gray-300">Retenção de Logs (dias)</Label>
              <Input
                id="retention"
                type="number"
                defaultValue="90"
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-backup" className="text-gray-300">Backup Automático</Label>
                <p className="text-sm text-gray-500">Backup diário às 03:00</p>
              </div>
              <Switch id="auto-backup" defaultChecked />
            </div>
            <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white">
              Exportar Dados do Sistema
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
          Cancelar
        </Button>
        <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white">
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
