"use client";
import { getRequirementById } from "@/api/requirement";
import { getTripFromRequirementId } from "@/api/trip";
import { getLocationByTripId } from "@/api/location";
import { useEffect, useState } from "react";
import Requirement from "@/interface/requirement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Trip from "@/interface/trip";
import { editTrip } from "@/api/trip";
import { TEditTripSchema } from "@/types/zodSchema";

export default function TripDetail({
  params,
}: {
  params: { requirementId: string };
}) {
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [tripData, setTripData] = useState<Trip>();
  const [locationList, setLocationList] = useState<any[]>([]);
  const [comment, setComment] = useState<string>("");
  const [disable, setDisable] = useState<boolean>(false);

  useEffect(() => {
    getRequirementById(params.requirementId).then((item) => {
      setRequirement(item);
    });
    getTripFromRequirementId(params.requirementId).then((item) => {
      setTripData(item);
    });
  }, [params.requirementId]);

  useEffect(() => {
    if (tripData) {
      getLocationByTripId(tripData.id).then((item) => {
        setLocationList(item?.data || []);
      });
    }
  }, [tripData]);

  console.log("Requirement", requirement);
  console.log("Trip Data", tripData);
  console.log("Location List", locationList);

  const onCommentSubmit = async () => {
    console.log(comment);
    console.log(tripData?.id);
    const trip: TEditTripSchema = {
      start_date_time: tripData?.start_date_time
        ? new Date(tripData.start_date_time)
        : new Date(),
      end_date_time: tripData?.end_date_time
        ? new Date(tripData.end_date_time)
        : new Date(),
      city: tripData?.city ?? "",
      arrivalLocation: tripData?.arrival_location ?? "",
      departureLocation: tripData?.departure_location ?? "",
      member: tripData?.members ?? 0,
      hotel: tripData?.hotel ?? "",
      room_type: tripData?.room_type ?? "",
      breakfast_included: tripData?.breakfast_included ?? false,
      price: tripData?.price ?? 0,
      comment: comment,
      status: tripData?.status ?? "Creating Trip",
    };

    if (tripData?.id) {
      await editTrip(tripData.id, trip);
      setDisable(true);
    } else {
      console.error("Trip ID is undefined");
    }
  };

  return (
    <div className="container p-4">
      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Your Trip Requirement</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-4 gap-3">
            <div>
              <dt className="font-semibold">Start Date:</dt>
              <dd>
                {new Date(
                  requirement?.requirement.start_date_time ?? ""
                ).toDateString()}{" "}
                |{" "}
                {new Date(
                  requirement?.requirement.start_date_time ?? ""
                ).toLocaleTimeString()}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">End Date:</dt>
              <dd>
                {new Date(
                  requirement?.requirement.end_date_time ?? ""
                ).toDateString()}{" "}
                |{" "}
                {new Date(
                  requirement?.requirement.end_date_time ?? ""
                ).toLocaleTimeString()}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">City:</dt>
              <dd>{requirement?.requirement.city}</dd>
            </div>
            <div>
              <dt className="font-semibold">Arrival Location:</dt>
              <dd>{requirement?.requirement.arrival_location}</dd>
            </div>
            <div>
              <dt className="font-semibold">Departure Location:</dt>
              <dd>{requirement?.requirement.departure_location}</dd>
            </div>
            <div>
              <dt className="font-semibold">Room Type:</dt>
              <dd>{requirement?.requirement.room_type}</dd>
            </div>
            <div>
              <dt className="font-semibold">Breakfast Included:</dt>
              <dd>
                {requirement?.requirement.breakfast_included ? "Yes" : "No"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Description:</dt>
              <dd>{requirement?.requirement.trip_description}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
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
              {requirement?.memberList.map((member, index) => (
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Trip Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-4 gap-3">
            <div>
              <dt className="font-semibold">Start Date:</dt>
              <dd>
                {new Date(tripData?.start_date_time ?? "").toDateString()} |{" "}
                {new Date(tripData?.start_date_time ?? "").toLocaleTimeString()}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">End Date:</dt>
              <dd>
                {new Date(tripData?.end_date_time ?? "").toDateString()} |{" "}
                {new Date(tripData?.end_date_time ?? "").toLocaleTimeString()}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">City:</dt>
              <dd>{tripData?.city}</dd>
            </div>
            <div>
              <dt className="font-semibold">Arrival Location:</dt>
              <dd>{tripData?.arrival_location}</dd>
            </div>
            <div>
              <dt className="font-semibold">Departure Location:</dt>
              <dd>{tripData?.departure_location}</dd>
            </div>
            <div>
              <dt className="font-semibold">Member:</dt>
              <dd>{tripData?.members}</dd>
            </div>
            <div>
              <dt className="font-semibold">Hotel:</dt>
              <dd>{tripData?.hotel}</dd>
            </div>
            <div>
              <dt className="font-semibold">Room Type:</dt>
              <dd>{tripData?.room_type}</dd>
            </div>
            <div>
              <dt className="font-semibold">Breakfast Included:</dt>
              <dd>{tripData?.breakfast_included ? "Yes" : "No"}</dd>
            </div>
            <div>
              <dt className="font-semibold">Price:</dt>
              <dd>{tripData?.price}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Location List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base font-bold">
                  Start Date Time
                </TableHead>
                <TableHead className="text-base font-bold">
                  End Date Time
                </TableHead>
                <TableHead className="text-base font-bold">Location</TableHead>
                <TableHead className="text-base font-bold">
                  Description
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locationList.map((location, index) => (
                <TableRow key={index}>
                  <TableCell className="text-base">
                    {new Date(location.start_date_time).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-base">
                    {new Date(location.end_date_time).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-base">
                    {location.location}
                  </TableCell>
                  <TableCell className="text-base">
                    {location.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Comment on your trip</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <form onSubmit={handleSubmit(onCommentSubmit)}> */}

          <textarea
            placeholder="Write your comment here"
            className="w-full p-2 border rounded-md mb-2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            onClick={onCommentSubmit}
            variant={"outline"}
            className="w-full"
          >
            Edit your trip
          </Button>
          {/* </form> */}
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-6">
        <Button disabled={disable}>Book the Trip</Button>
        <Button variant={"destructive"} disabled={disable}>
          Cancle
        </Button>
      </div>
    </div>
  );
}
