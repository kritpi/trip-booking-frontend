"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import userPayment from "@/interface/userPayment"
import { Router } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimePicker } from "@/components/ui/time-picker/time-picker";
import Image from "next/image";

const paymentSchema = z.object({
    price: z.string().trim().min(1, "*Price cannot be blank"),
    payDateTime: z.date({ required_error: "*Pay date is required" }),
});
type TPaymentSchema = z.infer<typeof paymentSchema>;

export default function Payment() {
    const form = useForm<TPaymentSchema>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            price: "",
        },
    });

    const router = useRouter();
    const onPaymentSubmit = async (data: TPaymentSchema) => {
        const newPayment: userPayment = {
            price: data.price,
            payDateTime: data.payDateTime,
        };
        console.log(newPayment);
        // createPayment(newPayment);
        form.reset();
        router.replace("/user/profile"); 
    };

    const handleDateSelect = (
        date: Date | undefined,
        onChange: (date: Date) => void
      ) => {
        if (date) {
          onChange(date);
        }
      };

    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Payment</h1>
        <div className="flex justify-center">
            <Image
                className=""
                src="/image/QR.jpg"
                width={200}
                height={200}
                alt=""
            />
        </div>
        <p className="flex justify-center">Nattapat Inkham</p>
        <p className="flex justify-center">KBank 064-3-75552-1</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onPaymentSubmit)}>
                <div className="grid grid-cols-2 gap-6 mt-6">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="pl-2 text-base">Pay Amount</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Pay Amount" {...field} />
                                </FormControl>
                                <FormMessage className="pl-2" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="payDateTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="pl-2 text-base">Pay Date and Time</FormLabel>
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
                                                format(field.value, "PPP HH:mm")
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
                                            onSelect={(date) =>
                                                handleDateSelect(date, field.onChange)
                                              }
                                            disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                        <div className="p-3 border-t border-border">
                                            <TimePicker
                                                setDate={(date) => field.onChange(date)}
                                                date={field.value}
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage className="pl-2" />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 col-start-2 gap-3">
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="mt-2"
                    >
                      Submit
                    </Button>
                    <Button asChild variant={"outline"} className=" mt-2">
                      <Link href={"/user/profile"}>Cancle</Link>
                    </Button>
                    </div>
                </div>
                
          </form>
        </Form>
      </div>
    );
}