"use client";
import { z } from "zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import * as React from "react";
import { add, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "@/components/ui/time-picker/time-picker";


//requirement validation
const requirementSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  tripMember: z.number().min(0, "Amount of trip member cannont be blank"),
  //trip member will show the list of trip member that user have, can add, delete user
  city: z.string().min(1, "Select a city"),
  arrivalLocation: z.string().min(1, "Select a pickup location"),
  depatureLocation: z.string().min(1, "Select a drop off location"),
  roomType: z.string().min(1, "Room type cannot be blank"),
  breakFast: z.boolean(),
  description: z.string().min(1, "Trip information cannot be blank"),
  submissionTime: z.string().datetime(),
});
type TRequirementSchema = z.infer<typeof requirementSchema>;

//trip location validation
const locationSchema = z.object({
  location: z.array(
    z.object({
      locationCoordinate: z.string(),
      locationDescription: z.string(),
    })
  ),
});
type TLocationSchema = z.infer<typeof locationSchema>;
const initialLocationList: TLocationSchema[] = [];

const onFormSubmit = async (requirement: TRequirementSchema) => {
  
    
  console.log(requirement);
  // console.log(locationList);
};

export default function Requirement() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<TRequirementSchema>({
    resolver: zodResolver(requirementSchema),
  })

  const [locationList, setLocationList] = useState<TLocationSchema[]>(
    () => initialLocationList
  );

  const [startDate, setStartDate] = useState<Date>();
  const handleStartDateSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!startDate) {
      setStartDate(newDay);
      return;
    }
    const diff = newDay.getTime() - startDate.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(startDate, { days: Math.ceil(diffInDays) });
    setStartDate(newDateFull);
  };

  const [endDate, setEndDate] = useState<Date>();
  const handleEndDateSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!endDate) {
      setEndDate(newDay);
      return;
    }
    const diff = newDay.getTime() - endDate.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(endDate, { days: Math.ceil(diffInDays) });
    setEndDate(newDateFull);
  };


  return (
    <div>
      <p className="text-2xl font-semibold">Create Your New Trip Requirement</p>
      <form onSubmit={handleSubmit(onFormSubmit)}>
      
        <div className="grid grid-cols-3">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP HH:mm") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(d) => handleStartDateSelect(d)}
                  initialFocus
                />
                <div className="p-3 border-t border-border">
                  <TimePicker setDate={setStartDate} date={startDate} />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="endDate">End Date</Label>            
              <Popover {...register("endDate")}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP HH:mm") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(d) => handleEndDateSelect(d)}
                    initialFocus
                  />
                  <div className="p-3 border-t border-border">
                    <TimePicker setDate={setEndDate} date={endDate} />
                  </div>
                </PopoverContent>
              </Popover>
            
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
