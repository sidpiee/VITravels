import Link from "next/link";
import {
  Car,
  MapPin,
  Calendar,
  Users,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Clock,
  Filter,
  BookOpen,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HomeDocumentation() {
  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description:
        "Sign up with your email and verify your identity with secure OTP verification. Set up your display profile so co-travelers recognize you.",
      icon: Users,
    },
    {
      number: "02",
      title: "Discover or Post a Ride",
      description:
        "Search upcoming journeys using real-time filters (from, to, date, seats, price), or offer your empty seats if you are heading out on the road.",
      icon: Search,
    },
    {
      number: "03",
      title: "Reserve in One Click",
      description:
        "Book your seat immediately. The system automatically updates remaining seat counts and prevents accidental double bookings.",
      icon: CheckCircle2,
    },
    {
      number: "04",
      title: "Coordinate via Live Chat",
      description:
        "Join your ride's dedicated Socket.IO chat room to align on pickup spots, timing adjustments, luggage size, and route stops.",
      icon: MessageSquare,
    },
  ];

  const features = [
    {
      title: "Smart Filter Dashboard",
      description:
        "Search rides by starting location, destination, calendar date, minimum passenger capacity, and price bounds. Filters are edited locally and applied on demand for fast, stutter-free browsing.",
      icon: Filter,
      tag: "Discovery",
    },
    {
      title: "Ride Creator Controls",
      description:
        "Need to drive somewhere? Post a ride in seconds with custom pricing, departure timing, and available capacity. Update details or cancel anytime under My Rides.",
      icon: Car,
      tag: "Host Tools",
    },
    {
      title: "Flexible Booking Hub",
      description:
        "Review all your active reservations in My Bookings. If plans change, cancel an existing booking with a single click, instantly freeing the seat for someone else.",
      icon: BookOpen,
      tag: "Passengers",
    },
    {
      title: "Real-Time OueChat Messaging",
      description:
        "Every active journey is paired with an in-app Socket.IO chat room. Stay connected with your driver and co-passengers before departure without exchanging personal numbers.",
      icon: MessageSquare,
      tag: "Live Socket",
    },
    {
      title: "Profile & Identity Customization",
      description:
        "Manage your personal identity easily. Update your display name right from the navigation bar so companions always know who they're traveling with.",
      icon: ShieldCheck,
      tag: "Security",
    },
    {
      title: "Light & Dark Mode Native",
      description:
        "Tailored for day trips and late-night highway travels alike. Toggle themes smoothly from the navigation menu with full OKLCH color support.",
      icon: Sparkles,
      tag: "UI / UX",
    },
  ];

  return (
    <div id="documentation" className="relative z-10 w-full bg-background text-foreground scroll-mt-20">
      {/* Decorative gradient dividers */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />

      {/* Main Documentation Container */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        
        {/* Section 1: Header & Introduction */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-violet-600 dark:text-violet-400">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Vitravels Platform Guide</span>
          </div>
          <h2 className="mt-4 font-heading2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Everything You Need to Know
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Vitravels connects campus travelers, students, and commuters to share rides, split journey costs, reduce environmental impact, and make new connections.
          </p>
        </div>

        {/* Section 2: How It Works Steps */}
        <div className="mt-16 sm:mt-20">
          <div className="text-center sm:text-left mb-8">
            <h3 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground">
              How It Works
            </h3>
            <p className="text-sm text-muted-foreground">Four simple steps to get from where you are to where you need to be.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="group relative flex flex-col justify-between rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition-all hover:border-violet-500/50 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-2xl font-bold text-muted-foreground/30 group-hover:text-violet-500/40 transition-colors">
                        {step.number}
                      </span>
                    </div>
                    <h4 className="mt-5 text-base font-semibold text-foreground">{step.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Interactive Visual Preview of a Ride Card */}
        <div className="mt-20 rounded-3xl border border-border/80 bg-linear-to-b from-card via-card to-muted/30 p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3 w-3 text-amber-500" /> Live Experience
              </div>
              <h3 className="mt-3 font-heading2 text-2xl font-bold text-foreground sm:text-3xl">
                Clean, Transparent Ride Listings
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Every journey card shows exact departure timings, verified creator tags, origin-destination pins, transparent seat pricing, and real-time seat counters.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-md bg-muted px-2.5 py-1">✓ Anti-Duplicate Booking</span>
                <span className="rounded-md bg-muted px-2.5 py-1">✓ Instant Seats Left Counter</span>
                <span className="rounded-md bg-muted px-2.5 py-1">✓ Integrated OueChat</span>
              </div>
            </div>

            {/* Illustrative Mock Ride Card */}
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-lg">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Active Ride
                    </span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Created by <span className="font-semibold text-foreground">Alex (Verified Host)</span>
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full border-2 border-violet-500 bg-background" />
                      <div className="h-7 w-0.5 bg-border" />
                      <MapPin className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-foreground">VIT Main Campus, Vellore</span>
                      <span className="text-xs text-muted-foreground">Chennai International Airport (MAA)</span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 text-right">
                    <span className="text-2xl font-extrabold text-foreground">₹350</span>
                    <span className="text-xs text-muted-foreground">/ seat</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground sm:grid-cols-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Friday, Nov 27</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>05:30 PM Departure</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 sm:col-span-1">
                    <Users className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                    <span className="font-medium text-foreground">3 seats remaining</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/60 pt-3">
                  <Button variant="outline" size="sm" asChild className="h-8 text-xs cursor-pointer">
                    <Link href="/dashboard">View in Dashboard</Link>
                  </Button>
                  <Button size="sm" asChild className="h-8 bg-violet-600 text-white hover:bg-violet-700 text-xs cursor-pointer">
                    <Link href="/dashboard">Book Seat</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Deep-Dive Feature Grid */}
        <div className="mt-20">
          <div className="text-center sm:text-left mb-8">
            <h3 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground">
              Core Capabilities & Features
            </h3>
            <p className="text-sm text-muted-foreground">Built to give both drivers and riders total control over their journeys.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="rounded-3xl border border-border/70 bg-card shadow-sm transition-all hover:border-violet-500/40">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-foreground">
                        <Icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        {item.tag}
                      </span>
                    </div>
                    <CardTitle className="mt-3 text-lg font-bold text-foreground">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full-Bleed Purple Section: Ready to Travel Together? */}
      <section className="relative w-full overflow-hidden bg-purple-950 text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="absolute inset-0 bg-linear-to-b from-purple-500 via-violet-500 to-purple-700 dark:from-purple-900/50 dark:via-violet-900/60 dark:to-purple-950 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h3 className="font-heading2 text-3xl font-extrabold text-white sm:text-5xl tracking-tight">
            Ready to Travel Together?
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-purple-200/90 leading-relaxed">
            Join other students and commuters. Find an empty seat or share your upcoming drive today.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="cursor-pointer bg-white text-purple-950 hover:bg-purple-50 font-semibold shadow-lg text-sm sm:text-base px-6 h-11"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <span>Browse Available Rides</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="cursor-pointer border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white text-sm sm:text-base px-6 h-11"
            >
              <Link href="/auth/signup">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Band (White / Default Background) */}
      <footer className="w-full bg-background border-t border-border/60 py-8 px-4 sm:px-6 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-6xl flex items-center justify-center">
          <p>© {new Date().getFullYear()} Vitravels. Fast, friendly campus and intercity ride sharing.</p>
        </div>
      </footer>
    </div>
  );
}
