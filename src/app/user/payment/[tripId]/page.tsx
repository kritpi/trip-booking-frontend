"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getTripById, patchTrip } from "@/api/trip";
import { editInvoice, getInvoiceByTripId } from "@/api/invoice";
import { getUser } from "@/api/user";
import Trip from "@/interface/trip";
import Invoice from "@/interface/invoice";
import User from "@/interface/user";
import { paymentSchema, TPaymentSchema } from "@/types/zodSchema";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { TimePicker } from "@/components/ui/time-picker/time-picker";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function Payment({ params }: { params: { tripId: string } }) {
  const [tripData, setTripData] = useState<Trip>();
  const [invoiceData, setInvoiceData] = useState<Invoice>();
  const [userData, setUserData] = useState<User>();
  const [onDisable, setOnDisable] = useState(false);

  const form = useForm<TPaymentSchema>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      price: "",
    },
  });

  const router = useRouter();
  useEffect(() => {
    console.log("Trip Id from booking", params.tripId);
    getTripById(params.tripId).then((item) => {
      setTripData(item);
    });

    getInvoiceByTripId(params.tripId).then((item) => {
      setInvoiceData(item);
    });
  }, [params.tripId]);
  useEffect(() => {
    if (invoiceData?.user_id) {
      getUser(invoiceData.user_id).then((name) => {
        setUserData(name);
      });
    }
    if (
      tripData?.status == "Checking payment" ||
      tripData?.status == "Completed" ||
      tripData?.status == "Deposit paid"
    ) {
      setOnDisable(true);
    }
  }, [invoiceData]);
  console.log("Trip Data", tripData);
  console.log("Invoice Data", invoiceData);
  console.log(userData?.name);

  const onPaymentSubmit = async (data: TPaymentSchema) => {
    console.log("Payment Submit Data:", data);
    const editedInvoice = {
      pay_date_time: data.payDateTime,
      pay_price: parseFloat(data.price),
      pay_check_deposit: invoiceData?.pay_check_deposit,
      pay_check_remaining: invoiceData?.pay_check_remaining,
      user_id: invoiceData?.user_id,
      trip_id: invoiceData?.trip_id,
    };
    console.log("Edited Invoice: ", editedInvoice);
    const patchedTrip = {
      status: "Checking payment",
    };
    console.log("Patched Trip", patchedTrip);

    try {
      if (invoiceData?.id && tripData?.id) {
        await editInvoice(invoiceData.id, editedInvoice);
        await patchTrip(tripData.id, patchedTrip);
        form.reset;
        setOnDisable(true);
      } else {
        console.error("Invoice ID or Trip Id is undefined");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateSelect = (
    date: Date | undefined,
    onChange: (date: Date) => void
  ) => {
    if (date) {
      onChange(date);
    }
  };

  const onViewTripClick = () => {
    router.replace(`/user/trip/${tripData?.requirement_id}`);
  };
  

  const onDownLoadClick = async () => {
    const html2pdf = await require("html2pdf.js");
    const element = document.querySelector("#invoice");

    // Define options with higher scale and image adjustments
    const options = {
        margin: 20,
        filename: "invoice.pdf",
        jsPDF: {
            unit: 'pt',
            format: 'a3',
            orientation: 'landscape'
        },
        html2canvas: {
            scale: 3,  // Increase scale to improve quality
            useCORS: true, // Ensures images from other domains are rendered
            
        },
        image: { type: 'jpeg', quality: 1 },
        pagebreak: { mode: ['css', 'legacy'] }
    };

    // Generate PDF with custom font and image adjustments
    html2pdf()
        .set(options)
        .from(element)
        .toPdf()
        .get('pdf')
        .then((pdf:any) => {
            pdf.setFontSize(15);  // Set desired font size
        })
        .save();
};

  return (
    <div>
      <div className="flex flex-row gap-6">
        <div className="flex basis w-7/12 items-center">
          <Card className="w-full h-fit" id="invoice">
            <CardHeader>
              <CardTitle>Invoice</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-rows-2 gap-4">
              <Card>
                <CardHeader>
                  <p className="text-xl font-bold">Deposite Payment</p>
                </CardHeader>
                <CardContent className="grid grid-rows-4 gap-2">
                  <div>
                    <span className="text-base font-bold">Name </span>
                    <span className="text base">{userData?.name} </span>
                    <span className="text base">{userData?.lastName}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <div>
                      <span className="text-base font-bold">
                        Start Trip Date:{" "}
                      </span>
                      <span>
                        {tripData?.start_date_time
                          ? format(new Date(tripData.start_date_time), "PPP")
                          : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-base font-bold">
                        End Trip Date:{" "}
                      </span>
                      <span>
                        {tripData?.start_date_time
                          ? format(new Date(tripData.end_date_time), "PPP")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div>
                      <span className="text-base font-bold">Total Price: </span>
                      <span>฿{tripData?.price}</span>
                    </div>
                    <div>
                      <span className="text-base font-bold">
                        Deposit Price:{" "}
                      </span>
                      <span>฿{((tripData?.price ?? 0) * 0.7).toFixed(2)}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-base font-bold">
                      Payment Status:{" "}
                    </span>
                    {invoiceData?.pay_check_deposit ? (
                      <Badge variant={"outline"} className="text-[12px]">Paid</Badge>
                    ) : (
                      <Badge variant={"destructive"} className="text-[12px]">Unpaid</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <p className="text-xl font-bold">Remaining Payment</p>
                </CardHeader>
                <CardContent className="grid grid-rows-4 gap-2">
                  <div>
                    <span className="text-base font-bold">Name </span>
                    <span className="text base">{userData?.name} </span>
                    <span className="text base">{userData?.lastName}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <div>
                      <span className="text-base font-bold">
                        Start Trip Date:{" "}
                      </span>
                      <span>
                        {tripData?.start_date_time
                          ? format(new Date(tripData.start_date_time), "PPP")
                          : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-base font-bold">
                        End Trip Date:{" "}
                      </span>
                      <span>
                        {tripData?.start_date_time
                          ? format(new Date(tripData.end_date_time), "PPP")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div>
                      <span className="text-base font-bold">Total Price: </span>
                      <span>฿{tripData?.price}</span>
                    </div>
                    <div>
                      <span className="text-base font-bold">
                        Remaining Price:{" "}
                      </span>
                      <span>฿{((tripData?.price ?? 0) * 0.3).toFixed(2)}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-base font-bold">
                      Payment Status:{" "}
                    </span>
                    {invoiceData?.pay_check_remaining ? (
                      <Badge variant={"outline"} className="text-[12px]">Paid</Badge>
                    ) : (
                      <Badge variant={"destructive"} className="text-[12px]">Unpaid</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Label className="text-[14px] text-red-500">
                *Note: The customer must pay the deposit before pay the
                remaining on the trip start date.
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={onViewTripClick} className="my-2">
                  View Your Trip Detail
                </Button>
                <Button onClick={onDownLoadClick} className="my-2" variant={'outline'}>
                  Download Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex basis w-5/12">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-center pb-2">
                <span className="flex justify-center">
                  <Image
                    src="/image/QR.jpg"
                    width={230}
                    height={230}
                    alt="QR Code for payment"
                  />
                </span>
                <p className="flex justify-center">Nattapat Inkham</p>
                <p className="flex justify-center">KBank 064-3-75552-1</p>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onPaymentSubmit)}
                  className="grid grid-rows-3 gap-3"
                >
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="pl-2 text-base">
                          Pay Amount
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Pay Amount"
                            {...field}
                          />
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
                                date > new Date() ||
                                date < new Date("1900-01-01")
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
                  <Button
                    type="submit"
                    disabled={onDisable}
                    className="mt-2 w-full"
                  >
                    Submit
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
