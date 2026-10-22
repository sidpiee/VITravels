import ChatConnectionStatus from "@/components/chat/chat-connection-status";

export default async function RideChat({
  params,
}: {
  params: Promise<{ rideId: string }>;
}) {
  const { rideId } = await params;

  return (
    <div className="relative flex min-h-[70vh] w-full flex-col rounded-3xl border border-purple-200 bg-purple-50 p-5 dark:border-border dark:bg-card/70">
      <ChatConnectionStatus rideId={rideId} />
    </div>
  );
}
