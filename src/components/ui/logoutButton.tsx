"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/logout`,
        {
          method: "POST",
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
      toast.success("Logout successful");
      queryClient.clear();
      router.replace("/auth/login");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => logoutMutation.mutate()}
        className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
        disabled={logoutMutation.isPending}
      >
        Logout
      </Button>
    </>
  );
}
