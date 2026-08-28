import type { ride } from "./ride";

export type Booking = {
  _id: string;
  user: string;
  ride: ride;
  status: "confirmed" | "cancelled";
};
