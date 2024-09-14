"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(10, "Password must be at least 10 characters"),
});
type TLoginSchema = z.infer<typeof loginSchema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onLoginSubmit = async (data: TLoginSchema) => {
    console.log(JSON.stringify(data));
  };

  return (
    <div className="grid justify-center mt-10">
      <p className="ml-2 text-3xl font-bold">Log In</p>
      <form onSubmit={handleSubmit(onLoginSubmit)}>
        <label htmlFor="" className="ml-2">Username</label>
        <Input
          {...register("username")}
          type="text"
          placeholder="Username"
          className="w-[300px]"
        />
        {errors.username && <p>{errors.username.message}</p>}

        <label htmlFor="" className="ml-2">Password</label>
        <Input
          {...register("password")}
          type="text"
          placeholder="Password"
          className="w-[300px]"
        />
        {errors.password && <p>{errors.password.message}</p>}

        <Button type="submit">Log In</Button>
      </form>
    </div>
  )
}


// 'use client'

// import { useState } from "react"
// import { Button } from "@/components/ui/button"


// export default function LogIn () {
//   const [heading, setHeading] = useState("Log In")
//   return (
//     <div className="grid justify-center mt-10">
//       <p>{heading}</p>
//       <div>
//         <span>Don't have account yet?</span>
//       </div>
//       <Button variant={"link"}></Button>
//     </div>
//   )
// }