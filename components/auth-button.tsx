"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="size-8 rounded-full bg-muted animate-pulse" />;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name ?? ""}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span className="hidden sm:block text-sm text-muted-foreground max-w-[120px] truncate">
          {session.user.name ?? session.user.email}
        </span>
        <Button variant="ghost" size="sm" onClick={() => signOut()}>
          ออก
        </Button>
      </div>
    );
  }

  return (
    <Button size="sm" onClick={() => signIn("google")}>
      เข้าสู่ระบบ
    </Button>
  );
}
