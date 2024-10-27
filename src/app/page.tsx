"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import GradualSpacing from "@/components/ui/gradual-spacing";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex items-center justify-center min-h-[700px]">
      <div className="text-center space-y-2">
      <DotPattern
          className={cn(
            "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
          )}
        />
        <GradualSpacing
          className="font-display text-center text-4xl font-bold -tracking-widest  text-black dark:text-white md:text-7xl md:leading-[5rem]"
          text="Create Your Trip Requirement"
          delayMultiple={0.15}
        />

        <div>
          <Link href={session ? "/user/requirement" : "/login"}>
            <GradualSpacing
              className="font-display text-center text-4xl font-bold -tracking-widest  text-red-500 dark:text-white md:text-7xl md:leading-[5rem] hover:underline"
              text="Here"
              delayMultiple={1.4}
            />            
          </Link>
        </div>
        
      </div>
    </main>
  );
}
