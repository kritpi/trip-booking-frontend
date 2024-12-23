"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { loginUser } from "@/api/user";
import { logInSchema, TLogInSchema } from "@/types/zodSchema";

export default function LogIn() {
  const form = useForm<TLogInSchema>({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      email: "",
      password: "",
    }, //todo: reset the form
  });

  const router = useRouter();

  const onLogInSubmit = async (data: TLogInSchema) => {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
      .then((res) => {
        if (res?.ok === true) {
          router.replace("/user/profile");
          console.log("Successfully logged in");
          console.log(sessionStorage);
        } else {
          console.log("Cannot log in");
          form.reset({ ...form.getValues(), password: "" });
            form.setError("email", {
            type: "manual",
            message: "Invalid email or password",
            });
            form.setError("password", {
            type: "manual",
            message: "Invalid email or password",
            });
        }
      })
      .catch(() => {
        console.log("Login failed");     
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Log In</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onLogInSubmit)}>
          <div className="grid grid-rows-3 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-2 text-base">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Email"
                      className="w-[300px]"
                    />
                  </FormControl>
                  <FormMessage className="pl-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-2 text-base">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="Password"
                      className="w-[300px]"
                    />
                  </FormControl>
                  <FormMessage className="pl-2" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-[300px]">
              Log In
            </Button>
          </div>
        </form>
      </Form>
      <Separator />
      <div className="mt-3">
        <span>Doesn't have an account yet? | </span>
        <span>
          <Link href={"signup"} className="hover: underline">
            Sign Up
          </Link>
        </span>
      </div>
    </div>
  );
}
