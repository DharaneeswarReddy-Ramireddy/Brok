import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  content: text("content").notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertResumeSchema = createInsertSchema(resumes).pick({
  userId: true,
  name: true,
  content: true,
  fileName: true,
  fileType: true,
  createdAt: true,
});

export const atsScores = pgTable("ats_scores", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id),
  jobDescription: text("job_description").notNull(),
  score: integer("score").notNull(),
  keywords: jsonb("keywords").notNull(),
  suggestions: jsonb("suggestions").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertAtsScoreSchema = createInsertSchema(atsScores).pick({
  resumeId: true,
  jobDescription: true,
  score: true,
  keywords: true,
  suggestions: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

export type InsertAtsScore = z.infer<typeof insertAtsScoreSchema>;
export type AtsScore = typeof atsScores.$inferSelect;
