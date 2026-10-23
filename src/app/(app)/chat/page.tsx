import { MessageCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ChatLandingPage() {
  return (
    <main className="flex h-full min-h-0 w-full items-center justify-center">
      <section className="flex h-full w-full flex-col items-center justify-center rounded-3xl border border-purple-200 bg-purple-50 p-6 text-center shadow-xl shadow-purple-500/10 dark:border-border dark:bg-card/70 dark:shadow-purple-500/5">
        <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-violet-700 text-white shadow-lg shadow-purple-500/20">
          <MessageCircle aria-hidden="true" className="size-7" />
        </div>
        <h1 className="font-heading2 text-2xl font-bold text-foreground sm:text-3xl">
          Choose a ride to open its chat
        </h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Select an active ride from My Chats to view and send messages.
        </p>
        <Button
          asChild
          className="mt-6 border border-black bg-transparent text-black hover:bg-purple-600/50 dark:hover:bg-purple-400/50  hover:text-black dark:border-white dark:bg-transparent dark:text-white  dark:hover:text-white"
        >
          <Link href="/dashboard">Find a ride</Link>
        </Button>
      </section>
    </main>
  );
}
