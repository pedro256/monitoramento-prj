"use client";

import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { fetchRealtimeToken } from "@/lib/api/auth";

export type RealtimeConnectionStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "error";

export function useOrganizationRealtime(
  orgId: string,
  onMessage: (data: unknown) => void,
) {
  const messageHandler = useRef(onMessage);
  messageHandler.current = onMessage;
  const [status, setStatus] = useState<RealtimeConnectionStatus>("disconnected");

  useEffect(() => {
    if (!orgId) return;

    let connection: signalR.HubConnection | null = null;
    let isMounted = true;

    const startConnection = async () => {
      try {
        setStatus("connecting");
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
          messageHandler.current(data);
        });

        connection.onreconnecting(() => {
          if (isMounted) setStatus("reconnecting");
        });

        connection.onreconnected(async () => {
          if (!isMounted || !connection) return;
          setStatus("connected");
          await connection.invoke("JoinOrganization", orgId);
        });

        connection.onclose(() => {
          if (isMounted) setStatus("disconnected");
        });

        await connection.start();

        if (isMounted) {
          setStatus("connected");
          await connection.invoke("JoinOrganization", orgId);
        }
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
        if (isMounted) setStatus("error");
      }
    };

    startConnection();

    return () => {
      isMounted = false;
      if (connection) {
        connection.stop().catch(() => undefined);
      }
    };
  }, [orgId]);

  return { status };
}
