"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  IndianRupee,
  Plus,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ride } from "@/types/ride";
import { Button } from "./button";
import { Card } from "./card";
import { CreateRideForm } from "./createRideForm";
import { Progress } from "./progress";
import { ShimmerButton } from "./shimmer-button";

export default function RidesList() {
  const rideQuery = useQuery({
    queryKey: ["my-rides"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/rides/my-rides`,
        {
          credentials: "include",
        },
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      return res.json();
    },
  });

  const rides: ride[] = rideQuery.data?.rides ?? [];
  const isEmptyState = rideQuery.isSuccess && rides.length === 0;

  return (
    <div
      className={cn(
        "relative z-10 w-full",
        isEmptyState
          ? "flex min-h-110 flex-col items-center justify-center gap-5 pb-10"
          : "flex flex-col items-start gap-6 px-6 pb-10 pt-8 mt-20",
      )}
    >
      {isEmptyState ? (
        <>
          <h1 className="font-heading2 text-3xl font-semibold">
            Start creating your{" "}
            <span className="bg-linear-to-b from-purple-300 to-purple-700 bg-clip-text text-transparent">
              rides here!
            </span>
          </h1>
          <CreateRideDialog />
        </>
      ) : (
        <>
          <div className="flex w-full items-center justify-between pr-15">
            <p className="bg-linear-to-r from-purple-500 to-purple-700 bg-clip-text font-heading2 text-5xl font-bold text-transparent dark:to-white">
              My rides
            </p>
            <CreateRideDialog />
          </div>

          <div className="grid w-full grid-cols-3 gap-3">
            {rides.map((thisRide) => (
              <RideCard key={thisRide._id} {...thisRide} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CreateRideDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ShimmerButton shimmerDuration="2s" shimmerColor="#FFADFF">
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
  );
}

function formatRideDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

function RideCard(rideData: ride) {
  const {
    from,
    destination,
    date,
    time,
    price,
    availableSeats,
    passengers,
    creator,
    _id,
    status,
  } = rideData;
  const queryClient = useQueryClient();
  const occupiedSeats = passengers.length;
  const totalSeats = availableSeats + occupiedSeats;
  const cancelRideMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/rides/rides/${id}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-rides"],
      });
      toast.success("Ride cancelled!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <Card className="group relative w-full max-w-md gap-0 overflow-hidden rounded-3xl border border-border bg-card p-2 text-card-foreground shadow-2xl shadow-ride-accent/20 backdrop-blur-xl">
      <div className="relative overflow-hidden rounded-3xl border-b border-ride-accent-foreground/20 bg-linear-to-br from-ride-gradient-from via-ride-gradient-via to-ride-gradient-to px-6 pb-6 pt-5">
        <div className="absolute -right-12 -top-18 size-48 rounded-full bg-ride-accent-foreground/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 size-40 rounded-full bg-ride-gradient-from/25 blur-3xl" />

        <div className="relative flex items-center justify-end">
          <span className="inline-flex items-center gap-2 rounded-full border border-ride-accent-foreground/30 bg-card/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ride-accent-foreground/85">
            {status} ride
            <span
              className={cn(
                "size-1.5 rounded-full shadow-ride-accent-foreground/70 ",
                status === "active"
                  ? "bg-green-400"
                  : status === "cancelled"
                    ? "bg-red-400"
                    : "bg-sky-400",
              )}
            />
          </span>
        </div>

        <div className="relative mt-8 flex items-end gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-ride-accent-foreground/65">
              From
            </p>
            <h2 className="mt-1 truncate font-heading2 text-2xl font-semibold tracking-tight text-ride-accent-foreground">
              {from}
            </h2>
          </div>

          <div className="mb-2 flex min-w-16 flex-1 items-center gap-2 text-ride-accent-foreground/80">
            <span className="h-px flex-1 bg-ride-accent-foreground/35" />
            <ArrowRight className="size-5 shrink-0" />
            <span className="h-px flex-1 bg-ride-accent-foreground/35" />
          </div>

          <div className="min-w-0 flex-1 text-right">
            <p className="text-xs font-medium text-ride-accent-foreground/65">
              To
            </p>
            <h2 className="mt-1 truncate font-heading2 text-2xl font-semibold tracking-tight text-ride-accent-foreground">
              {destination}
            </h2>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-6 py-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-muted/40 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="size-4 text-ride-accent" />
              Date
            </div>
            <p className="mt-2 text-sm font-medium text-card-foreground/90">
              {formatRideDate(date)}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/40 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock3 className="size-4 text-ride-accent" />
              Departure
            </div>
            <p className="mt-2 text-sm font-medium text-card-foreground/90">
              {time}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-ride-accent/15 text-ride-accent ring-1 ring-ride-accent/20">
              <IndianRupee className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Price per seat</p>
              <p className="mt-0.5 text-lg font-semibold text-card-foreground">
                ₹{price}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-ride-accent">
              <Users className="size-4" />
              <span className="text-sm font-semibold">
                {availableSeats} seats left
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {totalSeats} seats total
            </p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Ride capacity</span>
            <span className="font-medium text-card-foreground/75">
              {occupiedSeats}/{totalSeats} filled
            </span>
          </div>
          <Progress
            value={(occupiedSeats / totalSeats) * 100}
            className="h-1"
          />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-ride-gradient-from to-ride-gradient-to font-heading2 text-sm font-semibold text-ride-accent-foreground ring-2 ring-ride-accent/20">
              {creator.name ? creator.name.charAt(0) : "Y"}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created by</p>
              <p className="text-sm font-medium text-card-foreground/90">
                {creator.name ?? "You"}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-2">
            <Button
              variant="destructive"
              className="px-3 py-1.5 cursor-pointer"
              onClick={() => cancelRideMutation.mutate(_id)}
              disabled={cancelRideMutation.isPending || status !== "active"}
            >
              Cancel Ride
            </Button>

            <div className="h-5 w-px bg-border" aria-hidden="true" />

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={status !== "active"}
                  className="cursor-pointer border-ride-accent bg-transparent px-3 py-1.5 text-ride-accent transition-colors duration-200 ease-out hover:border-ride-action-hover-border hover:bg-ride-action-hover hover:text-ride-action-hover-foreground dark:hover:border-ride-action-hover-border dark:hover:bg-ride-action-hover dark:hover:text-ride-action-hover-foreground"
                >
                  Edit
                </Button>
              </DialogTrigger>

              <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-2xl">
                <DialogHeader className="flex items-center">
                  <DialogTitle>Update your ride</DialogTitle>
                </DialogHeader>

                <CreateRideForm ride={rideData} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </Card>
  );
}
