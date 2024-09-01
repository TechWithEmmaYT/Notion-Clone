import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    icon: v.optional(v.string()),
    isArchived: v.boolean(),
    isPublished: v.boolean(),
    isFavorite: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"]),
  favorites: defineTable({
    userId: v.string(),
    documentId: v.id("documents"),
  }),
});
