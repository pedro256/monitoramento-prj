import { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";

export type TelemetryData = {
  timestamp: string;
  temperature: number;
  pressure: number;
};

export type DeviceStatus = {
  id: string;
  name: string;
  status: "online" | "offline";
  lastHeartbeat: string;
};

export function useDevicesInfoRealtime(organizationId: string) {
  const [telemetry, setTelemetry] = useState<TelemetryData[]>([]);
  const [devices, setDevices] = useState<DeviceStatus[]>([]);
  
  // Estado extra para armazenar o valor vindo do WebSocket
  const [realOnlineCount, setRealOnlineCount] = useState<number | null>(null);

  useEffect(() => {
    // 1. Configurando a conexão real com o Hub SignalR do .NET
    const connection = new signalR.HubConnectionBuilder()
      // Garanta que a URL bate com a porta que seu .NET estiver rodando (ex: https://localhost:5001)
      .withUrl(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/realtimeHub`)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log("WebSocket (SignalR) Conectado!");
        // Entra no "Grupo" específico da Organização para escutar apenas os eventos dela
        connection.invoke("JoinOrganization", organizationId);
      })
      .catch(err => console.error("Erro na conexão WebSocket: ", err));

    // 2. Escutando ativamente as mensagens despachadas pelo RealtimeNotifier.cs
    connection.on("ReceiveMessage", (message: any) => {
      if (message && message.type === "devices_online") {
        setRealOnlineCount(message.count);
      }
      // No futuro, se enviar telemetria: if (message.type === "telemetry") setTelemetry(...)
    });

    // --- INÍCIO DA SIMULAÇÃO (Para visualizar o dashboard ganhando vida) ---
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();

      // Adiciona um novo ponto no gráfico e mantém os últimos 20 registros
      setTelemetry((prev) => {
        const next = [...prev, {
          timestamp: timeStr,
          temperature: +(60 + Math.random() * 15).toFixed(1), // Média simulada ~60 a 75
          pressure: +(1 + Math.random() * 0.8).toFixed(2),    // Média simulada ~1.0 a 1.8
        }];
        return next.slice(-20);
      });

      // Atualiza os status dos dispositivos aleatoriamente para efeito visual
      setDevices([
        { id: "1", name: "CLP-01 Extrusora", status: "online", lastHeartbeat: timeStr },
        { id: "2", name: "CLP-02 Injetora", status: "online", lastHeartbeat: timeStr },
        { id: "3", name: "CLP-03 Esteira", status: Math.random() > 0.8 ? "offline" : "online", lastHeartbeat: timeStr },
      ]);
    }, 2000); // Atualiza a cada 2 segundos

    return () => {
      clearInterval(interval);
      // Limpa a conexão quando o componente for desmontado da tela
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke("LeaveOrganization", organizationId).then(() => connection.stop());
      } else {
        connection.stop();
      }
    };
  }, [organizationId]);

  const onlineCount = realOnlineCount !== null ? realOnlineCount : devices.filter(d => d.status === "online").length;

  return { telemetry, devices, onlineCount };
}