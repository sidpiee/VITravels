import ChatConnectionStatus from "@/components/chat/chat-connection-status";

export default async function RideChat({
  params,
}: {
  params: Promise<{ rideId: string }>;
}) {
  const { rideId } = await params;

  return (
    <div className="relative flex flex-col min-h-[70vh] items-start justify-between rounded-3xl border border-border bg-card/70 p-5">
      <p className="text-muted-foreground">Selected ride: {rideId}</p>
      <ChatConnectionStatus rideId={rideId} />
    </div>
  );
}
