"use client";

import React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import MenuItem from "./_common/menu-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { File, Home, Inbox, Search, Settings } from "lucide-react";
import ToolTip from "@/components/tooltip";
import DocumentList from "./_common/document-list";

const MenuList = () => {
  const create = useMutation(api.documents.create);

  const onCreate = async () => {
    const response = create({
      title: "Untitled",
    });
    toast.promise(response, {
      loading: "Creating a new page...",
      success: "New Page Created",
      error: "Failed to create a new page",
    });
  };
  return (
    <div className="w-full  pt-3">
      <div className="px-3">
        <ul className="flex flex-col gap-y-[3px]">
          <li>
            <MenuItem
              isSearch
              label="Search"
              icon={Search}
              paddingLeft="0px"
              onClick={() => {}}
            />
          </li>
          <li>
            <ToolTip
              content={
                <div>
                  <p>View recent pages and more</p>
                  <span>Ctrl+K</span>
                </div>
              }
            >
              <MenuItem
                label="Home"
                icon={Home}
                paddingLeft="0px"
                onClick={() => {}}
              />
            </ToolTip>
          </li>

          <li>
            <MenuItem
              label="Inbox"
              icon={Inbox}
              paddingLeft="0px"
              onClick={() => {}}
            />
          </li>
          <li>
            <MenuItem
              onClick={() => {}}
              label="Settings"
              icon={Settings}
              paddingLeft="0px"
            />
          </li>
        </ul>
      </div>

      <ScrollArea className="mt-2 h-[400px] w-full">
        <div className="w-full px-3">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-muted-foreground truncate text-[13px] font-medium">
              Documents
            </h2>
            <div className="flex items-center gap-x-2">
              <button></button>
            </div>
          </div>
          <div className="mt-0">
            <DocumentList />
          </div>
        </div>
        <div className="mt-3 px-3">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-muted-foreground truncate text-[13px] font-medium">
              Favourite
            </h2>
            <div className="flex items-center gap-x-2">
              <button></button>
            </div>
          </div>
          <ul>
            <li>
              <MenuItem
                onClick={() => {}}
                label="Youtube Script"
                documentIcon=""
                icon={File}
              />
            </li>
          </ul>
        </div>
      </ScrollArea>
    </div>
  );
};

export default MenuList;
