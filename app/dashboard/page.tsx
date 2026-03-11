'use client';

import { useState, useEffect } from 'react';
import { Activity, TriangleAlert as AlertTriangle, Cpu, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Machine {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  temperature: number;
  pressure: number;
  efficiency: number;
  chartData: { value: number }[];
}

const generateChartData = () => {
  return Array.from({ length: 20 }, () => ({
    value: Math.random() * 100,
  }));
};

const initialMachines: Machine[] = [
  { id: '1', name: 'Prensa Hidráulica 01', status: 'online', temperature: 65, pressure: 120, efficiency: 94, chartData: generateChartData() },
  { id: '2', name: 'CNC Router 04', status: 'online', temperature: 58, pressure: 85, efficiency: 97, chartData: generateChartData() },
  { id: '3', name: 'Torno Automático 02', status: 'warning', temperature: 82, pressure: 105, efficiency: 78, chartData: generateChartData() },
  { id: '4', name: 'Fresadora CNC 03', status: 'online', temperature: 61, pressure: 95, efficiency: 92, chartData: generateChartData() },
  { id: '5', name: 'Injetora Plástico 01', status: 'error', temperature: 95, pressure: 145, efficiency: 45, chartData: generateChartData() },
  { id: '6', name: 'Esteira Transportadora A', status: 'online', temperature: 42, pressure: 60, efficiency: 99, chartData: generateChartData() },
  { id: '7', name: 'Compressor Industrial 02', status: 'online', temperature: 71, pressure: 140, efficiency: 88, chartData: generateChartData() },
  { id: '8', name: 'Prensa Excêntrica 05', status: 'online', temperature: 68, pressure: 110, efficiency: 91, chartData: generateChartData() },
  { id: '9', name: 'Solda Robotizada 01', status: 'online', temperature: 55, pressure: 75, efficiency: 96, chartData: generateChartData() },
  { id: '10', name: 'Lavadora Industrial 03', status: 'offline', temperature: 28, pressure: 0, efficiency: 0, chartData: generateChartData() },
  { id: '11', name: 'Forno Industrial 01', status: 'online', temperature: 450, pressure: 20, efficiency: 93, chartData: generateChartData() },
  { id: '12', name: 'Empilhadeira AGV 02', status: 'online', temperature: 48, pressure: 90, efficiency: 89, chartData: generateChartData() },
];

export default function DashboardPage() {
  const [machines, setMachines] = useState<Machine[]>(initialMachines);

  useEffect(() => {
    const interval = setInterval(() => {
      setMachines(prev => prev.map(machine => ({
        ...machine,
        temperature: machine.status === 'offline' ? machine.temperature : machine.temperature + (Math.random() - 0.5) * 2,
        pressure: machine.status === 'offline' ? machine.pressure : machine.pressure + (Math.random() - 0.5) * 3,
        efficiency: machine.status === 'offline' ? 0 : Math.min(100, Math.max(0, machine.efficiency + (Math.random() - 0.5) * 2)),
        chartData: [...machine.chartData.slice(1), { value: Math.random() * 100 }],
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalMachines = machines.length;
  const onlineMachines = machines.filter(m => m.status === 'online').length;
  const criticalAlerts = machines.filter(m => m.status === 'error' || m.status === 'warning').length;
  const avgEfficiency = Math.round(machines.reduce((acc, m) => acc + m.efficiency, 0) / machines.length);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'from-emerald-500 to-green-600';
      case 'warning': return 'from-yellow-500 to-orange-600';
      case 'error': return 'from-red-500 to-pink-600';
      case 'offline': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'warning': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'error': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'offline': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-100 mb-2">Visão Geral</h2>
        <p className="text-gray-400">Monitore o desempenho em tempo real de suas máquinas industriais</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#111111] border-gray-800 hover:border-emerald-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total de Máquinas</CardTitle>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100">{totalMachines}</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Todas registradas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-gray-800 hover:border-emerald-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Máquinas Online</CardTitle>
            <Activity className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100">{onlineMachines}</div>
            <p className="text-xs text-gray-400 mt-1">
              {Math.round((onlineMachines / totalMachines) * 100)}% do total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-gray-800 hover:border-red-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Alertas Críticos</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{criticalAlerts}</div>
            <p className="text-xs text-red-400 mt-1">Requer atenção imediata</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-gray-800 hover:border-cyan-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Eficiência Média</CardTitle>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100">{avgEfficiency}%</div>
            <p className="text-xs text-cyan-400 mt-1">+2.3% vs. ontem</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-100 mb-4">Status dos Dispositivos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {machines.map((machine) => (
            <Link key={machine.id} href={`/dashboard/machine/${machine.id}`}>
              <Card className={cn(
                "bg-[#111111] border-gray-800 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group h-full",
                machine.status === 'error' && "border-red-500/30",
                machine.status === 'warning' && "border-yellow-500/30"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-semibold text-gray-100 group-hover:text-emerald-400 transition-colors">
                        {machine.name}
                      </CardTitle>
                      <div className={cn(
                        "inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded-md text-xs font-medium border",
                        getStatusBadge(machine.status)
                      )}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {machine.status === 'online' ? 'Online' :
                         machine.status === 'warning' ? 'Atenção' :
                         machine.status === 'error' ? 'Erro' : 'Offline'}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-16">
                    <ResponsiveContainer width={300}>
                      <LineChart data={machine.chartData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={`url(#gradient-${machine.id})`}
                          strokeWidth={2}
                          dot={false}
                        />
                        <defs>
                          <linearGradient id={`gradient-${machine.id}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" className={`text-${machine.status === 'error' ? 'red' : machine.status === 'warning' ? 'yellow' : 'emerald'}-500`} stopColor="currentColor" />
                            <stop offset="100%" className={`text-${machine.status === 'error' ? 'pink' : machine.status === 'warning' ? 'orange' : 'cyan'}-500`} stopColor="currentColor" />
                          </linearGradient>
                        </defs>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-800/50 rounded-md p-2">
                      <p className="text-gray-500">Temp.</p>
                      <p className="text-gray-100 font-semibold">{machine.temperature.toFixed(1)}°C</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-md p-2">
                      <p className="text-gray-500">Pressão</p>
                      <p className="text-gray-100 font-semibold">{machine.pressure.toFixed(0)} PSI</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Eficiência</span>
                      <span className="text-gray-100 font-semibold">{machine.efficiency.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div
                        className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", getStatusColor(machine.status))}
                        style={{ width: `${machine.efficiency}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
