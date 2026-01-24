import { authorized } from "@/app/shared/util/db/classes";
import { db } from "@/app/shared/util/db/db";
import { classes } from "@/app/shared/util/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const me = await auth();
  const cls = (
    await db
      .select()
      .from(classes)
      .where(and(eq(classes.id, id), authorized(me.userId!)))
      .limit(1)
  )[0];

  if (!cls) return redirect("/");

  return (
    <>
      <h1 className="text-lg font-bold">{cls.name}</h1>
      <p>{cls.description}</p>
    </>
  );
}
