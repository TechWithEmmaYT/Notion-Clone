"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";

const EmptyDocument = () => {
  const [loading, setLoading] = useState(false);
  const create = useMutation(api.documents.create);

  const onCreate = async () => {
    setLoading(true);
    const response = create({
      title: "Untitled",
    });
    toast.promise(response, {
      loading: "Creating a new page...",
      success: "New Page Created",
      error: "Failed to create a new page",
    });
    response.finally(() => setLoading(false));
  };

  return (
    <div className="w-full h-screen">
      <div className="w-auto flex flex-col items-center justify-center h-full gap-4">
        <Image
          src="/images/empty-doc.png"
          width={200}
          height={200}
          alt="Empty Page"
          className="-ml-7"
        />
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-medium text-black/80 dark:text-white/80">
            Create a new page
          </h2>
          <Button
            onClick={onCreate}
            disabled={loading}
            variant="default"
            className="min-w-36 max-w-40 my-3 h-auto flex items-center gap-2"
          >
            <div className="flex items-center gap-1">
              <PlusIcon size="20px" />
              <span>New Page</span>
            </div>
            {loading ? <Spinner size="default" /> : null}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyDocument;
