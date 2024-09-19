"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { UserGender } from "@/enum/UserGender";
import UserRegister from "@/interface/userRegister";
import { createUser } from "@/api/user";
//sign-uo validation
const signUpSchema = z
  .object({
    username: z.string().trim().min(1, "*Username cannot be blank"),
    name: z.string().trim().min(1, "*Name cannot be blank"),
    lastName: z.string().trim().min(1, "*Last name cannot be blank"),
    gender: z.enum(Object.values(UserGender) as [string, ...string[]]),
    email: z.string().trim().email("*Wrong email format"),
    phoneNumber: z
      .string()
      .trim()
      .min(10, "*Phone number must be at least 10 characters"),
    birthDate: z.date({ required_error: "*A date of birth is required" }),
    password: z.string().min(8, "*Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "*Passwords must match",
    path: ["confirmPassword"],
  });

type TSignUpSchema = z.infer<typeof signUpSchema>;

export default function SignUp() {
  //use-form sign-up
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    resetField,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      name: "",
      lastName: "",
      gender: undefined,
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onRegisterSubmit = async (data: TSignUpSchema) => {
    console.log(typeof data);

    const newUser: UserRegister = {
      name: data.name,
      lastName: data.lastName,
      gender: data.gender as UserGender,
      email: data.email,
      phoneNumber: data.phoneNumber,
      birthDate: data.birthDate,
      username: data.username,
      password: data.password,
    };
    console.log(newUser);
    createUser(newUser);
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
          {...register("username")}
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