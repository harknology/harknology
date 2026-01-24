import Image from "next/image";
import { classes } from "./shared/util/db/schema";
import { db } from "./shared/util/db/db";
import { auth } from "@clerk/nextjs/server";
import { eq, or } from "drizzle-orm";
import { authorized } from "./shared/util/db/classes";
import UserProfile, {
  UserProfileDisplay,
} from "./shared/components/user-profile";
import { card, grid } from "./shared/styles/core";
import { input } from "./shared/styles/forms";
import { Suspense } from "react";
import { revalidatePath } from "next/cache";

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
      name: data.get("name")!,
      description: data.get("description"),
    });
    revalidatePath("/");
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-2">Classes</h1>
      <div className={grid}>
        {myClasses.map((cls) => (
          <a className={`block ${card}`} key={cls.id} href={`/c/${cls.id}`}>
            <h2 className="font-bold">{cls.name}</h2>
            <Suspense fallback={<UserProfileDisplay />}>
              <UserProfile userId={cls.teacher} />
            </Suspense>
            <p>{cls.description}</p>
          </a>
        ))}

        <form className={`${card} border-dashed gap-3`} action={createClass}>
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
