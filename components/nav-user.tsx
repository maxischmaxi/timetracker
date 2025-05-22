"use client";

import {
  BellIcon,
  ComputerIcon,
  CreditCardIcon,
  LogOutIcon,
  Moon,
  MoreVerticalIcon,
  Sun,
  UserCircleIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { AuthContext, signOut } from "./auth-provider";
import { useRouter } from "next/navigation";
import { UserAvatar } from "./user-avatar";
import { use } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { firebaseUser } = use(AuthContext);
  const { setTheme, theme } = useTheme();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {firebaseUser?.displayName}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {firebaseUser?.email}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {firebaseUser?.displayName}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {firebaseUser?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel style={{ fontSize: 11 }}>
                Colortheme
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Button
                  variant={theme === "system" ? "secondary" : "ghost"}
                  onClick={() => setTheme("system")}
                  className="w-full justify-start border-none shadow-none focus-visible:border-none focus-visible:ring-0"
                  size="sm"
                >
                  <ComputerIcon />
                  System
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  onClick={() => setTheme("light")}
                  variant={theme === "light" ? "secondary" : "ghost"}
                  className="w-full justify-start border-none shadow-none focus-visible:border-none focus-visible:ring-0"
                  size="sm"
                >
                  <Sun />
                  Light
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  onClick={() => setTheme("dark")}
                  variant={theme === "dark" ? "secondary" : "ghost"}
                  className="w-full justify-start border-none shadow-none focus-visible:border-none focus-visible:ring-0"
                  size="sm"
                >
                  <Moon />
                  Dark
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/account">
                  <UserCircleIcon />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/billing">
                  <CreditCardIcon />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/notifications">
                  <BellIcon />
                  Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await signOut();
                router.push("/auth/login");
              }}
            >
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
