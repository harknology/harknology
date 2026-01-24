"use client";

import { usePathname } from "next/navigation";
import Home from "./icons/home";
import { PropsWithChildren } from "react";

export default function NavIcon({
  name,
  children,
  path,
}: PropsWithChildren<{
  name: string;
  path: string;
}>) {
  const pathname = usePathname();
  return (
    <a
      className={`flex items-center justify-center rounded-full size-10 p-2 ${(pathname.startsWith(path) && path != "/") || pathname == path ? "bg-white dark:bg-neutral-950 shadow" : ""}`}
      href={path as string}
      key={path as string}
      title={name as string}
    >
      {children}
    </a>
  );
}
