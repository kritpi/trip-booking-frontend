"use client";

import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getRequirementById } from "@/api/requirement";
import type Requirement from "@/interface/requirement";

const locationSchema = z.object({
  location: z.string().min(1, "Location is required"),
  start_date_time: z.string().min(1, "Start date and time is required"),
  end_date_time: z.string().min(1, "End date and time is required"),
  description: z.string().min(1, "Description is required"),
});

const tripSchema = z.object({
  start_date_time: z.string().min(1, "Start date and time is required"),
  end_date_time: z.string().min(1, "End date and time is required"),
  city: z.string().min(1, "City is required"),
  arrivalLocation: z.string().min(1, "Arrival location is required"),
  departureLocation: z.string().min(1, "Departure location is required"),
  member: z.number().min(1, "Number of members is required"),
  hotel: z.string().min(1, "Hotel is required"),
  room_type: z.string().min(1, "Room type is required"),
  breakfast_included: z.boolean(),
  price: z.number().min(1, "Price is required"),
  locations: z.array(locationSchema),
  comment: z.string(),
  status: z.string().min(1, "Status is required"),
});

type TripFormValues = z.infer<typeof tripSchema>;

export default function CreateTrip({
  params,
}: {
  params: { requirementId: string };
}) {
  const [requirement, setRequirement] = useState<Requirement | null>(null);

  useEffect(() => {
    getRequirementById(params.requirementId).then((item) => {
      setRequirement(item);
    });
  }, [params.requirementId]);

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      start_date_time: requirement?.requirement.start_date_time || "",
      end_date_time: requirement?.requirement.end_date_time || "",
      city: requirement?.requirement.city || "",
      arrivalLocation: requirement?.requirement.arrival_location || "",
      departureLocation: requirement?.requirement.departure_location || "",
      member: requirement?.memberList.length || 0,
      hotel: "",
      room_type: requirement?.requirement.room_type || "",
      breakfast_included: requirement?.requirement.breakfast_included || false,
      price: 0,
      locations: [],
      comment: "",
      status: "Draft",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "locations",
  });

  useEffect(() => {
    if (requirement) {
      form.reset({
        start_date_time: requirement.requirement.start_date_time,
        end_date_time: requirement.requirement.end_date_time,
        city: requirement.requirement.city,
        arrivalLocation: requirement.requirement.arrival_location,
        departureLocation: requirement.requirement.departure_location,
        member: requirement.memberList.length,
        room_type: requirement.requirement.room_type,
        breakfast_included: requirement.requirement.breakfast_included,
      });
    }
  }, [requirement, form]);

  const onSubmit = (values: TripFormValues) => {
    console.log(values);
    // Here you would typically send the form data to your API
  };

  if (!requirement) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Trip</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="start_date_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date and Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date and Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="arrivalLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departureLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="member"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Members</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hotel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="room_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breakfast_included"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Breakfast Included</FormLabel>
                    <FormDescription>
                      Check if breakfast is included in the stay.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Label>Locations</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name={`locations.${index}.location`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`locations.${index}.start_date_time`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date and Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`locations.${index}.end_date_time`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date and Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`locations.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    Remove Location
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    location: "",
                    start_date_time: "",
                    end_date_time: "",
                    description: "",
                  })
                }
                className="mt-2"
              >
                Add Location
              </Button>
            </div>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create Trip</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
