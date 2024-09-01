"use client";
import React, { Fragment, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileIcon, MoreHorizontalIcon } from "lucide-react";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import MenuItem from "./menu-item";
import { cn } from "@/lib/utils";

type PropsType = {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
  hasFavorite?: boolean;
};

const DocumentList: React.FC<PropsType> = ({
  parentDocumentId,
  hasFavorite = false,
  level = 0,
}) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const documents = useQuery(api.documents.getDocuments, {
    parentDocument: parentDocumentId,
    favoriteOnly: hasFavorite,
    limit: 10,
  });

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (documents === undefined) {
    return (
      <>
        <MenuItem.Skeleton level={level} />
        {level == 0 && (
          <>
            <MenuItem.Skeleton level={level} />
            <MenuItem.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  console.log(documents);

  return (
    <Fragment>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          `hidden text-sm font-normal text-muted-foreground/80 py-1`,
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No pages inside
      </p>

      {documents.map((document) => (
        <div key={document._id}>
          <MenuItem
            id={document._id}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            isFavorite={document.isFavorite}
            expanded={expanded[document._id]}
            level={level}
            onClick={() => onRedirect(document._id)}
            onExpand={() => onExpand(document._id)}
            paddingLeft={level === 0 ? "0px" : "12px"}
          />

          {/* {Recursive Datastructure} */}
          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={level + 1} />
          )}
        </div>
      ))}

      {documents?.length === 10 && (
        <MenuItem
          label="More"
          icon={MoreHorizontalIcon}
          paddingLeft="0px"
          onClick={() => {}}
        />
      )}
    </Fragment>
  );
};

export default DocumentList;
