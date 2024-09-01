import React, { Fragment, useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Spinner } from "@/components/spinner";
import { SearchIcon, Trash2, Undo2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConfirmModal from "@/components/modals/confirm-modal";

const TrashBin = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrashDocuments, {});
  const restore = useMutation(api.documents.restoreDocument);
  const remove = useMutation(api.documents.removeDocument);

  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((doc) => {
    return document.title?.toLowerCase().includes(search?.toLowerCase());
  });

  const onClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    docId: string
  ) => {
    e.stopPropagation();
    router.push(`/documents/${docId}`);
  };

  const onRestore = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: Id<"documents">
  ) => {
    e.stopPropagation();
    if (!id) return;
    const response = restore({ id });
    toast.promise(response, {
      loading: "Restoring page...",
      success: "Restored page",
      error: "Failed to restore page",
    });
  };

  const onRemove = (id: Id<"documents">) => {
    if (!id) return;
    const response = remove({ id });
    toast.promise(response, {
      loading: "Removing page...",
      success: "Removed page",
      error: "Failed to remove page",
    });

    if (params.doumentId === id) {
      router.push("/documents");
    }
  };

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Fragment>
      <div className="w-full  text-sm">
        <div className="flex items-center justify-center gap-x-1 p-2">
          <Input
            type="text"
            value={search}
            className="h-8 px-2 focus-visible:ring-1 focus-visible:ring-muted bg-secondary/50 
          placeholder:!text-muted-foreground"
            placeholder="Search pages in Trash"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ScrollArea className="px-1 h-[40vh] pb-2">
          <span
            className="hidden mt-2  last:block text-xs text-center text-muted-foreground
          pb-2"
          >
            No page found
          </span>

          {filteredDocuments?.map((document) => (
            <div
              key={document._id}
              role="button"
              className="text-sm rounded-sm w-full hover:bg-muted
                      flex items-center justify-between text-primary"
              onClick={(e) => onClick(e, document._id)}
            >
              <span className="truncate pl-2">{document.title}</span>
              <div className="flex items-center">
                <button
                  onClick={(e) => onRestore(e, document._id)}
                  className="outline-none rounded-sm p-2 hover:bg-neutral-200"
                >
                  <Undo2 size="1rem" className="text-muted-foreground" />
                </button>
                <ConfirmModal
                  title="Are you sure you want to delete this item?"
                  description="This action cannot be undone"
                  actionColor="!bg-red-500"
                  onConfirm={() => onRemove(document._id)}
                >
                  <button className="outline-none rounded-sm p-2 hover:bg-neutral-200">
                    <Trash2 size="1rem" className="text-muted-foreground" />
                  </button>
                </ConfirmModal>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </Fragment>
  );
};

export default TrashBin;
