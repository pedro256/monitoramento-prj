import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

export function useDashboardRealtime(
  orgId: string,
  onMessage: (data: any) => void
) {
  const messageHandler = useRef(onMessage);
  messageHandler.current = onMessage;

  useEffect(() => {
    if (!orgId) return;

    let connection: signalR.HubConnection | null = null;
    let isMounted = true; 

    const startConnection = async () => {
      try {
        const res = await fetch(`/api/organizations/${orgId}/realtime`, {
          method: "POST",
          body: JSON.stringify({ organizationIdFromBody: orgId }),
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok || !isMounted) return;
        const { token } = await res.json();

        connection = new signalR.HubConnectionBuilder()
          .withUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/devicesHub`, {
            accessTokenFactory: () => token,
            transport: signalR.HttpTransportType.WebSockets 
          })
          .withAutomaticReconnect()
          .build();

        connection.on("ReceiveMessage", (data) => {
          console.log("Received message:", data);
          messageHandler.current(data);
        });

        await connection.start();
        
        if (isMounted) {
          console.log(`Connected to Hub. Joining group: ${orgId}`);
          await connection.invoke("JoinOrganization", orgId);
        }

      } catch (err) {
        console.error("SignalR Connection Error: ", err);
      }
    };

    startConnection();

    // Cleanup: Fecha a conexão quando o componente desmonta ou orgId muda
    return () => {
      isMounted = false;
      if (connection) {
        connection.stop()
          .then(() => console.log("SignalR Disconnected"))
          .catch(err => console.error("Error stopping connection", err));
      }
    };
  }, [orgId]);
}