"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { createUser } from "@/api/user";
import UserRegister from "@/interface/userRegister";
import { UserGender } from "@/enum/UserGender";

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
import { add, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signUpSchema, TSignUpSchema } from "@/types/zodSchema";

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

  const { setValue } = form;
  const router = useRouter();
  const onRegisterSubmit = async (data: TSignUpSchema) => {
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
    
    try {
      createUser(newUser);    
      console.log("no error");
      router.replace("/login");
      
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof Error && error.message.includes("Email is used")) {        
        alert("Email is used");
        router.replace("/signup");
      }
    } finally{
      // router.replace("/signup");
      form.reset();
    }
  };
  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setValue('birthDate', date);
      
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onRegisterSubmit)}
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
                  <FormMessage className="pl-2" />
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
                      <SelectItem value="Other">Etc.</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="pl-2" />
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
                  <FormMessage className="pl-2" />
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
                    <Input placeholder="Phone Number" {...field} type="tel" pattern="[0-9]*"/>
                  </FormControl>
                  <FormMessage className="pl-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-2 text-base">Birth Date</FormLabel>
                  <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-center text-[14px] font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      aria-label="Select start date and time"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown-buttons"
                      selected={field.value}
                      onSelect={(date) => {
                      console.log(date);

                      handleStartDateChange(date);
                      }}
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      initialFocus
                    />
                    
                    </PopoverContent>
                </Popover>
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
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage className="pl-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-2 text-base">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="pl-2" />
                </FormItem>
              )}
            />
            <div>
              <FormLabel className="pl-2 text-base">
                Confirm Creating Your New Account?
              </FormLabel>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="mt-2"
                >
                  Create Account
                </Button>
                <Button asChild variant={"outline"} className="mt-2">
                  <Link href={"/login"}>Cancel</Link>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
