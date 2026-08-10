"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ShineBorder } from "@/components/ui/shine-border";

import { Spinner } from "./spinner";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(20, "Name must be at most 20 characters."),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be at most 20 characters."),
  email: z
    .email("Invalid email address")
    .trim()
    .regex(
      /^[a-z]+\.2[a-z0-9]{4}10[a-z0-9]{3}@vitbhopal\.ac\.in$/i,
      "Use your VIT Bhopal email, e.g. student.2xxxx10xxx@vitbhopal.ac.in.",
    )
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(50, "Password cannot exceed 50 characters"),
});
type User = {
  email: string;
  username: string;
  name: string;
  password: string;
};
export function SignupForm() {
  const [sentOTP, setSentOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });
  const saveUserMutation = useMutation({
    mutationFn: async (User: User) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(User),
        },
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: () => {
      toast.message("User created successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const sendOTPMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: () => {
      setSentOTP(true);
      toast.message("otp sent successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: async ({ User, otp }: { User: User; otp: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: User.email, otp }),
        },
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      saveUserMutation.mutate(variables.User);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    sendOTPMutation.mutate(data.email);
  }
  function handleVerifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter a valid 6-digit OTP.");
      return;
    }
    const signupData = form.getValues();
    const addUser: User = {
      email: signupData.email,
      name: signupData.name,
      username: signupData.username,
      password: signupData.password,
    };
    verifyOTPMutation.mutate({ User: addUser, otp: otp });
  }

  function handleChangeEmail() {
    setSentOTP(false);
    setOtp("");
  }

  return (
    <Card className="relative w-full sm:max-w-md bg-transparent overflow-hidden ring-0">
      <ShineBorder shineColor={["#00E5FF", "#008CFF", "#4F46E5", "#8B5CF6"]} />
      <CardHeader>
        <CardTitle>Signup Form</CardTitle>
        <CardDescription>
          Sign up if its your first time on here!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="signup-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ben Dover"
                    autoComplete="name"
                    disabled={sentOTP}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-username">Username</FieldLabel>
                  <Input
                    {...field}
                    id="signup-username"
                    aria-invalid={fieldState.invalid}
                    placeholder="ben-dover"
                    autoComplete="username"
                    autoCapitalize="none"
                    disabled={sentOTP}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="signup-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="student.2xxxx10xxx@vitbhopal.ac.in"
                    type="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    disabled={sentOTP}
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
                  <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="signup-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Your password"
                    autoComplete="new-password"
                    type="password"
                    disabled={sentOTP}
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
          {sentOTP ? (
            <form
              onSubmit={handleVerifyOtp}
              className="flex flex-col items-center gap-3"
            >
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                inputMode="numeric"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <div className="flex gap-5">
                <Button
                  className="cursor-pointer"
                  type="button"
                  variant="outline"
                  onClick={handleChangeEmail}
                >
                  Change email
                </Button>
                <Button
                  className="cursor-pointer"
                  type="submit"
                  disabled={verifyOTPMutation.isPending}
                >
                  Verify OTP
                </Button>
              </div>
            </form>
          ) : (
            <>
              <Button
                className="cursor-pointer"
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button
                className="cursor-pointer"
                type="submit"
                form="signup-form"
                disabled={sendOTPMutation.isPending}
              >
                {sendOTPMutation.isPending ? <Spinner /> : "Send OTP"}
              </Button>
              <FieldDescription>
                Already a user ? <Link href="/auth/login">Login</Link>
              </FieldDescription>
            </>
          )}
        </Field>
      </CardFooter>
    </Card>
  );
}
