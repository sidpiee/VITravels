export type ride = {
  _id: string;
  availableSeats: number;
  from: string;
  destination: string;
  price: number;
  status: "active" | "completed" | "cancelled";
  creator: {
    _id: string;
    name: string;
  };
  time: string;
  date: string;
  passengers: string[];
};
