'use client'
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

//log-in validation
const logInSchema = z
  .object({
    username: z.string().min(3, "Username Must Be At Least 3 Characters"),
    email: z.string().email(),
    password: z.string().min(8, "Password Must Be At Least 8 Characters"),
  })

export default function LogIn() {
  return(
    <div>Log-in</div>
  )
}