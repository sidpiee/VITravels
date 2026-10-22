"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";

type ConnectionState =
  | "connecting"
  | "joining"
  | "joined"
  | "disconnected"
  | "error";

type ChatMessage = {
  id: string;
  rideId: string;
  senderId: string;
  text: string;
  createdAt: string;
};

export default function ChatConnectionStatus({ rideId }: { rideId: string }) {
  const activeRideId = useRef(rideId);
  activeRideId.current = rideId;
  const user = useCurrentUser();
  const socketRef = useRef<Socket | null>(null);
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const currentUserId = user.data?.user._id;

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
            setIsLoadingHistory(true);
            client.emit("get_messages", { rideId: event.rideId });
          },
        );
        client.on(
          "messages",
          (event: { rideId: string; messages: ChatMessage[] }) => {
            if (event.rideId !== activeRideId.current) return;

            setMessages((current) => mergeMessages(current, event.messages));
            setIsLoadingHistory(false);
          },
        );
        client.on("new_message", (message: ChatMessage) => {
          if (message.rideId !== activeRideId.current) return;

          setMessages((current) => mergeMessages(current, [message]));
        });
        client.on("chat_error", (event: { message: string }) => {
          setConnection((current) =>
            current === "joining" ? "error" : current,
          );
          setError(event.message);
          setIsLoadingHistory(false);
        });
        client.on("disconnect", () => {
          setConnection("disconnected");
          setIsLoadingHistory(false);
        });
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
    setMessages([]);
    setDraft("");
    setError(null);
    setIsLoadingHistory(false);

    const client = socketRef.current;
    if (!client?.connected) return;

    setConnection("joining");
    setError(null);
    client.emit("join_ride", { rideId });
  }, [rideId]);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = draft.trim();
    const client = socketRef.current;
    if (!text || connection !== "joined" || !client?.connected) return;

    setError(null);
    client.emit("send_message", { rideId, text });
    setDraft("");
  }

  const statusText = {
    connecting: "Connecting to chat…",
    joining: "Connected. Joining this ride…",
    joined: "Joined ride chat.",
    disconnected: "Disconnected from chat.",
    error: "Could not connect to chat.",
  }[connection];

  return (
    <section className="flex min-h-[65vh] w-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground">Selected ride: {rideId}</p>
        <output className="text-sm text-muted-foreground">{statusText}</output>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div
        role="log"
        aria-label="Live ride messages"
        aria-live="polite"
        className="flex min-h-[35vh] max-h-[50vh] flex-1 flex-col gap-3 overflow-y-auto rounded-2xl border border-border/60 bg-background/60 p-4"
      >
        {messages.length === 0 ? (
          <p className="m-auto max-w-sm text-center text-sm text-muted-foreground">
            {isLoadingHistory
              ? "Loading messages…"
              : "No messages yet. Send the first one."}
          </p>
        ) : (
          messages.map((message) => {
            const isOwnMessage = currentUserId === message.senderId;

            return (
              <article
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  isOwnMessage
                    ? "self-end bg-primary text-primary-foreground"
                    : "self-start bg-muted text-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap break-words text-sm">
                  {message.text}
                </p>
                <time
                  dateTime={message.createdAt}
                  className={`mt-1 block text-right text-xs ${
                    isOwnMessage
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {formatMessageTime(message.createdAt)}
                </time>
              </article>
            );
          })
        )}
      </div>

      <form onSubmit={sendMessage} className="flex w-full items-center gap-2">
        <Input
          aria-label="Message"
          autoComplete="off"
          className="min-w-0 flex-1"
          disabled={connection !== "joined"}
          maxLength={1000}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={
            connection === "joined"
              ? "Type a message..."
              : "Join the ride chat to message"
          }
          value={draft}
        />
        <Button
          type="submit"
          disabled={connection !== "joined" || !draft.trim()}
        >
          Send
        </Button>
      </form>
    </section>
  );
}

function formatMessageTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function mergeMessages(
  current: ChatMessage[],
  incoming: ChatMessage[],
): ChatMessage[] {
  const messagesById = new Map<string, ChatMessage>();

  for (const message of [...current, ...incoming]) {
    messagesById.set(message.id, message);
  }

  return [...messagesById.values()].sort(
    (first, second) =>
      new Date(first.createdAt).getTime() -
      new Date(second.createdAt).getTime(),
  );
}
