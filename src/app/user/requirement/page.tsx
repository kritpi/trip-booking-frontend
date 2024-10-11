"use client";

import { useForm, Controller, Form } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";
import { add, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { v4 as uuidV4 } from "uuid";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "@/components/ui/time-picker/time-picker";
import { requirementSchema, TRequirementSchema } from "@/types/zodSchema";
import TripMember from "@/interface/tripMember";
import { getMembersByUserId } from "@/api/member ";
import { createRequirement } from "@/api/requirement";
import { useRouter } from "next/navigation";

export default function Requirement() {
  const router = useRouter();
  const { data: session } = useSession();
  const [memberData, setMemberData] = useState<TripMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  useEffect(() => {
    if (session?.user?.id) {
      const data = getMembersByUserId(session.user.id);
      data.then((data) => {
        if (data) {
          setMemberData(data);
        }
      });
    }
  }, [session?.user?.id]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TRequirementSchema>({
    resolver: zodResolver(requirementSchema),
    defaultValues: {
      uuid: uuidV4(),
      startDate: new Date(),
      endDate: new Date(),
      memberList: [],
      city: "",
      arrivalLocation: "",
      departureLocation: "",
      roomType: "",
      breakfast: false,
      description: "",
    },
  });

  const onRequirementFormSubmit = async (requirement: TRequirementSchema) => {
    if (session?.user?.id) {
      const requirementData = {
        requirement: requirement,
        userId: session.user.id,
      };
      console.log(requirementData);
      createRequirement(requirementData);
      router.replace("/");
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

  return (
    <div className=" mx-[80px] p-5">
      {/* <div className="flex flex-col px-15"> */}
      <h1 className="text-2xl font-semibold mb-6">
        Create Your New Trip Requirement
      </h1>
      <form
        onSubmit={handleSubmit(onRequirementFormSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-6 mb-3">
          <div>
            <Label htmlFor="startDate" className="pl-2 text-base">
              Start Date
            </Label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
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
                        format(field.value, "PPP HH:mm")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) =>
                        handleDateSelect(date, field.onChange)
                      }
                      disabled={(date) => date < add(new Date(), { days: 10 })}
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
              )}
            />
            {errors.startDate && (
              <p className="text-sm text-red-500 pl-2 pt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="endDate" className="pl-2 text-base">
              End Date
            </Label>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-center text-[14px] font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      aria-label="Select end date and time"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP HH:mm")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) =>
                        handleDateSelect(date, field.onChange)
                      }
                      disabled={(date) => date < add(new Date(), { days: 10 })}
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
              )}
            />
            {errors.endDate && (
              <p className="text-sm text-red-500 pl-2 pt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        <Label htmlFor="memberList" className="pl-2 text-base">
          Choose Your Trip Member
        </Label>
        <Controller
          name="memberList"
          control={control}
          render={({ field }) => (
            <div className="overflow-auto max-h-[400px] border rounded-md">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="text-base text-left w-1/6 ">
                      Select
                    </TableHead>
                    <TableHead className="text-base w-1/6">Name</TableHead>
                    <TableHead className="text-base w-1/6">Gender</TableHead>
                    <TableHead className="text-base w-1/6">Age</TableHead>
                    <TableHead className="text-base w-1/6">Allergy</TableHead>
                    <TableHead className="text-base w-1/6">Dietary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox
                          id="memberList"
                          // checked={field.value}
                          // checked={}
                          // onCheckedChange={field.onChange}
                          onCheckedChange={() => {
                            const selectedMember = item.id;
                            setSelectedMembers([
                              ...selectedMembers,
                              selectedMember,
                            ]);
                            field.onChange([
                              ...selectedMembers,
                              selectedMember,
                            ]);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Label className="text-[14px]">{item.name}</Label>
                      </TableCell>
                      <TableCell>
                        <Label className="text-[14px]">{item.gender}</Label>
                      </TableCell>
                      <TableCell>
                        <Label className="text-[14px]">{item.age}</Label>
                      </TableCell>
                      <TableCell>
                        <Label className="text-[14px]">{item.allergy}</Label>
                      </TableCell>
                      <TableCell>
                        <Label className="text-[14px]">{item.dietary}</Label>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        />

        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label htmlFor="city" className="pl-2 text-base">
              City
            </Label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chiang Mai">Chiang Mai</SelectItem>
                    <SelectItem value="Chiang Rai">Chiang Rai</SelectItem>
                    <SelectItem value="Nan">Nan</SelectItem>
                    <SelectItem value="Phrae">Phrae</SelectItem>
                    <SelectItem value="Mae Hong Son ">Mae Hong Son </SelectItem>
                    <SelectItem value="Lampang">Lampang</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.city && (
              <p className="text-sm text-red-500 pl-2 pt-1">
                {errors.city.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="arrivalLocation" className="pl-2 text-base">
              Arrival Location
            </Label>
            <Controller
              name="arrivalLocation"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Select an arrival location"
                      {...field}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chiang Mai International Airport">
                      Chiang Mai International Airport
                    </SelectItem>
                    <SelectItem value="Chiang Rai International Airport">
                      Chiang Rai International Airport
                    </SelectItem>
                    <SelectItem value="Nan Airport">Nan Airport</SelectItem>
                    <SelectItem value="Phrae Airport">Phrae Airport</SelectItem>
                    <SelectItem value="Pai Airport">Pai Airport</SelectItem>
                    <SelectItem value="Mae Hong Son Airport">
                      Mae Hong Son Airport
                    </SelectItem>
                    <SelectItem value="Lampang Airport">
                      Lampang Airport
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.arrivalLocation && (
              <p className="text-sm text-red-500 pl-2 pt-1">
                {errors.arrivalLocation.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="departureLocation" className="pl-2 text-base">
              Departure Location
            </Label>
            <Controller
              name="departureLocation"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Select an departure location"
                      {...field}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chiang Mai International Airport">
                      Chiang Mai International Airport
                    </SelectItem>
                    <SelectItem value="Chiang Rai International Airport">
                      Chiang Rai International Airport
                    </SelectItem>
                    <SelectItem value="Nan Airport">Nan Airport</SelectItem>
                    <SelectItem value="Phrae Airport">Phrae Airport</SelectItem>
                    <SelectItem value="Pai Airport">Pai Airport</SelectItem>
                    <SelectItem value="Mae Hong Son Airport">
                      Mae Hong Son Airport
                    </SelectItem>
                    <SelectItem value="Lampang Airport">
                      Lampang Airport
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.departureLocation && (
              <p className="text-sm text-red-500 pl-2 pt-1">
                {errors.departureLocation.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-6 ">
          <div className="basis-7/12 justify-self-stretch">
            <Label htmlFor="roomType" className="pl-2 text-base">
              Hotel Type
            </Label>
            <Controller
              name="roomType"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Ex. 4 Star Hotel With Single/Double Bed"
                  id="roomType"
                  {...field}
                />
              )}
            />
            {errors.roomType && (
              <p className="text-sm text-red-500 pl-2 pt-1">
                {errors.roomType.message}
              </p>
            )}
          </div>
          <div className="flex space-x-2 justify-end pt-3.5">
            <Controller
              name="breakfast"
              control={control}
              render={({ field }) => (
                <div className="items-center flex space-x-2">
                  <Checkbox
                    id="breakfast"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="breakfast"
                      className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Breakfast Included
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Including breakfast with the hotel booking
                    </p>
                  </div>
                </div>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="pl-2 text-base">
            Trip Description
          </Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                id="description"
                className="w-full p-2 border rounded-md"
                placeholder="Tell us more about your trip"
                rows={7}
                {...field}
              />
            )}
          />
          {errors.description && (
            <p className="text-sm text-red-500 pl-2 pt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}
