"use client";

import { useEffect, useState } from "react";
import { useSearch } from "@/hooks/use-search";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { File } from "lucide-react";

const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const docs = useQuery(api.documents.getSearch, {});
  const [isMounted, setIsMounted] = useState(false);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", keyDown);
    return () => document.removeEventListener("keydown", keyDown);
  }, [toggle]);

  const handleSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  if (!isMounted) {
    return;
  }

  return (
    <CommandDialog modal open={isOpen} onOpenChange={onClose}>
      <CommandInput
        className="!border-none "
        placeholder={`Search or ask a question ${user?.fullName}'s Dotion`}
      />
      <CommandList className="min-h-[400px]">
        <CommandEmpty>No result found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {docs?.map((doc) => (
            <CommandItem
              key={doc._id}
              value={`${doc._id}-${doc.title}`}
              title={doc.title}
              onSelect={handleSelect}
            >
              {doc.icon ? (
                <span>{doc.icon}</span>
              ) : (
                <File className="h-4 w-4 mr-2" />
              )}

              <span>{doc.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommand;
