"use client";

import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types/booking";
import { RideCard } from "./rides-list";

type BookingListResponse = {
  bookings: Booking[];
};

export default function BookingList() {
  const bookingListQuery = useQuery<BookingListResponse>({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/bookings/my-bookings`,
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
  const bookings = bookingListQuery.data?.bookings ?? [];
  const activeBookings = bookings.filter(
    (booking) => booking.status === "confirmed",
  );
  const isEmptyState =
    bookingListQuery.isSuccess && activeBookings.length === 0;

  return (
    <div
      className={cn(
        "relative z-10 w-full",
        isEmptyState
          ? "flex min-h-screen flex-col items-center justify-center gap-5 px-6 pb-10"
          : "mt-20 flex flex-col items-start gap-6 px-6 pb-10 pt-8",
      )}
    >
      {isEmptyState ? (
        <h1 className="font-heading2 text-3xl font-semibold">
          You have no bookings{"  "}
          <span className="bg-linear-to-b from-purple-300 to-purple-700 bg-clip-text text-transparent">
            yet!
          </span>
        </h1>
      ) : (
        <>
          <div className="flex w-full items-center justify-between pr-0 sm:pr-10">
            <p className="bg-linear-to-r from-purple-500 to-purple-700 bg-clip-text font-heading2 text-3xl font-bold text-transparent sm:text-5xl dark:to-purple-300">
              My bookings
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {activeBookings.map((booking) => (
              <RideCard
                key={booking._id}
                variant="booked"
                {...booking.ride}
                bookingId={booking._id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
