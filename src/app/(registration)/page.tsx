"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

//sign-uo validation
const signUpSchema = z
  .object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(10, "Password must be at least 10 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
type TSignUpSchema = z.infer<typeof signUpSchema>; //infer the type of the schema

export default function SignUp() {
  //use-form sign-up
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const onRegisterSubmit = async (data: TSignUpSchema) => {
    //Submit to server
    console.log(JSON.stringify(data));
  };

  return (
    <div className="grid justify-center mt-10">
      <p className="ml-2 text-3xl font-bold">Log In</p>
      <form
        onSubmit={handleSubmit(onRegisterSubmit)}
        className="flex flex-col gap-1"
      >
        <label htmlFor="username" className="ml-2">
          Username
        </label>
        <Input
          {...register("username", {
            required: "Username cannot be blank"
          })}
          type="text"
          placeholder="Username"
          className=" w-[300px]"
        />
        {errors.username && (
          <p className=" text-red-500">{errors.username.message}</p>
        )}

        <label htmlFor="email" className="ml-2">
          Email
        </label>
        <Input
          {...register("email")}
          type="email"
          placeholder="Email"
          className=" w-[300px]"
        />
        {errors.email && (
          <p className=" text-red-500">{errors.email.message}</p>
        )}

        <label htmlFor="password" className="ml-2">
          Password
        </label>
        <Input
          {...register("password")}
          type="password"
          placeholder="Password"
          className=" w-[300px]"
        />
        {errors.password && (
          <p className=" text-red-500">{errors.password.message}</p>
        )}

        <label htmlFor="password" className="ml-2">
          Confirm Password
        </label>
        <Input
          {...register("confirmPassword")}
          type="password"
          placeholder="Password"
          className=" w-[300px]"
        />
        {errors.confirmPassword && (
          <p className=" text-red-500">{errors.confirmPassword.message}</p>
        )}

        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
}
