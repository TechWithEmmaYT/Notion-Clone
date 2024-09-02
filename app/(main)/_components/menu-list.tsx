"use client";

import React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import MenuItem from "./_common/menu-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Home, Inbox, Search, Settings, Trash2, TrashIcon } from "lucide-react";
import ToolTip from "@/components/tooltip";
import DocumentList from "./_common/document-list";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearch } from "@/hooks/use-search";
import TrashBin from "./_common/trash-bin";
import SettingDialog from "./_common/setting-dialog";

const MenuList = ({ isMobile }: { isMobile: boolean }) => {
  const create = useMutation(api.documents.create);
  const onOpen = useSearch((store) => store.onOpen);

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
              onClick={onOpen}
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
            <SettingDialog>
              <MenuItem label="Settings" icon={Settings} paddingLeft="0px" />
            </SettingDialog>
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
              Favorite
            </h2>
          </div>
          <div className="mt-0">
            <DocumentList hasFavorite={true} />
          </div>
        </div>
        <div className="mt-2 px-3">
          <div className="mt-0">
            <Popover>
              <PopoverTrigger className="w-full mt-4">
                <MenuItem
                  //active={true}
                  label="Trash"
                  paddingLeft="0px"
                  icon={Trash2}
                />
              </PopoverTrigger>
              <PopoverContent
                className="
                p-0 pb-1 w-[414px] min-w-[180px] min-h-[40vh]"
                side={isMobile ? "bottom" : "right"}
              >
                <TrashBin />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default MenuList;
