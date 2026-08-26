export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate min-h-screen w-full overflow-x-hidden bg-background flex flex-col">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="
      absolute
      left-1/2
      -top-62.5
      h-150
      w-225
      -translate-x-1/2
      rounded-full
      bg-purple-500/25 dark:bg-purple-400/15
      blur-[150px]
    "
        />
      </div>

      <svg
        className="pointer-events-none fixed left-0 top-1/2 z-0 h-100 w-full -translate-y-1/2 opacity-10"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M-100 150 C 200 70, 400 230, 720 150 S 1200 70, 1540 150"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary"
        />

        <path
          d="M-100 200 C 200 120, 400 280, 720 200 S 1200 120, 1540 200"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
        />

        <path
          d="M-100 250 C 200 170, 400 330, 720 250 S 1200 170, 1540 250"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary"
        />
      </svg>

      {children}
    </div>
  );
}
