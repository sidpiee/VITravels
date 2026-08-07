// export default function Navbar(){
//     return <>

//     </>
// }

"use client";

import * as React from "react";
import Link from "next/link";
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
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";

export function NavMenu() {
  const { theme, setTheme } = useTheme();
  return (
    <NavigationMenu>
      <NavigationMenuList>
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
        <NavigationMenuItem className="">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/rides">My rides</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/bookings">My bookings</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/dashboard">Dashboard</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
