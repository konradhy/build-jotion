import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

const LIST_LIMIT = 15;

export const update = mutation({
  args: {
    room: v.string(),
    user: v.string(),
    data: v.any(),
    picture: v.optional(v.string()),
  },

  handler: async (ctx, { room, user, data, picture }) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user_room", (q) => q.eq("user", user).eq("room", room))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { data, updated: Date.now() });
    } else {
      await ctx.db.insert("presence", {
        user,
        data,
        room,
        updated: Date.now(),
        picture,
      });
    }
  },
});

export const pulse = mutation({
  args: { room: v.string(), user: v.string() },
  handler: async (ctx, { room, user }) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user_room", (q) => q.eq("user", user).eq("room", room))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { updated: Date.now() });
    }
  },
});

export const list = query({
  args: { room: v.string() },
  handler: async (ctx, { room }) => {
    const presence = await ctx.db
      .query("presence")
      .withIndex("by_room_updated", (q) => q.eq("room", room))
      .order("desc")
      .take(LIST_LIMIT);
    return presence.map(({ _creationTime, updated, user, data }) => ({
      created: _creationTime,
      updated,
      user,
      data,
    }));
  },
});
