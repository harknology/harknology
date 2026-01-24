/* eslint-disable @next/next/no-img-element */
import { clerkClient } from "@clerk/nextjs/server";

export default async function UserProfile({
  userId,
  inline = false,
}: {
  userId: string;
  inline?: boolean;
}) {
  const userInfo = await (await clerkClient()).users.getUser(userId);

  return (
    <UserProfileDisplay
      inline={inline}
      avatar={userInfo.imageUrl}
      email={userInfo.emailAddresses[0]!.emailAddress}
      fname={userInfo.firstName!}
      lname={userInfo.lastName!}
    />
  );
}

/**
 * The display logic for a user profile. Also usable as a Suspense fallback, to ensure the correct dimensions.
 */
export function UserProfileDisplay({
  inline = false,
  avatar,
  email = "",
  fname = "",
  lname = "",
}: {
  inline?: boolean;
  avatar?: string;
  email?: string;
  fname?: string;
  lname?: string;
}) {
  return (
    <div
      className={`flex flex-row items-center gap-2 ${inline ? "inline-flex" : "flex"}`}
    >
      <img
        src={avatar}
        alt={email}
        className="block rounded-full"
        width={24}
        height={24}
      />
      <h5 className="m-0">
        {fname} {lname}
      </h5>
    </div>
  );
}
