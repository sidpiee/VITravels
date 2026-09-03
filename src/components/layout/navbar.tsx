"use client";
import { Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import EditNameDialog from "../ui/editNameDialog";
import { LogoutButton } from "../ui/logoutButton";

export function NavMenu() {
  const { setTheme } = useTheme();
  const { data: user } = useCurrentUser();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthPage = pathname === "/auth/login" || pathname === "/auth/signup";
  const mobileLinkClass =
    "flex min-h-11 items-center rounded-2xl px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  useEffect(() => {
    if (pathname) {
      setMobileOpen(false);
    }
  }, [pathname]);

  return (
    <Dialog>
      <div className="relative">
        <div className="hidden md:block">
          <NavigationMenu
            viewport={false}
            className={isAuthPage ? "dark text-foreground" : undefined}
            style={isAuthPage ? { colorScheme: "dark" } : undefined}
          >
            <NavigationMenuList>
              {!isAuthPage && (
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Theme</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <Button
                      className="mb-2 cursor-pointer border border-border"
                      variant={"ghost"}
                      onClick={() => setTheme("light")}
                    >
                      Light <Sun />
                    </Button>
                    <Button
                      variant={"ghost"}
                      className="cursor-pointer border border-border"
                      onClick={() => setTheme("dark")}
                    >
                      Dark <Moon />
                    </Button>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/dashboard">Dashboard</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/rides">My rides</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/bookings">My bookings</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                {user ? (
                  <>
                    <NavigationMenuTrigger>My profile</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="mb-2 w-full cursor-pointer"
                        >
                          Edit name
                        </Button>
                      </DialogTrigger>
                      <LogoutButton />
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    {pathname === "/auth/signup" ? (
                      <Link href="/auth/login">Login</Link>
                    ) : (
                      <Link href="/auth/signup">Signup</Link>
                    )}
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="md:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            className={
              isAuthPage
                ? "dark bg-background/90 text-foreground shadow-lg backdrop-blur-sm"
                : "bg-background/90 shadow-lg backdrop-blur-sm"
            }
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>

          {mobileOpen && (
            <nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              className={`fixed inset-x-3 top-16 rounded-3xl border border-border/70 bg-background/95 p-2 text-foreground shadow-xl backdrop-blur-md ${isAuthPage ? "dark" : ""}`}
            >
              <Link
                href="/"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/rides"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                My rides
              </Link>
              <Link
                href="/bookings"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                My bookings
              </Link>

              {!isAuthPage && (
                <div className="mt-1 border-t border-border/70 pt-2">
                  <p className="px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Theme
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setTheme("light")}
                    >
                      Light <Sun />
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setTheme("dark")}
                    >
                      Dark <Moon />
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-1 border-t border-border/70 pt-2">
                {user ? (
                  <>
                    <p className="px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      My profile
                    </p>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setMobileOpen(false)}
                      >
                        Edit name
                      </Button>
                    </DialogTrigger>
                    <div className="[&>button]:w-full [&>button]:justify-start">
                      <LogoutButton />
                    </div>
                  </>
                ) : (
                  <Link
                    href={
                      pathname === "/auth/signup"
                        ? "/auth/login"
                        : "/auth/signup"
                    }
                    className={mobileLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    {pathname === "/auth/signup" ? "Login" : "Signup"}
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>
      {user && <EditNameDialog currentName={user.user.name} />}
    </Dialog>
  );
}
