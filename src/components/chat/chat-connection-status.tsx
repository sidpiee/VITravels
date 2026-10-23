"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
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
  senderName?: string;
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
    <section className="flex h-full min-h-0 w-full flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground">Selected ride: {rideId}</p>
        <output className="text-sm text-muted-foreground">{statusText}</output>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <MessageScrollerProvider autoScroll defaultScrollPosition="end">
        <MessageScroller className="min-h-0 flex-1 rounded-2xl border border-border/60 bg-background/60">
          <MessageScrollerViewport aria-label="Live ride messages">
            <MessageScrollerContent className="gap-3 p-4">
              {messages.length === 0 ? (
                <MessageScrollerItem className="my-auto flex w-full justify-center">
                  <p className="max-w-sm text-center text-sm text-muted-foreground">
                    {isLoadingHistory
                      ? "Loading messages…"
                      : "No messages yet. Send the first one."}
                  </p>
                </MessageScrollerItem>
              ) : (
                messages.map((message, index) => {
                  const previousMessage = messages[index - 1];
                  const dateLabel = formatMessageDate(message.createdAt);
                  const showDateHeading =
                    !previousMessage ||
                    !isSameLocalDate(
                      new Date(previousMessage.createdAt),
                      new Date(message.createdAt),
                    );
                  const isOwnMessage = currentUserId === message.senderId;
                  const senderName =
                    (isOwnMessage ? "You" : undefined) ||
                    message.senderName?.trim() ||
                    (isOwnMessage ? user.data?.user.name : undefined);

                  return (
                    <MessageScrollerItem
                      key={message.id}
                      messageId={message.id}
                      className="w-full"
                    >
                      {showDateHeading && dateLabel && (
                        <p className="mb-3 text-center text-xs font-medium text-muted-foreground">
                          {dateLabel}
                        </p>
                      )}
                      <Message align={isOwnMessage ? "end" : "start"}>
                        <MessageContent
                          className={`w-fit max-w-[85%] gap-1 rounded-2xl px-4 py-2.5 ${
                            isOwnMessage
                              ? "self-end bg-primary text-primary-foreground"
                              : "self-start bg-muted text-foreground"
                          }`}
                        >
                          {senderName && (
                            <MessageHeader
                              className={`px-0 font-semibold ${
                                isOwnMessage
                                  ? "text-primary-foreground/80"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {senderName}
                            </MessageHeader>
                          )}
                          <p className="whitespace-pre-wrap break-words text-sm">
                            {message.text}
                          </p>
                          <MessageFooter
                            className={`px-0 ${
                              isOwnMessage
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            <time dateTime={message.createdAt}>
                              {formatMessageTime(message.createdAt)}
                            </time>
                          </MessageFooter>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  );
                })
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>

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

function formatMessageDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameLocalDate(date, today)) return "Today";
  if (isSameLocalDate(date, yesterday)) return "Yesterday";

  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: date.getFullYear() === today.getFullYear() ? undefined : "numeric",
  }).format(date);
}

function isSameLocalDate(first: Date, second: Date) {
  if (Number.isNaN(first.getTime()) || Number.isNaN(second.getTime())) {
    return false;
  }

  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
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
