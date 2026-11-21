import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeDocumentation } from "@/components/home/home-documentation";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* Hero Section */}
      <section className="relative min-h-dvh overflow-hidden flex items-center justify-start px-6 sm:px-10">
        <Image
          src="/background/background2.png"
          alt=""
          fill
          preload
          sizes="100vw"
          className="absolute z-0 object-cover object-[75%_center] md:object-center"
        />
        <div className="relative z-10 flex min-h-dvh items-center justify-start">
          <div className="flex flex-col items-start gap-5">
            <h1 className="font-heading max-w-[20rem] text-3xl leading-tight font-extrabold text-white sm:max-w-xl sm:text-4xl sm:[word-spacing:8px] md:max-w-none">
              <span className="block md:whitespace-nowrap">
                Find your next travel-buddy{" "}
                <span className="bg-linear-to-l from-purple-500 to-white bg-clip-text text-transparent">
                  on
                </span>
              </span>
              <span className="block text-5xl leading-none bg-linear-to-r from-indigo-500 to-indigo-900 bg-clip-text text-transparent sm:text-7xl">
                Vitravels
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                variant="outline"
                className="cursor-pointer border-white/70 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/dashboard">Find a ride</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="cursor-pointer border-white/70 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Cue to Documentation */}
        <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
          <Link
            href="#documentation"
            aria-label="Scroll down to documentation and how it works"
            className="flex flex-col items-center gap-1.5 text-white/80 transition-colors hover:text-white"
          >
            <span className="text-xs font-medium tracking-wider uppercase text-white/90 drop-shadow-sm">
              Documentation & How It Works
            </span>
            <ChevronDown className="h-5 w-5 animate-bounce text-white drop-shadow-sm" />
          </Link>
        </div>
      </section>
      

      {/* In-App Documentation Section */}
      <HomeDocumentation />
    </div>
  );
}
