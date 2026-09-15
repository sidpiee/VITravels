"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import type { Booking } from "@/types/booking";
import type { ride } from "@/types/ride";

type MyRidesResponse = {
  rides: ride[];
};

type MyBookingsResponse = {
  bookings: Booking[];
};

export default function ChatSidebar() {
  const ridesQuery = useQuery<MyRidesResponse>({
    queryKey: ["chat-rides"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/rides/my-rides`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? "Could not fetch rides");
      }

      return response.json();
    },
  });
  const bookingsQuery = useQuery<MyBookingsResponse>({
    queryKey: ["chat-bookings"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/bookings/my-bookings`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? "Could not fetch bookings");
      }

      return response.json();
    },
  });

  const ownedActiveRides = (ridesQuery.data?.rides ?? []).filter(
    (rideItem) => rideItem.status === "active",
  );
  const bookedActiveRides = (bookingsQuery.data?.bookings ?? [])
    .filter(
      (booking) =>
        booking.status === "confirmed" && booking.ride.status === "active",
    )
    .map((booking) => booking.ride);
  const activeRides = Array.from(
    new Map(
      [...ownedActiveRides, ...bookedActiveRides].map((rideItem) => [
        rideItem._id,
        rideItem,
      ]),
    ).values(),
  );
  const isLoading = ridesQuery.isPending || bookingsQuery.isPending;
  const queryError = ridesQuery.error ?? bookingsQuery.error;
  const queriesSucceeded = ridesQuery.isSuccess && bookingsQuery.isSuccess;

  return (
    <aside className="flex h-fit w-full max-w-xl flex-col gap-3 rounded-3xl border border-border/60 bg-card/80 p-4 shadow-xl shadow-purple-500/5 backdrop-blur-sm sm:p-5">
      <p className="mb-1 bg-linear-to-r from-purple-500 to-purple-700 bg-clip-text font-heading2 text-3xl font-bold text-transparent sm:text-5xl dark:to-purple-300">
        My Chats
      </p>

      {isLoading && (
        <p className="px-1 text-sm text-muted-foreground">Loading chats...</p>
      )}

      {queryError && (
        <p className="px-1 text-sm text-destructive">{queryError.message}</p>
      )}

      {queriesSucceeded && activeRides.length === 0 && (
        <p className="px-1 text-sm text-muted-foreground">
          You have no active rides yet.
        </p>
      )}

      {activeRides.map((rideItem) => (
        <GroupBox key={rideItem._id} ride={rideItem} />
      ))}
    </aside>
  );
}

function GroupBox({ ride }: { ride: ride }) {
  return (
    <Link
      href={`/chat/${ride._id}`}
      aria-label={`Open chat for ${ride.from} to ${ride.destination}`}
      className="block"
    >
      <article
        data-ride-id={ride._id}
        className="group cursor-pointer rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-500/40 hover:bg-background hover:shadow-lg hover:shadow-purple-500/10"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="min-w-0 truncate font-semibold tracking-tight text-foreground">
            {ride.from} - {ride.destination}
          </p>
          <p className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {ride.passengers.length + 1} members
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="truncate text-sm text-muted-foreground">
            Open chat to see messages
          </p>
          <p className="shrink-0 text-xs text-muted-foreground">
            {formatRideDate(ride.date)}
          </p>
        </div>
      </article>
    </Link>
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
