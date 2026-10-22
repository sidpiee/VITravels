"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

type ConnectionState =
  | "connecting"
  | "joining"
  | "joined"
  | "disconnected"
  | "error";

export default function ChatConnectionStatus({ rideId }: { rideId: string }) {
  const activeRideId = useRef(rideId);
  activeRideId.current = rideId;

  const socketRef = useRef<Socket | null>(null);
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let socket: Socket | null = null;

    async function connectToChat() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API;
        const chatUrl = process.env.NEXT_PUBLIC_OUECHAT_URL;

        if (!backendUrl || !chatUrl) {
          throw new Error("Chat service is not configured.");
        }

        const response = await fetch(`${backendUrl}/api/chat/session`, {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Could not create a chat session.");
        }

        const session = (await response.json()) as { chatToken?: unknown };

        if (typeof session.chatToken !== "string") {
          throw new Error("The chat session response did not include a token.");
        }

        if (cancelled) return;

        const client = io(chatUrl, {
          autoConnect: false,
          auth: { chatToken: session.chatToken },
        });

        socket = client;
        socketRef.current = client;
        client.on("connect", () => {
          setConnection("joining");
          setError(null);
          client.emit("join_ride", { rideId: activeRideId.current });
        });
        client.on(
          "joined_ride",
          (event: { rideId: string; roomId: string }) => {
            if (event.rideId !== activeRideId.current) return;

            setConnection("joined");
            setError(null);
          },
        );
        client.on("chat_error", (event: { message: string }) => {
          setConnection("error");
          setError(event.message);
        });
        client.on("disconnect", () => setConnection("disconnected"));
        client.on("connect_error", (cause: Error) => {
          setConnection("error");
          setError(cause.message || "Could not connect to chat.");
        });

        client.connect();
      } catch (cause) {
        if (cancelled) return;

        setConnection("error");
        setError(
          cause instanceof Error ? cause.message : "Could not connect to chat.",
        );
      }
    }

    void connectToChat();

    return () => {
      cancelled = true;
      socket?.disconnect();
      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const client = socketRef.current;
    if (!client?.connected) return;

    setConnection("joining");
    setError(null);
    client.emit("join_ride", { rideId });
  }, [rideId]);

  if (error) {
    return (
      <p role="alert" className="text-sm text-destructive">
        {error}
      </p>
    );
  }

  const statusText = {
    connecting: "Connecting to chat…",
    joining: "Connected. Joining this ride…",
    joined: "Joined ride chat.",
    disconnected: "Disconnected from chat.",
    error: "Could not connect to chat.",
  }[connection];

  return (
    <output className="text-sm text-muted-foreground">{statusText}</output>
  );
}
