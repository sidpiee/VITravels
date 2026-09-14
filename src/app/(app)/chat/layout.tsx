import type { ReactNode } from "react";

import ChatSidebar from "@/components/chat/chat-sidebar";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-20 flex min-h-dvh flex-col gap-5 px-5 pb-5 lg:flex-row">
      <ChatSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
