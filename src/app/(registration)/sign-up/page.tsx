"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// sign-up validation schema
const signUpSchema = z
  .object({
    username: z.string().trim().min(1, "*Username cannot be blank"),
    name: z.string().trim().min(1, "*Name cannot be blank"),
    lastName: z.string().trim().min(1, "*Last name cannot be blank"),
    gender: z.enum(["Male", "Female", "Etc."]),
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
  const form = useForm<TSignUpSchema>({
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

  const onSignUpSubmit = async (data: TSignUpSchema) => {
    console.log(JSON.stringify(data));
    //backend connection
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSignUpSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-2 text-base">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage className="pl-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-2 text-base">Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage className="pl-2"/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-2 text-base">Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Etc.">Etc.</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="pl-2"/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-2 text-base">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage className="pl-2"/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-2 text-base">Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage className="pl-2"/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="pl-2 text-base">Birth Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[300px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="pl-2"/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-2 text-base">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
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
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage className="pl-2"/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-2 text-base">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="pl-2"/>
                </FormItem>
              )}
            />
            <div>
            <FormLabel className="pl-2 text-base">Confirm Creating Your New Account?</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                <Button type="submit" disabled={form.formState.isSubmitting} className="mt-2">
                  Create Account
                </Button>
                <Button asChild variant={"outline"} className="mt-2">
                  <Link href={"/"}>Cancle</Link>
                  
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
