import { classes } from "$/util/db/schema";
import { db } from "$/util/db/db";
import { auth } from "@clerk/nextjs/server";
import { authorized, recentlyActive } from "$/util/db/classes";
import UserProfile, { UserProfileDisplay } from "$/components/user-profile";
import { input } from "$/styles/forms";
import { Suspense } from "react";
import { revalidatePath } from "next/cache";
import { cardList, card } from "$/styles/cards";
import { ClassCard } from "./c/page";

export default async function Home() {
  const me = await auth();
  const recentActivity = await db
    .select()
    .from(classes)
    .where(authorized(me.userId!))
    .orderBy(recentlyActive)
    .limit(10);

  return (
    <>
      <h1 className="text-xl font-bold mb-2">Recent Activity</h1>
      {recentActivity.map((cls) => (
        <ClassCard cls={cls} key={cls.id} />
      ))}
    </>
  );
}
