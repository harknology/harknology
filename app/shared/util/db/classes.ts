import { and, eq, exists, or } from "drizzle-orm";
import { classes, studentClasses } from "./schema";
import { db } from "./db";

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
