"use client";

import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react";
import Link from "next/link"

export default function Home() {
  const { data: session } = useSession();

  return (
    <main> 
      <span className=" text-lg font-bold text-gray-800">Create Your Trip Requirement</span>
      <Link href={session? "/user/requirement" : "/login" }>
        <Button variant={"link"} className="text-lg font-bold text-red-500">Here</Button>
      </Link>
    </main>
  );
}
