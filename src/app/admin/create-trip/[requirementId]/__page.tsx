"use client";

import {
  editTripSchema,
  TEditTripSchema,
  tripLocationSchema,
  TTripLocationSchema,
} from "@/types/zodSchema";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import Requirement from "@/interface/requirement";
import { getRequirementById } from "@/api/requirement";
import { getTripFromRequirementId, editTrip } from "@/api/trip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { SVGProps } from "react";
import { cn } from "@/lib/utils";
import { format, set } from "date-fns";
import { v4 as uuidV4 } from "uuid";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/ui/time-picker/time-picker";
import { log } from "console";

export default function CreateTrip({
  params,
}: {
  params: { requirementId: string };
}) {
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [tripLocations, setTripLocations] = useState<TTripLocationSchema[]>([]);
  const [tripData, setTripData] = useState<any | null>(null);

  useEffect(() => {
    getRequirementById(params.requirementId).then((item) => {
      setRequirement(item);
    });
    getTripFromRequirementId(params.requirementId).then((item) => {      
      setTripData(item);
    });
  }, [params.requirementId]);
  console.log(tripData);
  
  
  const {
    control: tripControl,
    handleSubmit: handleTripSubmit,
    formState: { errors: tripErrors },
  } = useForm<TEditTripSchema>({
    resolver: zodResolver(editTripSchema),
    defaultValues: {      
      start_date_time: new Date(),
      end_date_time: new Date(),
      city: "",
      arrivalLocation: "",
      departureLocation: "",
      member: 0,
      hotel: "",
      room_type: "",
      breakfast_included: false,
      price: 0,
      // comment: "",
      status: "Wait for confirmation",
    },
  });

  const {
    control: locationControl,
    handleSubmit: haneldLocationSubmit,
    formState: { errors: locationErrors },
    reset: resetLocationForm,
  } = useForm<TTripLocationSchema>({
    resolver: zodResolver(tripLocationSchema),
    defaultValues: {
      location: "",
      start_date_time: new Date(),
      end_date_time: new Date(),
      description: "",
    },
  });

  const handleDateSelect = (
    date: Date | undefined,
    onChange: (date: Date) => void
  ) => {
    if (date) {
      onChange(date);
    }
  };

  const onTripEditFormSubmit = async (editedTrip: TEditTripSchema) => {
    try {      
      // console.log(editedTrip.uuid);      
      console.log(editedTrip);
      console.log(tripData?.id);
      
      editTrip(tripData?.id, editedTrip);
    } catch (error) {
      console.log(error);      
    }
  };

  const onCreateLocationSubmit = async (
    tripLocationData: Omit<TTripLocationSchema, "uuid">
  ) => {
    const newLocation = { ...tripLocationData, uuid: uuidV4() };
    setTripLocations([...tripLocations, newLocation]);
    console.log(newLocation);
    console.log(tripLocations);

    //todo add newLocation to server
    resetLocationForm();
  };

  const handleLocationDelete = (locationId: string) => {
    //Delete from frontend
    setTripLocations(tripLocations.filter((item) => item.uuid !== locationId));
    //Delete from server
    // todo
  };

  if (!requirement) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Requirement</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-3 gap-3">
            <div>
              <dt className="font-semibold">Start Date:</dt>
              <dd>
                {new Date(
                  requirement.requirement.start_date_time
                ).toDateString()}{" "}
                |{" "}
                {new Date(
                  requirement.requirement.start_date_time
                ).toLocaleTimeString()}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">End Date:</dt>
              <dd>
                {new Date(requirement.requirement.end_date_time).toDateString()}{" "}
                |{" "}
                {new Date(
                  requirement.requirement.end_date_time
                ).toLocaleTimeString()}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">City:</dt>
              <dd>{requirement.requirement.city}</dd>
            </div>
            <div>
              <dt className="font-semibold">Arrival Location:</dt>
              <dd>{requirement.requirement.arrival_location}</dd>
            </div>
            <div>
              <dt className="font-semibold">Departure Location:</dt>
              <dd>{requirement.requirement.departure_location}</dd>
            </div>
            <div>
              <dt className="font-semibold">Room Type:</dt>
              <dd>{requirement.requirement.room_type}</dd>
            </div>
            <div>
              <dt className="font-semibold">Breakfast Included:</dt>
              <dd>
                {requirement.requirement.breakfast_included ? "Yes" : "No"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Description:</dt>
              <dd>{requirement.requirement.trip_description}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      {/*Member List  */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Member List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base font-bold">Name</TableHead>
                <TableHead className="text-base font-bold">Age</TableHead>
                <TableHead className="text-base font-bold">Gender</TableHead>
                <TableHead className="text-base font-bold">Allergy</TableHead>
                <TableHead className="text-base font-bold">Dietary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requirement.memberList.map((member, index) => (
                <TableRow key={index}>
                  <TableCell className="text-base">{member.name}</TableCell>
                  <TableCell className="text-base">{member.age}</TableCell>
                  <TableCell className="text-base">{member.gender}</TableCell>
                  <TableCell className="text-base">{member.allergy}</TableCell>
                  <TableCell className="text-base">{member.dietary}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Create trip form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create Trip</CardTitle>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleTripSubmit(onTripEditFormSubmit)}>            
            <div className="grid grid-cols-3 gap-4 pb-5">
              <div>
                <Label htmlFor="startDate" className="pl-2 text-base">
                  Start Date Time
                </Label>
                <Controller
                  name="start_date_time"
                  control={tripControl}
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
                          onSelect={(date) => field.onChange(date)}
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
              </div>
              <div>
                <Label htmlFor="endDate" className="pl-2 text-base">
                  End Date Time
                </Label>
                <Controller
                  name="end_date_time"
                  control={tripControl}
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
                          onSelect={(date) => field.onChange(date)}
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
              </div>
              <div>
                <Label htmlFor="city" className="pl-2 text-base">
                  City
                </Label>
                <Controller
                  name="city"
                  control={tripControl}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city from requirement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chiang Mai">Chiang Mai</SelectItem>
                        <SelectItem value="Chiang Rai">Chiang Rai</SelectItem>
                        <SelectItem value="Nan">Nan</SelectItem>
                        <SelectItem value="Phrae">Phrae</SelectItem>
                        <SelectItem value="Mae Hong Son">Mae Hong Son</SelectItem>
                        <SelectItem value="Lampang">Lampang</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="arrivalLocation" className="pl-2 text-base">
                  Arrival Location
                </Label>
                <Controller
                  name="arrivalLocation"
                  control={tripControl}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an arrival location" />
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
                        <SelectItem value="Lampang Airport">Lampang Airport</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="departureLocation" className="pl-2 text-base">
                  Departure Location
                </Label>
                <Controller
                  name="departureLocation"
                  control={tripControl}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a departure location" />
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
                        <SelectItem value="Lampang Airport">Lampang Airport</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="member" className="pl-2 text-base">
                  Member
                </Label>
                <Controller
                  name="member"
                  control={tripControl}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="Member"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  )}
                />
                {tripErrors.member && <p>{tripErrors.member.message}</p>}
              </div>
              <div>
                <Label htmlFor="hotel" className="pl-2 text-base">
                  Hotel
                </Label>
                <Input
                  type="text"
                  placeholder="Add hotel name"
                  {...tripControl.register("hotel")}
                />
              </div>
              <div>
                <Label htmlFor="room_type" className="pl-2 text-base">
                  Room Type
                </Label>
                <Input
                  type="text"
                  placeholder="Ex. 4 Star Hotel With Single/Double Bed"
                  {...tripControl.register("room_type")}
                />
              </div>
              <div className="pt-7">
                <Controller
                  name="breakfast_included"
                  control={tripControl}
                  render={({ field }) => (
                    <div className="items-center flex space-x-2">
                      <Checkbox
                        id="breakfast_included"
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
              <div>
                <Label htmlFor="price" className="pl-2 text-base">
                  Price
                </Label>
                <Controller
                  name="price"
                  control={tripControl}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  )}
                />
              </div>
              <Button type="submit" className="mt-6 col-span-2">
                Save
              </Button>
            </div>
          </form>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add Trip Location</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={haneldLocationSubmit(onCreateLocationSubmit)}>
                <div className="grid grid-cols-2 gap-4 pt-3">
                  <div>
                    <Label htmlFor="location" className="pl-2 text-base">
                      Location
                    </Label>
                    <Controller
                      name="location"
                      control={locationControl}
                      render={({ field }) => (
                        <Input type="text" placeholder="Location" {...field} />
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="pl-2 text-base">
                      Description
                    </Label>
                    <Controller
                      name="description"
                      control={locationControl}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Description"
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="start_date_time" className="pl-2 text-base">
                      Start Date
                    </Label>
                    <Controller
                      name="start_date_time"
                      control={locationControl}
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
                  </div>
                  <div>
                    <Label htmlFor="end_date_time" className="pl-2 text-base">
                      End Date
                    </Label>
                    <Controller
                      name="end_date_time"
                      control={locationControl}
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
                  </div>
                </div>
                <div className="grid grid-cols-1 pt-3">
                  <Button type="submit" className="mt-4">
                    Add Location
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Trip Locations Table */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Trip Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-base font-bold">
                      Location
                    </TableHead>
                    <TableHead className="text-base font-bold">
                      Description
                    </TableHead>
                    <TableHead className="text-base font-bold">
                      Start Date & Time
                    </TableHead>
                    <TableHead className="text-base font-bold">
                      End Date & Time
                    </TableHead>
                    <TableHead className="text-base font-bold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tripLocations.map((location, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-base">
                        {location.location}
                      </TableCell>
                      <TableCell className="text-base">
                        {location.description}
                      </TableCell>
                      <TableCell className="text-base">
                        {format(location.start_date_time, "PPP HH:mm")}
                      </TableCell>
                      <TableCell className="text-base">
                        {format(location.end_date_time, "PPP HH:mm")}
                      </TableCell>
                      <TableCell className="grid justify-items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleLocationDelete(location.uuid)}
                        >
                          <TrashIcon className="w-5 h-5 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Comment</CardTitle>
          <CardContent>
            <p>Show user comment on this trip</p>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}

function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
