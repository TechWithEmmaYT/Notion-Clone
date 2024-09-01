"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ChevronDownIcon, EllipsisIcon, LogOut } from "lucide-react";

const UserItem = () => {
  const { user } = useUser();
  return (
    <div>
      <div className="flex items-center w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              role="button"
              className="w-full flex items-center text-sm hover:bg-primary/5
               gap-x-2
              "
            >
              <div className="flex-shrink-0 flex-grow-0">
                <Avatar className="h-5 w-5 !rounded-sm">
                  <AvatarImage src={user?.imageUrl} />
                </Avatar>
              </div>
              <div className="w-full text-ellipsis max-w-[70%]">
                <div className="gap-x-1 flex items-center justify-start">
                  <span className="max-w-auto line-clamp-1 font-medium">
                    {user?.fullName}&lsquo;s Dotion
                  </span>
                  <ChevronDownIcon
                    size="20px"
                    className="flex-shrink-0 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-80"
            align="start"
            alignOffset={11}
            forceMount
          >
            <div className="flex flex-col space-y-4 p-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium leading-none text-muted-foreground">
                  {user?.emailAddresses[0].emailAddress}
                </p>
                <button>
                  <EllipsisIcon size="20px" />
                </button>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="rounded-md bg-secondary p-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.imageUrl} />
                  </Avatar>
                </div>
                <div className="space-y-[0px]">
                  <h5 className="text-sm line-clamp-1 leading-0">
                    {user?.fullName} &lsquo;s Dotion
                  </h5>
                  <p className="w-full font-[300] text-gray-500 text-[13px]">
                    Free Plan
                  </p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              className="w-full cursor-pointer text-muted-foreground"
            >
              <SignOutButton>
                <div>
                  <LogOut size="15px" />
                  <span className="ml-2">Log out</span>
                </div>
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default UserItem;
