"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
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

type ResetStep = "email" | "otp" | "password";

const steps: { id: ResetStep; label: string }[] = [
  { id: "email", label: "Email" },
  { id: "otp", label: "Verify" },
  { id: "password", label: "New password" },
];

export function ForgotPasswordForm() {
  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submissionNote, setSubmissionNote] = useState("");

  function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStep("otp");
  }

  function handleOtpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (otp.length === 6) setStep("password");
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordError("");
    setSubmissionNote(
      "The password reset screen is ready. Password updates are not connected yet.",
    );
  }

  const cardContent = {
    email: {
      title: "Forgot your password?",
      description:
        "Enter the email address connected to your Vitravels account to get started.",
    },
    otp: {
      title: "Verify your email",
      description: `Enter the 6-digit code for ${email}.`,
    },
    password: {
      title: "Create a new password",
      description: "Choose a new password for your Vitravels account.",
    },
  }[step];

  return (
    <Card className="relative mx-auto w-full max-w-md overflow-hidden bg-transparent ring-0">
      <ShineBorder shineColor={["#00E5FF", "#008CFF", "#4F46E5", "#8B5CF6"]} />
      <CardHeader>
        <CardTitle>{cardContent.title}</CardTitle>
        <CardDescription>{cardContent.description}</CardDescription>
        <ol
          aria-label="Password reset steps"
          className="flex items-center gap-2 pt-3"
        >
          {steps.map((item, index) => {
            const isCurrent = item.id === step;
            const isComplete = steps.findIndex(({ id }) => id === step) > index;

            return (
              <li
                key={item.id}
                aria-current={isCurrent ? "step" : undefined}
                className="flex flex-1 items-center gap-2"
              >
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    isCurrent || isComplete
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </span>
                <span
                  className={`hidden text-xs sm:inline ${
                    isCurrent
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
                {index < steps.length - 1 && (
                  <span className="h-px flex-1 bg-border" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </CardHeader>

      <CardContent>
        {step === "email" && (
          <form id="forgot-password-email-form" onSubmit={handleEmailSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="forgot-password-email">Email</FieldLabel>
                <Input
                  id="forgot-password-email"
                  name="email"
                  type="email"
                  placeholder="you@vitbhopal.ac.in"
                  autoComplete="email"
                  autoCapitalize="none"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <FieldDescription>
                  A one-time code will be used to verify your account.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        )}

        {step === "otp" && (
          <form id="forgot-password-otp-form" onSubmit={handleOtpSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="forgot-password-otp">
                  Verification code
                </FieldLabel>
                <InputOTP
                  id="forgot-password-otp"
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
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
                <FieldDescription>
                  Enter the 6-digit one-time code to continue.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        )}

        {step === "password" && (
          <form
            id="forgot-password-new-password-form"
            onSubmit={handlePasswordSubmit}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="forgot-password-new-password">
                  New password
                </FieldLabel>
                <Input
                  id="forgot-password-new-password"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  minLength={8}
                  maxLength={50}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setPasswordError("");
                    setSubmissionNote("");
                  }}
                  required
                />
              </Field>
              <Field data-invalid={Boolean(passwordError)}>
                <FieldLabel htmlFor="forgot-password-confirm-password">
                  Confirm new password
                </FieldLabel>
                <Input
                  id="forgot-password-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter your new password"
                  minLength={8}
                  maxLength={50}
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setPasswordError("");
                    setSubmissionNote("");
                  }}
                  aria-invalid={Boolean(passwordError)}
                  required
                />
                {passwordError && <FieldError>{passwordError}</FieldError>}
              </Field>
            </FieldGroup>
          </form>
        )}

        {submissionNote && (
          <output className="mt-4 text-sm text-muted-foreground">
            {submissionNote}
          </output>
        )}
      </CardContent>

      <CardFooter>
        <Field
          orientation="horizontal"
          className="flex-col items-stretch gap-3 sm:flex-row sm:items-center"
        >
          {step !== "email" && (
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer sm:w-auto"
              onClick={() => {
                setSubmissionNote("");
                setStep(step === "password" ? "otp" : "email");
              }}
            >
              Back
            </Button>
          )}
          {step === "email" && (
            <Button
              type="submit"
              form="forgot-password-email-form"
              className="w-full cursor-pointer sm:w-auto"
            >
              Continue
            </Button>
          )}
          {step === "otp" && (
            <Button
              type="submit"
              form="forgot-password-otp-form"
              disabled={otp.length !== 6}
              className="w-full cursor-pointer sm:w-auto"
            >
              Continue
            </Button>
          )}
          {step === "password" && (
            <Button
              type="submit"
              form="forgot-password-new-password-form"
              className="w-full cursor-pointer sm:w-auto"
            >
              Reset password
            </Button>
          )}
          <FieldDescription className="text-center sm:ml-auto sm:text-left">
            <Link href="/auth/login">Back to login</Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  );
}
