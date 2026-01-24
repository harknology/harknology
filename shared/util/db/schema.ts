import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const classes = sqliteTable("classes", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  teacher: text().notNull(),

  createdAt: int({ mode: "timestamp" }).default(sql`(current_timestamp)`),

  color: text().default("#83e2b6"),
});

export const studentClasses = sqliteTable("studentClasses", {
  studentId: text().notNull(),
  classId: int()
    .notNull()
    .references(() => classes.id),
});

export const joinCodes = sqliteTable("joinCodes", {
  code: text()
    .primaryKey()
    .$defaultFn(() =>
      Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
        .sort(() => Math.random() * 2 - 1)
        .join(""),
    ),
  classId: int()
    .notNull()
    .references(() => classes.id),
});

export const discussions = sqliteTable("discussions", {
  id: int().primaryKey({ autoIncrement: true }),
  classId: int()
    .notNull()
    .references(() => classes.id),

  name: text().notNull(),
  description: text(),

  locked: int().default(0),
  createdAt: int({ mode: "timestamp" }).default(sql`(current_timestamp)`),
});

export const responses = sqliteTable("responses", {
  id: int().primaryKey({ autoIncrement: true }),
  posterId: text().notNull(),
  content: text().notNull(),
  discussionId: int()
    .notNull()
    .references(() => discussions.id),
  createdAt: int({ mode: "timestamp" }).default(sql`(current_timestamp)`),
  updatedAt: int({ mode: "timestamp" })
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});

export const replies = sqliteTable("replies", {
  fromId: int()
    .notNull()
    .references(() => responses.id),
  toId: int()
    .notNull()
    .references(() => responses.id),
});
