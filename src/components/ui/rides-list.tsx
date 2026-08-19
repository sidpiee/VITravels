"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  IndianRupee,
  Users,
} from "lucide-react";

import type { ride } from "@/types/ride";
import { Card } from "./card";
import { Progress } from "./progress";

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
  console.log(rideQuery.data);

  return (
    <>
      {rideQuery?.data?.rides?.map((thisRide: ride) => (
        <RideCard key={thisRide._id} {...thisRide} />
      ))}
    </>
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

function RideCard({
  from,
  destination,
  date,
  time,
  price,
  availableSeats,
  passengers,
  creator,
}: ride) {
  const occupiedSeats = passengers.length;
  const totalSeats = availableSeats + occupiedSeats;

  return (
    <Card className="group relative w-full max-w-md gap-0 overflow-hidden rounded-3xl border border-border bg-card p-2 text-card-foreground shadow-2xl shadow-ride-accent/20 backdrop-blur-xl">
      <div className="relative overflow-hidden rounded-3xl border-b border-ride-accent-foreground/20 bg-linear-to-br from-ride-gradient-from via-ride-gradient-via to-ride-gradient-to px-6 pb-6 pt-5">
        <div className="absolute -right-12 -top-18 size-48 rounded-full bg-ride-accent-foreground/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 size-40 rounded-full bg-ride-gradient-from/25 blur-3xl" />

        <div className="relative flex items-center justify-end">
          <span className="inline-flex items-center gap-2 rounded-full border border-ride-accent-foreground/30 bg-card/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ride-accent-foreground/85">
            Active ride
            <span className="size-1.5 rounded-full bg-ride-accent-foreground shadow-ride-accent-foreground/70" />
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

        <div className="flex items-center justify-between border-t border-border pt-4">
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
        </div>
      </div>
    </Card>
  );
}
