"use client";

import { useQuery } from "@tanstack/react-query";

export type CurrentUser = {
  _id: string;
  username: string;
  name: string;
  isBlacklisted: boolean;
};

type CurrentUserResponse = {
  user: CurrentUser;
};

export function useCurrentUser() {
  return useQuery<CurrentUserResponse>({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/me`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Unable to fetch current user");
      }

      const data: CurrentUserResponse = await response.json();
      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
