'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Activity, Thermometer, Gauge, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TelemetryData {
  time: string;
  temperature: number;
  pressure: number;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

const generateInitialData = (): TelemetryData[] => {
  const data: TelemetryData[] = [];
  const now = new Date();
  for (let i = 59; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000);
    data.push({
      time: time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      temperature: 65 + Math.random() * 10,
      pressure: 120 + Math.random() * 20,
    });
  }
  return data;
};

const initialLogs: LogEntry[] = [
  { id: '1', timestamp: '2024-03-11 14:23:45', level: 'success', message: 'Ciclo de produção completado com sucesso' },
  { id: '2', timestamp: '2024-03-11 14:18:32', level: 'info', message: 'Temperatura estabilizada em 65°C' },
  { id: '3', timestamp: '2024-03-11 14:15:21', level: 'warning', message: 'Pressão acima do normal: 142 PSI' },
  { id: '4', timestamp: '2024-03-11 14:10:18', level: 'info', message: 'Início do processo de calibração' },
  { id: '5', timestamp: '2024-03-11 14:05:09', level: 'error', message: 'Falha temporária no sensor de pressão' },
  { id: '6', timestamp: '2024-03-11 14:00:00', level: 'success', message: 'Sistema reiniciado com sucesso' },
  { id: '7', timestamp: '2024-03-11 13:55:43', level: 'info', message: 'Manutenção preventiva agendada' },
  { id: '8', timestamp: '2024-03-11 13:50:12', level: 'info', message: 'Parâmetros de operação ajustados' },
];

export default function MachinePage({ params }: { params: { id: string } }) {
  const [telemetryData, setTelemetryData] = useState<TelemetryData[]>(generateInitialData());
  const [currentTemp, setCurrentTemp] = useState(65);
  const [currentPressure, setCurrentPressure] = useState(120);
  const [efficiency, setEfficiency] = useState(94);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newTemp = currentTemp + (Math.random() - 0.5) * 2;
      const newPressure = currentPressure + (Math.random() - 0.5) * 3;

      setCurrentTemp(newTemp);
      setCurrentPressure(newPressure);
      setEfficiency(prev => Math.min(100, Math.max(70, prev + (Math.random() - 0.5) * 2)));

      setTelemetryData(prev => [
        ...prev.slice(1),
        {
          time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          temperature: newTemp,
          pressure: newPressure,
        }
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentTemp, currentPressure]);

  const machineName = 'Prensa Hidráulica 01';

  const getLogBadge = (level: string) => {
    switch (level) {
      case 'success': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'info': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'warning': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'error': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-gray-100">{machineName}</h2>
            <p className="text-gray-400">Monitoramento em tempo real</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#111111] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Temperatura Atual</CardTitle>
            <Thermometer className="w-4 h-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100">{currentTemp.toFixed(1)}°C</div>
            <p className="text-xs text-gray-400 mt-1">Range: 60-80°C</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pressão Atual</CardTitle>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100">{currentPressure.toFixed(0)} PSI</div>
            <p className="text-xs text-gray-400 mt-1">Range: 100-150 PSI</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Eficiência</CardTitle>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100">{efficiency.toFixed(0)}%</div>
            <p className="text-xs text-emerald-400 mt-1">Acima da meta</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#111111] border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-100 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-orange-400" />
              Telemetria de Temperatura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={telemetryData}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="time"
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  domain={[50, 90]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#f97316"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTemp)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-100 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-cyan-400" />
              Telemetria de Pressão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={telemetryData}>
                <defs>
                  <linearGradient id="colorPressure" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="time"
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  domain={[80, 160]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="pressure"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPressure)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#111111] border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            Histórico de Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {initialLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Badge className={cn("border", getLogBadge(log.level))}>
                    {log.level === 'success' && <Activity className="w-3 h-3 mr-1" />}
                    {log.level.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-100 font-medium">{log.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
