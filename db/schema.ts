import { integer, real, sqliteTable, text, index } from "drizzle-orm/sqlite-core";
export const shifts=sqliteTable("shifts",{id:text("id").primaryKey(),date:text("date").notNull(),start:text("start").notNull(),end:text("end").notNull(),userId:text("user_id")},t=>[index("idx_shifts_date").on(t.date),index("idx_shifts_user_date").on(t.userId,t.date)]);
export const userSettings=sqliteTable("user_settings",{userId:text("user_id").primaryKey(),addition:integer("addition").notNull().default(0),base:integer("base").notNull().default(1350),nightMultiplier:real("night_multiplier").notNull().default(1.25),overtimeMultiplier:real("overtime_multiplier").notNull().default(1.25)});

export const weeklyTemplates=sqliteTable("weekly_templates",{userId:text("user_id").primaryKey(),schedule:text("schedule").notNull()});
