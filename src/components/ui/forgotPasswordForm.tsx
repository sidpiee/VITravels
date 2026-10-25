"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

const emailSchema = z.object({
  email: z
    .email("Invalid email address")
    .trim()
    .regex(
      /^[a-z]+\.2[a-z0-9]{4}10[a-z0-9]{3}@vitbhopal\.ac\.in$/i,
      "Use your VIT Bhopal email, e.g. student.2xxxx10xxx@vitbhopal.ac.in.",
    )
    .toLowerCase(),
});

const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit verification code."),
});

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(50, "Password cannot exceed 50 characters."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type ResetStep = "email" | "otp" | "password";

const steps: { id: ResetStep; label: string }[] = [
  { id: "email", label: "Email" },
  { id: "otp", label: "Verify" },
  { id: "password", label: "New password" },
];

export function ForgotPasswordForm() {
  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState("");
  const [submissionNote, setSubmissionNote] = useState("");

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  function handleEmailSubmit(values: z.infer<typeof emailSchema>) {
    setEmail(values.email);
    setStep("otp");
  }

  function handleEmailValidationError(
    errors: typeof emailForm.formState.errors,
  ) {
    toast.error(errors.email?.message ?? "Invalid email address.");
  }

  function handleEmailContinue() {
    void emailForm.handleSubmit(
      handleEmailSubmit,
      handleEmailValidationError,
    )();
  }

  function handleOtpSubmit() {
    setStep("password");
  }

  function handleOtpContinue() {
    void otpForm.handleSubmit(handleOtpSubmit, handleOtpValidationError)();
  }

  function handleOtpValidationError(errors: typeof otpForm.formState.errors) {
    toast.error(errors.otp?.message ?? "Enter the 6-digit verification code.");
  }

  function handlePasswordSubmit() {
    setSubmissionNote(
      "The password reset screen is ready. Password updates are not connected yet.",
    );
  }

  function handlePasswordContinue() {
    void passwordForm.handleSubmit(
      handlePasswordSubmit,
      handlePasswordValidationError,
    )();
  }

  function handlePasswordValidationError(
    errors: typeof passwordForm.formState.errors,
  ) {
    toast.error(
      errors.newPassword?.message ??
        errors.confirmPassword?.message ??
        "Check your new password.",
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
          <form
            id="forgot-password-email-form"
            noValidate
            onSubmit={emailForm.handleSubmit(
              handleEmailSubmit,
              handleEmailValidationError,
            )}
          >
            <FieldGroup>
              <Controller
                name="email"
                control={emailForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="forgot-password-email">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id="forgot-password-email"
                      type="email"
                      placeholder="you@vitbhopal.ac.in"
                      autoComplete="email"
                      autoCapitalize="none"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={
                        fieldState.invalid
                          ? "forgot-password-email-error"
                          : undefined
                      }
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError
                        id="forgot-password-email-error"
                        errors={[fieldState.error]}
                      />
                    )}
                    <FieldDescription>
                      A one-time code will be used to verify your account.
                    </FieldDescription>
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        )}

        {step === "otp" && (
          <form
            id="forgot-password-otp-form"
            noValidate
            onSubmit={otpForm.handleSubmit(
              handleOtpSubmit,
              handleOtpValidationError,
            )}
          >
            <FieldGroup>
              <Controller
                name="otp"
                control={otpForm.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="forgot-password-otp">
                      Verification code
                    </FieldLabel>
                    <InputOTP
                      id="forgot-password-otp"
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
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
                )}
              />
            </FieldGroup>
          </form>
        )}

        {step === "password" && (
          <form
            id="forgot-password-new-password-form"
            noValidate
            onSubmit={passwordForm.handleSubmit(
              handlePasswordSubmit,
              handlePasswordValidationError,
            )}
          >
            <FieldGroup>
              <Controller
                name="newPassword"
                control={passwordForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="forgot-password-new-password">
                      New password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="forgot-password-new-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      aria-invalid={fieldState.invalid}
                      onChange={(event) => {
                        field.onChange(event);
                        setSubmissionNote("");
                      }}
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={passwordForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="forgot-password-confirm-password">
                      Confirm new password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="forgot-password-confirm-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Re-enter your new password"
                      aria-invalid={fieldState.invalid}
                      onChange={(event) => {
                        field.onChange(event);
                        setSubmissionNote("");
                      }}
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
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
              type="button"
              onClick={handleEmailContinue}
              className="w-full cursor-pointer sm:w-auto"
            >
              Continue
            </Button>
          )}
          {step === "otp" && (
            <Button
              type="button"
              onClick={handleOtpContinue}
              className="w-full cursor-pointer sm:w-auto"
            >
              Continue
            </Button>
          )}
          {step === "password" && (
            <Button
              type="button"
              onClick={handlePasswordContinue}
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
