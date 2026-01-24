import { and, asc, desc, eq, exists, lt, lte, max, or, sql } from "drizzle-orm";
import { classes, discussions, responses, studentClasses } from "./schema";
import { db } from "./db";
import { union } from "drizzle-orm/sqlite-core";

export const authorized = (userId: string) =>
  or(
    eq(classes.teacher, userId),
    exists(
      db
        .select()
        .from(studentClasses)
        .where(
          and(
            eq(studentClasses.classId, classes.id),
            eq(studentClasses.studentId, userId),
          ),
        ),
    ),
  );

export const recentlyActive = desc(
  union(
    db
      .select({ createdAt: classes.createdAt })
      .from(classes)
      .where(eq(sql`id`, classes.id)),
    db
      .select({ createdAt: responses.createdAt })
      .from(responses)
      .leftJoin(discussions, eq(discussions.id, responses.discussionId))
      .where(eq(discussions.classId, classes.id)),
  ),
);
