"use client";
import { z } from "zod";
// import { tripSchema, TTripSchema } from "@/types/zodSchema";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Requirement from "@/interface/requirement";
import { getRequirementById } from "@/api/requirement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const tripSchema = z.object({
  uuid: z.string(),
  start_date_time: z.date(),
  end_date_time: z.date(),
  city: z.string().min(1),
  arrivalLocation: z.string().min(1),
  departureLocation: z.string().min(1),
  member: z.number(),
  hotel: z.string().min(1),
  room_type: z.string().min(1),
  breakfast_included: z.boolean(),
  price: z.number().min(1),
  location: z.array(
    z.object({
      location: z.string().min(1),
      start_date_time: z.date(),
      end_date_time: z.date(),
      description: z.string().min(1),
    })
  ),
  comment: z.string().min(1),
  status: z.string().min(1),
});
export type TTripSchema = z.infer<typeof tripSchema>;

export default function CreateTrip({
  params,
}: {
  params: { requirementId: string };
}) {
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [memberList, setMemberList] = useState<Requirement["memberList"]>([]);

  useEffect(() => {
    getRequirementById(params.requirementId).then((item) => {
      setRequirement(item);
    });
  }, [params.requirementId]);
  console.log(requirement);
  useEffect(() => {
    if (requirement?.memberList) {
      setMemberList(requirement.memberList);
    }
  }, [requirement]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TTripSchema>({
    resolver: zodResolver(tripSchema),
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
      location: [],
      comment: "",
      status: "",
    },
  });

  const onTripCreateFormSubmit = async (tripData: TTripSchema) => {
    console.log(tripData);
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
          <form onSubmit={handleSubmit(onTripCreateFormSubmit)}>
            
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
