import Image from "next/image";
import { RouteGuard } from "@/components/auth/route-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="dark min-h-screen bg-background text-foreground"
      style={{ colorScheme: "dark" }}
    >
      <RouteGuard mode="guest">
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8 lg:flex-row lg:justify-start lg:px-0 lg:py-0">
          <div className="relative z-30 flex w-full max-w-md justify-center lg:max-w-none lg:flex-1">
            {children}
          </div>

          <Image
            src="/background/background3.png"
            alt="bg-image"
            width={1122}
            height={1402}
            className="z-10 hidden h-screen w-1/2 object-cover lg:block lg:flex-none"
          />
          <div className="absolute inset-0 z-20 hidden bg-linear-to-l from-transparent via-background to-transparent lg:block" />
        </div>
      </RouteGuard>
    </div>
  );
}
