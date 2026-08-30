"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { ShineBorder } from "@/components/ui/shine-border";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be at most 20 characters."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(50, "Password cannot exceed 50 characters"),
});

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const loginUserMutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username, password }),
        },
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
      router.replace("/dashboard");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    loginUserMutation.mutate({
      username: data.username,
      password: data.password,
    });
  }

  return (
    <Card className="relative w-full sm:max-w-md bg-transparent overflow-hidden ring-0">
      <ShineBorder shineColor={["#00E5FF", "#008CFF", "#4F46E5", "#8B5CF6"]} />
      <CardHeader>
        <CardTitle>Login Form</CardTitle>
        <CardDescription>
          Login by filling your username and password!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-username">Username</FieldLabel>
                  <Input
                    {...field}
                    id="login-username"
                    aria-invalid={fieldState.invalid}
                    placeholder="ben-dover"
                    autoComplete="username"
                    autoCapitalize="none"
                    disabled={loginUserMutation.isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="login-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Your password"
                    autoComplete="current-password"
                    type="password"
                    disabled={loginUserMutation.isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={loginUserMutation.isPending}
            className="cursor-pointer"
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="login-form"
            disabled={loginUserMutation.isPending}
            className="cursor-pointer"
          >
            Submit
          </Button>
          <FieldDescription>
            New here ? <Link href="/auth/signup">Signup</Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  );
}
