import { Plus } from "lucide-react";
import { CreateRideForm } from "@/components/ui/createRideForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShimmerButton } from "@/components/ui/shimmer-button";
export default function Rides() {
  return (
    <div className="relative isolate min-h-screen w-full overflow-x-hidden bg-background flex flex-col">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="
      absolute
      left-1/2
      -top-62.5
      h-150
      w-225
      -translate-x-1/2
      rounded-full
      bg-purple-500/25 dark:bg-purple-400/15
      blur-[150px]
    "
        />
      </div>
      <svg
        className="absolute left-0 top-1/2 h-100 w-full -translate-y-1/2 opacity-10"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M-100 150 C 200 70, 400 230, 720 150 S 1200 70, 1540 150"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary"
        />

        <path
          d="M-100 200 C 200 120, 400 280, 720 200 S 1200 120, 1540 200"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
        />

        <path
          d="M-100 250 C 200 170, 400 330, 720 250 S 1200 170, 1540 250"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary"
        />
      </svg>
      <div className="relative z-10 m-20">
        <Dialog>
          <DialogTrigger asChild>
            <ShimmerButton shimmerDuration="2s">
              <span className="flex items-center gap-2">
                Create Ride
                <Plus className="size-4" />
              </span>
            </ShimmerButton>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-2xl">
            <DialogHeader className="flex items-center">
              <DialogTitle>Create a ride</DialogTitle>
            </DialogHeader>

            <CreateRideForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-center items-center h-80">
        <h1 className="font-heading2 font-semibold text-6xl">
          Start creating your{" "}
          <span className="bg-linear-to-b from-purple-300 to-purple-700 bg-clip-text text-transparent">
            rides here!
          </span>
        </h1>
      </div>
    </div>
  );
}
