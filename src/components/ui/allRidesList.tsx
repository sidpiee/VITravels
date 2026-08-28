"use client";

import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import type { ride } from "@/types/ride";
import { RideCard } from "./rides-list";

export default function AllRidesList() {
  const allRidesQuery = useQuery({
    queryKey: ["all-rides"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/rides`,
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
  const rides: ride[] = allRidesQuery.data?.rides ?? [];
  const isEmptyState = allRidesQuery.isSuccess && rides.length === 0;

  return (
    <div
      className={cn(
        "relative z-10 w-full",
        isEmptyState
          ? "flex min-h-screen flex-col items-center justify-center gap-5 pb-10"
          : "mt-20 flex flex-col items-start gap-6 px-6 pb-10 pt-8",
      )}
    >
      {isEmptyState ? (
        <h1 className="font-heading2 text-3xl font-semibold">
          No rides available{"  "}
          <span className="bg-linear-to-b from-purple-300 to-purple-700 bg-clip-text text-transparent">
            right now!
          </span>
        </h1>
      ) : (
        <>
          <div className="flex w-full items-center justify-between pr-10">
            <p className="bg-linear-to-r from-purple-500 to-purple-700 bg-clip-text font-heading2 text-5xl font-bold text-transparent dark:to-purple-300">
              Available rides
            </p>
          </div>

          <div className="grid w-full grid-cols-3 gap-3">
            {rides.map((thisRide) => (
              <RideCard variant="available" {...thisRide} key={thisRide._id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
