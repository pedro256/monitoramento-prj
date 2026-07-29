import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { fetchRealtimeToken } from "@/lib/api/auth";

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
        const { token } = await fetchRealtimeToken(orgId);
        if (!isMounted) return;

        connection = new signalR.HubConnectionBuilder()
          .withUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/devicesHub`, {
            accessTokenFactory: () => token,
            transport: signalR.HttpTransportType.WebSockets,
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

    return () => {
      isMounted = false;
      if (connection) {
        connection
          .stop()
          .then(() => console.log("SignalR Disconnected"))
          .catch((err) => console.error("Error stopping connection", err));
      }
    };
  }, [orgId]);
}
