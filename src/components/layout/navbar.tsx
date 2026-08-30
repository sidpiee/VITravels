"use client";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
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
  const isAuthPage = pathname === "/auth/login" || pathname === "/auth/signup";
  return (
    <Dialog>
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
                  className="border border-border mb-2 cursor-pointer"
                  variant={"ghost"}
                  onClick={() => setTheme("light")}
                >
                  Light <Sun />
                </Button>
                <Button
                  variant={"ghost"}
                  className="border border-border cursor-pointer"
                  onClick={() => setTheme("dark")}
                >
                  Dark <Moon />
                </Button>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
          <NavigationMenuItem className="">
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
          <NavigationMenuItem className="">
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
      {user && <EditNameDialog currentName={user.user.name} />}
    </Dialog>
  );
}
