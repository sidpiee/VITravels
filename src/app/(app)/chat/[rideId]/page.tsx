import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export default async function RideChat({
  params,
}: {
  params: Promise<{ rideId: string }>;
}) {
  const { rideId } = await params;

  return (
    <div className="relative flex flex-col min-h-[70vh] items-start justify-between rounded-3xl border border-border bg-card/70 p-5">
      <p className="text-muted-foreground">Selected ride: {rideId}</p>
      <div className="flex w-full gap-2">
        <Input placeholder="Enter message..." className="flex-1 pr-5"></Input>
        <Button className="shrink-0">
          <Send></Send>
        </Button>
      </div>
    </div>
  );
}
