"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { RainbowButton } from "@/components/ui/rainbow-button";

export const Navbar = () => {
  const { data: session } = useSession();
  return (
    <nav className=" bg-white border-gray-200 ">
      <div className=" max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href={"/"} className="flex items-center space-x-3">
          <span className=" text-3xl font-bold">Charin Tour</span>
        </Link>
        <div className="flex justify-normal">
          <Link
            href={"/user/requirement"}
            className="flex items-center space-x-3"
          >
            {/* <RainbowButton className="text-[18px] m-o"> */}

            <Button
              variant="link"
              className=" text-xl active:outline-none text-black"
            >
              Create Requirement
            </Button>
            {/* </RainbowButton> */}
          </Link>
          <div className=" items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="link"
                  className=" text-[20px] active:outline-none text-black"
                >
                  {session?.user?.username || "My Account"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="text-base font-bold">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link href={"/user/profile"}>
                      <span className="text-[15px]">Profile</span>
                      {/* when authenticated */}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                {session?.user ? (
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <a
                        onClick={async () => {
                          await signOut({ callbackUrl: "/" });
                        }}
                      >
                        <span className="text-[15px] text-red-600">
                          Log Out
                        </span>
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                ) : (
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link href={"/login"}>
                        <span className="text-[15px]">Login / Sign-Up</span>
                        {/* when unauthenticated */}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                )}

                <DropdownMenuSeparator />
                {session?.user?.role == "Admin" ? (
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link href={"/admin/requirement-list"}>
                        <span className="text-[15px] text-green-600">
                          Admin Dashboard
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
