"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator"
import Link from "next/link"


//log-in validation
const logInSchema = z
  .object({
    username: z.string().min(1, "Username cannot be blank"),
    password: z.string().min(8, "Password cannot be blank"),
  })
  .refine(
    (data) =>
      data.password === data.password && data.username === data.username,
    {
      message: "Username or password is incorrect",
    }
  );
type TLogInSchema = z.infer<typeof logInSchema>;

export default function LogIn() {
  const form = useForm<TLogInSchema>({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onLogInSubmit = async (data: TLogInSchema) => {
    console.log(JSON.stringify(data));
    //backend connection
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Log In</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onLogInSubmit)}>
          <div className="grid grid-rows-3 gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-2 text-base">Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Username"
                      className="w-[300px]"
                    />
                  </FormControl>
                  <FormMessage className="pl-2"/>
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
                  <FormMessage className="pl-2"/>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-[300px]">Log In</Button>
          </div>
        </form>
      </Form>
      <Separator />
      <div className="mt-3">
        <span>Doesn't have an account yet? | </span>
        <span>
          <Link href={"sign-up"} className="hover: underline">Sign Up</Link>
        </span>
      </div>
    </div>
  );
}
