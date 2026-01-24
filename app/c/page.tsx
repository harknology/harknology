import { classes } from "$/util/db/schema";
import { db } from "$/util/db/db";
import { auth } from "@clerk/nextjs/server";
import { authorized } from "$/util/db/classes";
import UserProfile, { UserProfileDisplay } from "$/components/user-profile";
import { input } from "$/styles/forms";
import { Suspense } from "react";
import { revalidatePath } from "next/cache";
import { cardList, card } from "@/shared/styles/cards";

export function ClassCard({ cls }: { cls: typeof classes.$inferSelect }) {
  return (
    <a {...card(cls.color!)} href={`/c/${cls.id}`}>
      <h2 className="font-bold">{cls.name}</h2>
      <Suspense
        fallback={
          <div className="size-6 rounded-full border border-neutral-500" />
        }
      >
        <UserProfile userId={cls.teacher} />
      </Suspense>
      <p>{cls.description}</p>
    </a>
  );
}

export default async function Home() {
  const me = await auth();
  const myClasses = await db
    .select()
    .from(classes)
    .where(authorized(me.userId!));

  async function createClass(data: FormData) {
    "use server";
    const me = await auth();
    await db.insert(classes).values({
      teacher: me.userId!,
      name: data.get("name")!.toString(),
      description: data.get("description")?.toString(),
    });
    revalidatePath("/");
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-2">Classes</h1>
      <div className={cardList}>
        {myClasses.map((cls) => (
          <ClassCard cls={cls} key={cls.id} />
        ))}

        <form {...card()} action={createClass}>
          <input
            type="text"
            className={`${input} block border-dashed`}
            placeholder="Name"
            name="name"
          />
          <textarea
            className={`${input} border-dashed`}
            placeholder="Description"
            name="description"
          />
          <button type="submit" className="cursor-pointer">
            Create
          </button>
        </form>
      </div>
    </>
  );
}
