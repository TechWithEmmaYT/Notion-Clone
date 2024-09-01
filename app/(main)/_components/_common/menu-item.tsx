"use client";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  LinkIcon,
  LucideIcon,
  MoreHorizontal,
  Plus,
  StarIcon,
  StarOffIcon,
  TrashIcon,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";

type MenuItemProps = {
  label: string;
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  isFavorite?: boolean;
  level?: number;
  paddingLeft?: string;
  onExpand?: () => void;
  onClick?: () => void;
  icon: LucideIcon;
};
const MenuItem = ({
  id,
  label,
  icon: Icon,
  active,
  expanded,
  isSearch,
  level = 0,
  onExpand,
  paddingLeft = "12px",
  documentIcon,
  isFavorite = false,
  onClick,
}: MenuItemProps) => {
  const router = useRouter();
  const { user } = useUser();
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);
  const favourite = useMutation(api.documents.toggleFavourite);
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onExpand?.(); // since it is optional
  };

  const onCreate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) return;
    const response = create({
      //promise
      title: "Untitled",
      parentDocument: id,
    }).then((documentId) => {
      if (!expanded) onExpand?.();
      //router.push(`/documents/${documentId}`);
    });
    toast.promise(response, {
      loading: "Creating a new page...",
      success: "New Page Created",
      error: "Failed to create a new page",
    });
  };

  const onArchive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) return;
    const response = archive({ id });
    toast.promise(response, {
      loading: "Moving to trash...",
      success: "Moved to trash",
      error: "Failed to archive page",
    });
  };

  const onFavorite = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    isFavorite: boolean
  ) => {
    e.stopPropagation();
    if (!id) return;
    const response = favourite({ id });
    toast.promise(response, {
      loading: `${isFavorite ? "Removing from" : "Adding to"} favorite...`,
      success: `${isFavorite ? "Removed from" : "Added to"} favorite...`,
      error: `Failed to ${isFavorite ? "remove" : "add"} favorite`,
    });
  };

  return (
    <div
      role="button"
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : paddingLeft,
      }}
      className={cn(
        `group min-h-[27px] text-sm py-1 pr-2 w-full
      hover:bg-primary/5 flex items-center text-muted-foreground
      font-medium`,
        active && "bg-primary/5 text-primary"
      )}
      onClick={onClick}
    >
      {!!id && (
        <div
          role="button"
          className="rounded-sm hover:bg-neutral-300
        dark:bg-neutral-600 mr-1"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <span className="shrink-0 h-[18px] !text-[13px] mr-2">
          <Icon size="18px" />
        </span>
      )}
      <span className="truncate text-[14px]">{label}</span>

      {isSearch && (
        <kbd
          className="ml-auto pointer-events-none inline-flex h-5
         select-none items-center gap-1 rounded border bg-muted
         px-1.5 text-[12px] font-medium text-muted-foreground
         opacity-100
        "
        >
          <span className="!text-[9px] mt-[1px]">⌘</span>K
        </kbd>
      )}

      {!!id && (
        <div className=" ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto
               rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem
                className="!cursor-pointer"
                onClick={(e) => onFavorite(e, isFavorite)}
              >
                {isFavorite ? (
                  <StarOffIcon className="h-4 w-4 mr-2" />
                ) : (
                  <StarIcon className="h-4 w-4 mr-2" />
                )}
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="!cursor-pointer">
                <LinkIcon className="h-4 w-4 mr-2" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onArchive} className="!cursor-pointer">
                <TrashIcon className="h-4 w-4 mr-2" />
                Move to Trash
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* { Add Child Page} */}
          <div
            role="button"
            className="opacity-0 group-hover:opacity-100 h-full ml-auto
            rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 
          "
            onClick={onCreate}
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

MenuItem.Skeleton = function ItemSkeleton({
  level,
  paddingLeft = "12px",
}: {
  level?: number;
  paddingLeft?: string;
}) {
  return (
    <div
      className="flex items-center gap-x-2"
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : paddingLeft,
      }}
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};

export default MenuItem;
