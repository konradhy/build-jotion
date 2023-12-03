import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
    editors: v.optional(v.array(v.string())),

  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"])
    .searchIndex("search_content",{searchField:"content",
    filterFields:["userId","isArchived","isPublished"]
  },
    
    ),

  presence: defineTable({
    user: v.string(),
    room: v.string(),
    updated: v.number(),
    data: v.any(),
    picture: v.optional(v.string()),
  })
    .index("by_room_updated", ["room", "updated"])
    .index("by_user_room", ["user", "room"]),
});
