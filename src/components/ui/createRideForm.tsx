"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format, startOfDay } from "date-fns";
import {
  CalendarDays,
  Clock4,
  IndianRupee,
  MapPinHouse,
  UserRound,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "./calendar";

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

const formSchema = z
  .object({
    from: z
      .string()
      .trim()
      .min(2, "Starting location must be at least 2 characters.")
      .max(100, "Starting location must be at most 100 characters."),
    to: z
      .string()
      .trim()
      .min(2, "Destination must be at least 2 characters.")
      .max(100, "Destination must be at most 100 characters."),
    availableSeats: z
      .number({ error: "Enter the number of available seats." })
      .min(1, "At least 1 seat is required.")
      .max(8, "A maximum of 8 seats is allowed.")
      .refine(Number.isInteger, "Seats must be a whole number."),
    rideDate: z.date({ error: "Select a ride date." }),
    rideTime: z
      .string()
      .regex(timePattern, "Use 24-hour time in HH:mm format.")
      .refine(
        (value) =>
          !timePattern.test(value) || Number(value.slice(3)) % 15 === 0,
        "Choose a time in 15-minute intervals.",
      ),
    price: z
      .number({ error: "Enter a price." })
      .min(1, "Price cannot be negative.")
      .refine(Number.isInteger, "Price must be a whole number."),
  })
  .refine((values) => values.from.toLowerCase() !== values.to.toLowerCase(), {
    path: ["to"],
    message: "Starting location and destination must be different.",
  });

type FormValues = z.infer<typeof formSchema>;
type CreateRidePayload = {
  from: string;
  destination: string;
  date: string;
  time: string;
  availableSeats: number;
  price: number;
};

function formatTimeInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export function CreateRideForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from: "",
      to: "",
      rideTime: "",
    },
  });
  const createRideMutation = useMutation({
    mutationFn: async (ride: CreateRidePayload) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/rides/ride`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(ride),
        },
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: () => {
      toast.message("ride created successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  function onSubmit(data: FormValues) {
    createRideMutation.mutate({
      from: data.from,
      destination: data.to,
      date: format(data.rideDate, "yyyy-MM-dd"),
      time: data.rideTime,
      availableSeats: data.availableSeats,
      price: data.price,
    });
  }

  return (
    <Card className="w-full border-0 bg-transparent shadow-none ring-0">
      <CardContent className="p-0">
        <form
          id="create-ride-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full"
        >
          <FieldGroup className="gap-5">
            <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
              <MapPinHouse className="size-8" aria-hidden="true" />
              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                <Controller
                  name="from"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="min-w-0 items-center"
                    >
                      <FieldLabel
                        htmlFor="create-ride-from"
                        className="justify-center"
                      >
                        From
                      </FieldLabel>
                      <Input
                        {...field}
                        id="create-ride-from"
                        aria-invalid={fieldState.invalid}
                        placeholder="Starting location"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="to"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="min-w-0 items-center"
                    >
                      <FieldLabel
                        htmlFor="create-ride-to"
                        className="justify-center"
                      >
                        To
                      </FieldLabel>
                      <Input
                        {...field}
                        id="create-ride-to"
                        aria-invalid={fieldState.invalid}
                        placeholder="Destination"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>

            <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
              <UserRound className="size-7" aria-hidden="true" />
              <Controller
                name="availableSeats"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="w-full max-w-sm"
                  >
                    <FieldLabel htmlFor="create-ride-seats">
                      Available seats
                    </FieldLabel>
                    <Input
                      id="create-ride-seats"
                      type="number"
                      min={1}
                      max={6}
                      step={1}
                      inputMode="numeric"
                      value={field.value ?? ""}
                      onChange={(event) => {
                        const value = event.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value),
                        );
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
              <IndianRupee className="size-7" aria-hidden="true" />
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="w-full max-w-sm"
                  >
                    <FieldLabel htmlFor="create-ride-price">
                      Price per seat
                    </FieldLabel>
                    <Input
                      id="create-ride-price"
                      type="number"
                      min={0}
                      step={1}
                      inputMode="numeric"
                      value={field.value ?? ""}
                      onChange={(event) => {
                        const value = event.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value),
                        );
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
              <Clock4 className="size-7" aria-hidden="true" />
              <Controller
                name="rideTime"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="w-full max-w-sm"
                  >
                    <FieldLabel htmlFor="create-ride-time">
                      Ride time (24-hour)
                    </FieldLabel>
                    <Input
                      {...field}
                      id="create-ride-time"
                      type="text"
                      inputMode="numeric"
                      placeholder="HH:mm"
                      maxLength={5}
                      pattern="[0-9]{2}:[0-9]{2}"
                      autoComplete="off"
                      onChange={(event) =>
                        field.onChange(formatTimeInput(event.target.value))
                      }
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
              <CalendarDays className="size-7" aria-hidden="true" />
              <Controller
                name="rideDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="w-full max-w-sm"
                  >
                    <FieldLabel htmlFor="create-ride-date">
                      Ride date
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="create-ride-date"
                          type="button"
                          variant="outline"
                          aria-invalid={fieldState.invalid}
                          className="w-full justify-start text-left font-normal"
                        >
                          {field.value
                            ? field.value.toLocaleDateString()
                            : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={{ before: startOfDay(new Date()) }}
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="justify-end gap-3 px-0 pt-6">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form="create-ride-form">
          Create ride
        </Button>
      </CardFooter>
    </Card>
  );
}
