'use client';
import { Activity, TriangleAlert as AlertTriangle, Cpu, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrganizationRealtime } from '@/hooks/useOrganizationRealtime';
import { useEffect, useState } from 'react';
import { listDevices } from '@/lib/api/devices';

export default function DevicesInforHeader({ orgId }:{orgId:string}) {
    const [totalMachines, setTotalMachines] = useState(0);
    const [onlineMachines, setOnlineMachines] = useState(0);
    const [criticalAlerts, setCriticalAlerts] = useState(0);

    useEffect(() => {
        if (!orgId) return;
        listDevices(orgId)
            .then((devices) => {
                setTotalMachines(devices.length);
                setOnlineMachines(devices.filter((d) => d.status === "online").length);
            })
            .catch(console.error);
    }, [orgId]);

    useOrganizationRealtime(orgId, (data: any) => {
        if (data?.type === "devices_online") {
            setOnlineMachines(Number(data.value) || 0);
        }
        if (data?.type === "alert" && String(data.severity).toLowerCase() === "critical" && !data.resolved) {
            setCriticalAlerts((prev) => prev + 1);
        }
    });

    if (!orgId) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-[#111111] border-gray-800 hover:border-emerald-500/30 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Total de Dispositivos</CardTitle>
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
                        {totalMachines > 0 ? Math.round((onlineMachines / totalMachines) * 100) : 0}% do total
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
        </div>
    )
}
