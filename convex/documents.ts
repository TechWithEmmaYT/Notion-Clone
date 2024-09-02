import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const getDocuments = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
    favoriteOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const _limit = args.limit || null;
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const docs = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false));

    const filterDocs = args.favoriteOnly
      ? docs.filter((q) => q.eq(q.field("isFavorite"), true)).order("desc")
      : docs.order("desc");
    return _limit ? filterDocs.take(_limit) : filterDocs.collect();
  },
});

export const archive = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const existingDoc = await ctx.db.get(args.id);
    if (!existingDoc) {
      throw new Error("No document found");
    }

    if (existingDoc.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveArchive = async (docId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", docId)
        )
        .collect();
      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });
        await recursiveArchive(child._id);
      }
    };

    const doc = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    recursiveArchive(args.id);

    return doc;
  },
});

export const getTrashDocuments = query({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const docs = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return docs;
  },
});

export const restoreDocument = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const existingDoc = await ctx.db.get(args.id);
    if (!existingDoc) {
      throw new Error("No document found");
    }

    if (existingDoc.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveRestore = async (docId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", docId)
        )
        .collect();
      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });
        await recursiveRestore(child._id);
      }
    };
    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };
    if (existingDoc.parentDocument) {
      const parentDoc = await ctx.db.get(existingDoc.parentDocument);
      if (parentDoc?.isArchived) {
        options.parentDocument = undefined;
      }
    }
    const docs = await ctx.db.patch(args.id, options);

    recursiveRestore(args.id);

    return docs;
  },
});

export const removeDocument = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDoc = await ctx.db.get(args.id);
    if (!existingDoc) {
      throw new Error("No document found");
    }

    if (existingDoc.userId !== userId) {
      throw new Error("Unauthorized");
    }
    const doc = await ctx.db.delete(existingDoc._id);
    return doc;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const doc = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
      isFavorite: false,
    });

    return doc;
  },
});

export const toggleFavourite = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    // Check if the document exists
    const existingDoc = await ctx.db.get(args.id);
    if (!existingDoc) {
      throw new Error("No document found");
    }

    if (existingDoc.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const existingFavorite = existingDoc.isFavorite;
    const doc = await ctx.db.patch(args.id, {
      isFavorite: !existingFavorite,
    });
    return doc;
  },
});

export const getSearch = query({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const docs = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))

      .order("desc")
      .collect();

    return docs;
  },
});
