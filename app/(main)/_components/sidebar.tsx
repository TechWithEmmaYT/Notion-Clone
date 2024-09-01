/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeft, MenuIcon, SquarePlusIcon } from "lucide-react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { ElementRef, Fragment, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import MenuList from "./menu-list";
import UserItem from "./user-item";

const SideBar = () => {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const create = useMutation(api.documents.create);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);

  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;

    let newWidth = e.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.left = `${newWidth}px`;
      navbarRef.current.style.width = `calc(100% - ${newWidth}px)`;
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.width = isMobile ? "0" : "calc(100% - 240px)";
      navbarRef.current.style.left = isMobile ? "100%" : "240px";

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.width = "100%";
      navbarRef.current.style.left = "0";

      setTimeout(() => setIsResetting(false), 300);
    }
  };

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
    <Fragment>
      <aside
        ref={sidebarRef}
        className={cn(
          `group/sidebar h-full bg-secondary overflow-y-auto
         relative flex w-60 flex-col z-[99999]`,
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        {/* {User actions} */}
        <div className="flex items-center justify-between pt-2 px-2">
          <UserItem />
          <div className="flex-shrink-0 flex items-center gap-2">
            <button
              role="button"
              onClick={collapse}
              className={cn(
                `h-6 w-6 flex items-center justify-center text-muted-foreground rounded-sm hover:bg-neutral-200
       dark:hover:bg-neutral-600 transition
       opacity-0 group-hover/sidebar:opacity-100`,
                isMobile && "opacity-100"
              )}
            >
              <ChevronsLeft size="20px" />
            </button>
            <button
              className={`h-6 w-6 flex items-center justify-center text-muted-foreground rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-600 transition`}
              onClick={onCreate}
            >
              <SquarePlusIcon size="20px" />
            </button>
          </div>
        </div>

        {/* {Workspace actions} */}
        <div>
          <MenuList />
        </div>

        {/* {Resizing border} */}
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100
        transition ease-in-out cursor-col-resize absolute h-full w-[3px] bg-primary/10 right-0
        top-0
      "
        />
      </aside>

      {/* {Menu button} */}
      <div
        ref={navbarRef}
        className={cn(
          `absolute top z-[99999] left-60 w-[calc(100%-240px)]`,
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        <div className="bg-transparent py-2 w-full">
          {isCollapsed && (
            <MenuIcon
              size="24px"
              className="w-6 h-6 cursor-pointer text-muted-foreground"
              onClick={resetWidth}
            />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default SideBar;
