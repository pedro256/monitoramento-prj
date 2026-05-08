import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";

export function useDashboardRealtime(
  orgId: string,
  onMessage: (data: any) => void
) {
  useEffect(() => {
    if (!orgId) return;

    let connection: signalR.HubConnection;

    async function startConnection() {
      try {

        const res = await fetch(`/api/organizations/${orgId}/realtime`, {
          method: "POST",
          body: JSON.stringify({ organizationIdFromBody: orgId }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.error("Erro ao obter realtime token");
          return;
        }

        const { token } = await res.json();

        connection = new signalR.HubConnectionBuilder()
          .withUrl(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/devicesHub`,
            {
              accessTokenFactory: () => token,
            }
          )
          .withAutomaticReconnect()
          .build();


        connection.on("ReceiveDeviceData", (data) => {
          onMessage(data);
        });

        await connection.start();
      } catch (err) {
        console.error("Erro no realtime:", err);
      }
    }

    startConnection();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [orgId]);
}