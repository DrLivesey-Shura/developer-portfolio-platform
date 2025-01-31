"use client";
// src/components/dashboard/header.tsx
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
const Header = () => {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-end">
      {session?.user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className=" h-12 w-16 rounded-full">
              <img
                src="/images/default-avatar.png"
                alt={session.user.name || ""}
                className="h-12 object-cover"
              />
              {/* {session.user.image ? (
                <img
                  src="D:\Projects\developer-portfolio-platform\public\images\default-avatar.png"
                  alt={session.user.name || ""}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-medium text-primary">
                    {session.user.name ? (
                      getInitials(session.user.name)
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </span>
                </div>
              )} */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session.user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
};

export default Header;
