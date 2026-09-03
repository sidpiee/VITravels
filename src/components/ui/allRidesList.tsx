"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CalendarDays,
  IndianRupee,
  type LucideIcon,
  MapPin,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ride } from "@/types/ride";
import { RideCard } from "./rides-list";

type RideFilters = {
  from: string;
  destination: string;
  date?: Date;
  availableSeats: string;
  minPrice: string;
  maxPrice: string;
};

const emptyFilters: RideFilters = {
  from: "",
  destination: "",
  date: undefined,
  availableSeats: "",
  minPrice: "",
  maxPrice: "",
};

export default function AllRidesList() {
  const [appliedFilters, setAppliedFilters] =
    useState<RideFilters>(emptyFilters);

  const allRidesQuery = useQuery({
    queryKey: ["all-rides", appliedFilters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (appliedFilters.from) {
        params.set("from", appliedFilters.from);
      }

      if (appliedFilters.destination) {
        params.set("destination", appliedFilters.destination);
      }

      if (appliedFilters.date) {
        params.set("date", format(appliedFilters.date, "yyyy-MM-dd"));
      }

      if (appliedFilters.availableSeats) {
        params.set("availableSeats", appliedFilters.availableSeats);
      }

      if (appliedFilters.minPrice) {
        params.set("minPrice", appliedFilters.minPrice);
      }

      if (appliedFilters.maxPrice) {
        params.set("maxPrice", appliedFilters.maxPrice);
      }

      const queryString = params.toString();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/rides${queryString ? `?${queryString}` : ""}`,
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
          ? "flex min-h-screen flex-col items-center justify-center gap-5 pb-10 px-6"
          : "mt-20 flex flex-col items-start gap-6 px-6 pb-10 pt-8",
      )}
    >
      {isEmptyState ? (
        <>
          <FilterBox onApply={setAppliedFilters} />
          <h1 className="font-heading2 text-3xl font-semibold">
            No rides available{"  "}
            <span className="bg-linear-to-b from-purple-300 to-purple-700 bg-clip-text text-transparent">
              right now!
            </span>
          </h1>
        </>
      ) : (
        <>
          <div className="flex w-full items-center justify-between pr-0 sm:pr-10">
            <p className="bg-linear-to-r from-purple-500 to-purple-700 bg-clip-text font-heading2 text-3xl font-bold text-transparent sm:text-5xl dark:to-purple-300">
              Available rides
            </p>
          </div>
          <FilterBox onApply={setAppliedFilters} />
          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {rides.map((thisRide) => (
              <RideCard variant="available" {...thisRide} key={thisRide._id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

type FilterBoxProps = {
  onApply: (filters: RideFilters) => void;
};

function FilterBox({ onApply }: FilterBoxProps) {
  const locations = [
    "VIT",
    "Bhopal",
    "Bhopal Junction",
    "Bhopal Airport",
    "Sehore",
    "rkmp",
    "Astha",
    "Nadra",
    "Lal Ghati",
    "Indore",
  ];
  const [draftFilters, setDraftFilters] = useState<RideFilters>(emptyFilters);

  function updateDraft<K extends keyof RideFilters>(
    key: K,
    value: RideFilters[K],
  ) {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <section className="w-full rounded-md border border-purple-300/70 bg-card/60 p-4 shadow-xl shadow-purple-500/10 backdrop-blur-xl dark:border-purple-800/70">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 ring-1 ring-purple-500/20 dark:text-purple-300">
            <SlidersHorizontal className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-heading2 text-lg font-semibold text-foreground">
              Find a ride
            </h2>
            <p className="text-sm text-muted-foreground">
              Select filters to refine your search
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2">
        <LocationCombobox
          label="From"
          placeholder="Choose origin"
          icon={MapPin}
          items={locations}
          value={draftFilters.from}
          onChange={(value) => updateDraft("from", value)}
        />

        <LocationCombobox
          label="Destination"
          placeholder="Choose destination"
          icon={MapPin}
          items={locations}
          value={draftFilters.destination}
          onChange={(value) => updateDraft("destination", value)}
        />

        <FilterField label="Date" icon={CalendarDays}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                aria-label="Ride date"
                className="h-7 w-full justify-start rounded-none border-0 bg-transparent px-0 text-left text-sm font-normal shadow-none hover:bg-transparent focus-visible:ring-0 sm:w-auto"
              >
                {draftFilters.date ? (
                  format(draftFilters.date, "dd MMM yyyy")
                ) : (
                  <span className="text-muted-foreground">Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={draftFilters.date}
                onSelect={(date) => updateDraft("date", date)}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </FilterField>

        <FilterField label="Seats" icon={Users}>
          <Input
            type="number"
            min="1"
            max="8"
            placeholder="Any"
            aria-label="Available seats"
            value={draftFilters.availableSeats}
            onChange={(event) =>
              updateDraft("availableSeats", event.target.value)
            }
            className="h-7 rounded-none border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0 sm:w-12"
          />
        </FilterField>

        <FilterField label="Price range" icon={IndianRupee}>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              placeholder="Min"
              aria-label="Minimum price"
              value={draftFilters.minPrice}
              onChange={(event) => updateDraft("minPrice", event.target.value)}
              className="h-7 w-full rounded-xl border-border/70 bg-background/70 px-2 shadow-none focus-visible:ring-0 sm:w-16"
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="number"
              min="0"
              placeholder="Max"
              aria-label="Maximum price"
              value={draftFilters.maxPrice}
              onChange={(event) => updateDraft("maxPrice", event.target.value)}
              className="h-7 w-full rounded-xl border-border/70 bg-background/70 px-2 shadow-none focus-visible:ring-0 sm:w-16"
            />
          </div>
        </FilterField>

        <Button
          type="button"
          onClick={() => onApply(draftFilters)}
          className="h-9 min-h-0 rounded-xl px-4"
        >
          Apply filters
        </Button>
      </div>
    </section>
  );
}

type LocationComboboxProps = {
  label: string;
  placeholder: string;
  icon: LucideIcon;
  items: string[];
  value: string;
  onChange: (value: string) => void;
};

function LocationCombobox({
  label,
  placeholder,
  icon: Icon,
  items,
  value,
  onChange,
}: LocationComboboxProps) {
  return (
    <FilterField label={label} icon={Icon} className="focus-within:ring-0">
      <Combobox
        items={items}
        value={value || null}
        onValueChange={(nextValue) => onChange(nextValue ?? "")}
      >
        <ComboboxInput
          placeholder={placeholder}
          aria-label={label}
          className="h-7 w-full border-0 bg-transparent shadow-none focus-within:ring-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 [&>input]:bg-transparent [&>input]:px-0 sm:w-auto"
        />
        <ComboboxContent>
          <ComboboxEmpty>No locations found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </FilterField>
  );
}

type FilterFieldProps = {
  label: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
};

function FilterField({
  label,
  icon: Icon,
  children,
  className,
}: FilterFieldProps) {
  return (
    <div
      className={cn(
        "inline-flex w-full max-w-full min-w-0 items-center gap-2 rounded-xl border border-border bg-background/70 px-2 py-1 transition-colors focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-400/20 sm:w-fit",
        className,
      )}
    >
      <Icon
        className="size-3.5 shrink-0 text-purple-500 dark:text-purple-300"
        aria-hidden="true"
      />
      <span className="shrink-0 text-xs font-medium text-muted-foreground">
        {label}:
      </span>
      <div className="min-w-0 flex-1 sm:flex-none">{children}</div>
    </div>
  );
}
