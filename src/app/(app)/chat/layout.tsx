import type { ReactNode } from "react";

import ChatSidebar from "@/components/chat/chat-sidebar";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-20 flex h-[calc(100dvh-5rem)] min-h-0 flex-col gap-5 px-5 pb-4 lg:flex-row">
      <ChatSidebar />
      <div className="min-h-0 min-w-0 flex-1">{children}</div>
    </div>
  );
}
