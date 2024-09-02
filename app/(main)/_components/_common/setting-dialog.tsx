"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MenuItem from "./menu-item";
import {
  BellIcon,
  ExternalLinkIcon,
  GlobeIcon,
  Settings2Icon,
} from "lucide-react";
import Settings from "@/components/settings";
//import { useSettings } from "@/hooks/use-settings";

interface PropsType {
  children: React.ReactNode;
}

type MenuType = "SETTINGS" | "";

const SettingDialog: React.FC<PropsType> = ({ children }) => {
  const { user } = useUser();
  const [selectedMenu, setSelectedMenu] = useState<MenuType>("SETTINGS");

  return (
    <Dialog>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl p-0 w-full min-h-[500px] overflow-hidden">
        <div className="flex h-full items-center">
          <div className="shrink-0 px-2 py-2 w-60 h-full bg-[rgb(247,247,245)] dark:bg-secondary border-r border-black/10">
            <div className="w-full pb-2">
              <h5 className="text-sm pb-1 font-medium text-muted-foreground">
                Account
              </h5>
              <div className="flex items-center gap-x-2">
                <div className="rounded-md bg-secondary p-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.imageUrl} />
                  </Avatar>
                </div>
                <div className="space-y-[0px]">
                  <h5 className="text-sm line-clamp-1 leading-0">
                    {user?.fullName} &lsquo;s
                  </h5>
                  <p className="w-full font-[300] text-gray-500 text-[13px]">
                    subscribe@gmail.com
                    {/* exampple {user?.emailAddresses} */}
                  </p>
                </div>
              </div>
            </div>
            <div className="menu-list mt-1 flex flex-col gap-1">
              <MenuItem
                label="My settings"
                icon={Settings2Icon}
                active={selectedMenu === "SETTINGS"}
                paddingLeft="2px"
              />
              <MenuItem
                label="My notifications"
                icon={BellIcon}
                paddingLeft="2px"
              />
              <MenuItem
                label="My connections"
                icon={ExternalLinkIcon}
                paddingLeft="2px"
              />
              <MenuItem
                label="Language & region"
                icon={GlobeIcon}
                paddingLeft="2px"
              />

              <hr className="border-muted" />
            </div>
          </div>
          <div className="flex-1 h-full pt-3 px-4">
            {selectedMenu === "SETTINGS" && <Settings />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingDialog;
