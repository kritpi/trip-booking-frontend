"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getInvoiceByTripId, editInvoice } from "@/api/invoice";
import { getUser } from "@/api/user";
import { getTripById, patchTrip } from "@/api/trip";
import Invoice from "@/interface/invoice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import User from "@/interface/user";
import { format } from "date-fns";
import { CheckedState } from "@radix-ui/react-checkbox";
import Trip from "@/interface/trip";
import { CakeSlice } from "lucide-react";

export default function Payment({ params }: { params: { tripId: string } }) {
  const [invoiceData, setInvoiceData] = useState<Invoice>();
  const [userData, setUserData] = useState<User>();
  const [tripData, setTripData] = useState<Trip>();
  const [isDisable, setIsDisable] = useState(false);

  useEffect(() => {
    getInvoiceByTripId(params.tripId).then((item) => {
      setInvoiceData(item);
    });
    getTripById(params.tripId).then((item) => {
      setTripData(item);
    });
  }, [params.tripId]);
  useEffect(() => {
    if (invoiceData) {
      getUser(invoiceData?.user_id).then((item) => {
        setUserData(item);
      });
    }
  }, [invoiceData?.user_id]);
  console.log(invoiceData);
  console.log(userData);

  const handleDepositChange = async (checked: CheckedState) => {
    if (invoiceData) {
      const updatedInvoice = {
        ...invoiceData,
        pay_check_deposit: checked === true,
      };
      await editInvoice(invoiceData.id, updatedInvoice);
      const changeTripStatus = {
        status: "Deposit paid",
      };
      await patchTrip(invoiceData.trip_id, changeTripStatus);
      setInvoiceData(updatedInvoice);
    }
  };

  const handleRemainingChange = async (checked: CheckedState) => {
    if (invoiceData) {
      const updatedInvoice = {
        ...invoiceData,
        pay_check_remaining: checked === true,
      };
      await editInvoice(invoiceData.id, updatedInvoice);
      const changeTripStatus = {
        status: "Completed",
      };
      await patchTrip(invoiceData.trip_id, changeTripStatus);
      setInvoiceData(updatedInvoice);
    }
  };

  const onCancelTrip = async () => {
    const changeTripStatus = {
      status: "Canceled",
    };
    if (invoiceData) {
      await patchTrip(invoiceData.trip_id, changeTripStatus);
    }
    alert("Trip Canceled");
    setIsDisable(true);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Verify payment information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base text-red-500 font-semibold">
            *Check user payment transaction to match this information
          </p>
          <div className="flex flex-row gap-6 justify-between border-1 p-3 rounded-md">
            <div className="">
              <span className="text-xl font-semibold">Name: </span>
              <span className="text-xl">
                {userData?.name} {userData?.lastName}
              </span>
            </div>
            <div>
              <span className="text-xl font-semibold">Payment Date&Time: </span>
              <span className="text-xl">
                {invoiceData?.pay_date_time
                  ? format(new Date(invoiceData?.pay_date_time), "PPPpp")
                  : "N/A"}
              </span>
            </div>
            <div>
              <span className="text-xl font-semibold">Price: </span>
              <span className="text-xl">{invoiceData?.pay_price}</span>
            </div>
          </div>
          <div className="flex flex-row gap-6 justify-center mt-5">
            <div className="pt-2">
              <Checkbox
                id="deposit"
                checked={invoiceData?.pay_check_deposit ? true : false}
                onCheckedChange={handleDepositChange}
              />
              <span className="text-xl font-semibold">
                {" "}
                Deposit Paid (฿
                {tripData?.price ? (tripData.price * 0.7).toFixed(2) : "N/A"})
              </span>
            </div>
            <div className="pt-2">
              <Checkbox
                id="remaining"
                checked={invoiceData?.pay_check_remaining ? true : false}
                onCheckedChange={handleRemainingChange}
              />
              <span className="text-xl font-semibold">
                {" "}
                Remaining Paid (฿
                {tripData?.price ? (tripData.price * 0.3).toFixed(2) : "N/A"})
              </span>
            </div>

            <Button
              variant={"destructive"}
              className="text-[15px] font-semibold"
              onClick={onCancelTrip}
              disabled={isDisable}
            >
              Cancel Trip
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
