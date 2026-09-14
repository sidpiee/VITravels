export default async function RideChat({
  params,
}: {
  params: Promise<{ rideId: string }>;
}) {
  const { rideId } = await params;

  return (
    <div className="flex min-h-[70vh] items-center justify-center rounded-3xl border border-border bg-card/70 p-5">
      <p className="text-muted-foreground">Selected ride: {rideId}</p>
    </div>
  );
}
