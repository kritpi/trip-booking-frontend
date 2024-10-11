"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import userPayment from "@/interface/userPayment";
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
import { useEffect, useState } from "react";
import Trip from "@/interface/trip"
import Requirement from "@/interface/requirement";
import { getRequirementById } from "@/api/requirement";
import { getTripFromRequirementId } from "@/api/trip";

const paymentSchema = z.object({
  price: z.string().trim().min(1, "*Price cannot be blank"),
  payDateTime: z.date({ required_error: "*Pay date is required" }),
});
type TPaymentSchema = z.infer<typeof paymentSchema>;

export default function Payment({
  params,
}: {
  params: { requirementId: string };
}) {
  const form = useForm<TPaymentSchema>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      price: "",
    },
  });

  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [tripData, setTripData] = useState<Trip>();

  useEffect(() => {
    getRequirementById(params.requirementId).then((item) => {
      setRequirement(item);
    });
    getTripFromRequirementId(params.requirementId).then((item) => {
      setTripData(item);
    });
  }, [params.requirementId]);

  const router = useRouter();
  const onPaymentSubmit = async (data: TPaymentSchema) => {
    const newPayment: userPayment = {
      price: data.price,
      payDateTime: data.payDateTime,
    };
    console.log(newPayment);
    // createPayment(newPayment);
    form.reset();
    // router.replace("/user/profile");
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
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-3 border rounded-md p-4">
        <div className="px-4 py-4">
          <p className="text-2xl font-bold mb-6">Invoice</p>
          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
          <div className="grid grid-cols-2">
            <div className="grid grid-cols-2">
              <dt>Start Date:</dt>
              <dd>{new Date(
                  tripData?.start_date_time ?? ""
                ).toDateString()}{" "}
              </dd>
            </div>
            <div className="grid grid-cols-2">
              <dt>End Date:</dt>
              <dd>{new Date(
                  tripData?.end_date_time ?? ""
                ).toDateString()}{" "}
              </dd>
            </div>
            <div className="grid grid-cols-2">
              <dt>City:</dt>
              <dd>{tripData?.city}</dd>
            </div>
            <div className="grid grid-cols-2">
              <dt>Trip member:</dt>
              <dd>count trip mem</dd>
            </div>
            <div className="grid grid-cols-2">
              <dt>Hotel:</dt>
              <dd>{tripData?.hotel}</dd>
            </div>
            <div className="grid grid-cols-2">
              <dt>Room:</dt>
              <dd>{tripData?.room_type}</dd>
            </div>
            <div className="grid grid-cols-2">
              <dt>Breakfast:</dt>
              <dd>{tripData?.breakfast_included ? "Yes" : "No"}</dd>
            </div>
            <div className="grid grid-cols-2 col-start-2 mt-20">
              <dt>Price:</dt>
              <dd>{tripData?.price}</dd>
            </div>
            <div className="grid grid-cols-2 col-start-2">
              <dt>Pay onsite:</dt>
              <dd>-{tripData?.price *0.3}</dd>
            </div>
            <div className="grid grid-cols-2 col-start-2">
              <dt className="font-bold">Summary:</dt>
              <dd>{tripData?.price *0.7}</dd>
            </div>
          </div>      
        </div>
      </div>
      <div className="col-span-2 border rounded-md p-4">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold mb-6">Payment</h1>
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
            <form onSubmit={form.handleSubmit(onPaymentSubmit)}>
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
                      <FormLabel className="pl-2 text-base">
                        Pay Date and Time
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
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
                  {/* <Button asChild variant={"outline"} className=" mt-2"><Link href={"/user/profile"}>Cancel</Link></Button> */}             
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
