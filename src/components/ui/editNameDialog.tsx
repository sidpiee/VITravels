"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function EditNameDialog({
  currentName,
}: {
  currentName: string;
}) {
  const [name, setName] = useState(currentName);
  const nameLength = name.trim().length;
  const queryClient = useQueryClient();
  const changeNameMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/me`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ name }),
        },
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Name changed successfully!");
      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (
      trimmedName.length < 3 ||
      trimmedName.length > 20 ||
      changeNameMutation.isPending
    ) {
      return;
    }

    changeNameMutation.mutate(trimmedName);
  }

  return (
    <DialogContent className="sm:max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your name here. Save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={changeNameMutation.isPending}
              onClick={() => setName(currentName)}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={
              nameLength < 3 || nameLength > 20 || changeNameMutation.isPending
            }
          >
            Save changes
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
