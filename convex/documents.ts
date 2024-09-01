import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const getDocuments = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
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
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc");

    return _limit ? docs.take(_limit) : docs.collect();
  },
});

export const getFavoriteDocuments = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const favorites = await ctx.db
      .query("favorites")
      .filter((q) => q.eq("userId", userId))
      .collect();
    const favoriteDocIds = favorites.map((fav) => fav.documentId);
    if (favoriteDocIds.length === 0) return [];
    // Retrieve the actual documents using their IDs
    return Promise.all(
      favoriteDocIds.map((docId) =>
        ctx.db
          .get(docId)
          .then((doc) =>
            doc &&
            doc.isArchived === false &&
            doc.parentDocument === (args.parentDocument ?? null)
              ? doc
              : null
          )
      )
    ).then((docs) => docs.filter((doc) => doc !== null));
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
    });

    return doc;
  },
});
