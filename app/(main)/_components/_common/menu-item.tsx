"use client";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, LucideIcon, Plus } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

type MenuItemProps = {
  label: string;
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  paddingLeft?: string;
  onExpand?: () => void;
  onClick: () => void;
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
  onClick,
}: MenuItemProps) => {
  const router = useRouter();
  const create = useMutation(api.documents.create);
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
