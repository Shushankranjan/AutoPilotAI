import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  avatar: text("avatar"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  avatar: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define relationship between users and plans
export const usersRelations = relations(users, ({ many }) => ({
  plans: many(plans)
}));

export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  mood: text("mood").notNull(),
  timeAvailable: text("time_available").notNull(),
  energyLevel: text("energy_level").notNull(),
  priorityTasks: text("priority_tasks").array().notNull(),
  personalGoal: text("personal_goal"),
  planData: jsonb("plan_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlanSchema = createInsertSchema(plans).omit({
  id: true,
  createdAt: true,
});

export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Plan = typeof plans.$inferSelect;

// Define relationship between plans and users
export const plansRelations = relations(plans, ({ one }) => ({
  user: one(users, {
    fields: [plans.userId],
    references: [users.id]
  })
}));

export const planGenerationSchema = z.object({
  mood: z.string(),
  timeAvailable: z.string(),
  energyLevel: z.string(),
  priorityTasks: z.array(z.string()),
  personalGoal: z.string().optional(),
});

export type PlanGenerationInput = z.infer<typeof planGenerationSchema>;

export const planOutputSchema = z.object({
  greeting: z.string(),
  timeline: z.array(z.object({
    startTime: z.string(),
    endTime: z.string(),
    task: z.string(),
    description: z.string().optional(),
    duration: z.number().optional(),
    completed: z.boolean().optional().default(false),
  })),
  motivationalTip: z.string(),
});

export type PlanOutput = z.infer<typeof planOutputSchema>;
