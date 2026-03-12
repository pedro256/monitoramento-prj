'use client';

import { Activity, TrendingUp, Zap, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const performanceData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  efficiency: 70 + Math.random() * 30,
  output: 50 + Math.random() * 50,
}));

export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-100">Monitoramento em Tempo Real</h2>
        <p className="text-gray-400 mt-1">Acompanhe o desempenho global das operações</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#111111] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Produção Atual</CardTitle>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100">1,247</div>
            <p className="text-xs text-emerald-400 mt-1">unidades/hora</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Consumo Energético</CardTitle>
            <Zap className="w-4 h-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100">342 kW</div>
            <p className="text-xs text-yellow-400 mt-1">-5% vs. média</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Tempo de Atividade</CardTitle>
            <Clock className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100">99.8%</div>
            <p className="text-xs text-cyan-400 mt-1">Últimas 24h</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">OEE Global</CardTitle>
            <Activity className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100">87%</div>
            <p className="text-xs text-emerald-400 mt-1">+3.2% vs. semana</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#111111] border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-100">
            Desempenho nas Últimas 24 Horas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#6b7280" tick={{ fill: '#6b7280' }} />
              <YAxis stroke="#6b7280" tick={{ fill: '#6b7280' }} />
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
                dataKey="efficiency"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEfficiency)"
              />
              <Area
                type="monotone"
                dataKey="output"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOutput)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
