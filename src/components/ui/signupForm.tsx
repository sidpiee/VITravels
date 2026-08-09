"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
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
import { ShineBorder } from "@/components/ui/shine-border";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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

  function onSubmit(data: z.infer<typeof formSchema>) {
    setSentOTP(true);
    const safeData = {
      name: data.name,
      username: data.username,
      email: data.email,
    };

    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(safeData, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as CSSProperties,
    });
  }
  function handleVerifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
              className="flex items-center gap-3"
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
              <Button className="cursor-pointer" type="submit">
                Verify OTP
              </Button>
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
              >
                Send OTP
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
