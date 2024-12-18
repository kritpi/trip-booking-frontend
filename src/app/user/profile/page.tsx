"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema, TEditProfileSchema } from "@/types/zodSchema";
import { useSession } from "next-auth/react";
import {
  createMember,
  getMembersByUserId,
  deleteMemberById,
} from "@/api/member ";
import { getTripFromRequirementId } from "@/api/trip";
import { UserGender } from "@/enum/UserGender";
import { getUser, editUser } from "@/api/user";
import { getRequirementByUserId } from "@/api/requirement";
import TripMember from "@/interface/tripMember";
import User from "@/interface/user";
import { memberSchema, TMemberSchema } from "@/types/zodSchema";
import { useRouter } from "next/navigation";

import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import { SVGProps } from "react";
import Trip from "@/interface/trip";

export default function Profile() {
  const router = useRouter();

  const { data: session } = useSession();
  const [memberData, setMemberData] = useState<TripMember[]>([]);
  const [requirementList, setRequirementList] = useState<
    { requirement: any; memberList: string[] }[]
  >([]);
  const [selectedRequirement, setSelectedRequirement] = useState<any | null>(
    null
  );
  const requirementData: any[] = [];
  const [editUserData, setEditUserData] = useState<User>({
    username: "",
    name: "",
    lastName: "",
    phoneNumber: "",
  });
  const [disable, setDisable] = useState(false);
  const [tripData, setTripData] = useState<Trip>();

  useEffect(() => {
    if (session?.user?.id) {
      const member = getMembersByUserId(session.user.id);
      const requirementData = getRequirementByUserId(session.user.id);
      const editedUser = getUser(session.user.id);

      member.then((item) => {
        if (item) {
          setMemberData(item);
        }
      });
      requirementData.then((item) => {
        if (item) {
          setRequirementList(item);
        }
      });
      editedUser.then((item) => {
        if (item) {
          setEditUserData(item);
          editProfileForm.reset(item);
        }
      });
    }
  }, [session?.user?.id]);

  const selectRequirement = (item: any) => {
    setSelectedRequirement(item);

    getTripFromRequirementId(selectedRequirement?.requirement.id).then(
      (item) => {
        setTripData(item);
      }
    );
    console.log(tripData);

    if (selectedRequirement) {
      console.log(selectedRequirement.requirement.id);
      if (selectedRequirement.requirement.status === "Canceled") {
      } else if (
        selectedRequirement.requirement.status === "Wait for payment" ||
        selectedRequirement.requirement.status === "Checking payment" ||
        selectedRequirement.requirement.status === "Deposit paid" ||
        selectedRequirement.requirement.status === "Completed"
      ) {
        if (tripData) {
          router.replace(`/user/payment/${tripData?.id}`);
        }
      } else {
        router.replace(`/user/trip/${selectedRequirement.requirement.id}`);
      }
    }
  };

  const memberForm = useForm<Omit<TMemberSchema, "uuid">>({
    resolver: zodResolver(memberSchema.omit({ uuid: true })),
    defaultValues: {
      name: "",
      gender: UserGender.Male,
      age: "",
      allergy: "",
      dietary: "",
    },
  });

  const onNewMemberFormSubmit = (values: Omit<TMemberSchema, "uuid">) => {
    //Write UUID of each member in frontend side and sent to server
    const newMember = { ...values, id: uuidv4() };
    //Get newMember submitted from form and add to frontend
    setMemberData([...memberData, newMember]);
    memberForm.reset();
    //Add newMember to server
    if (session?.user?.id) {
      const member = {
        newMember: newMember,
        userId: session.user.id,
      };
      createMember(member);
    } else {
      console.error("Cannot Post");
    }
  };

  const editProfileForm = useForm<TEditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: editUserData,
  });

  const onEditProfileSubmit = async (values: TEditProfileSchema) => {
    if (session?.user?.id) {
      try {
        console.log(values);
        const updatedUser: User = {
          id: session.user.id,
          username: values.username,
          name: values.name,
          lastName: values.lastName,
          gender: editUserData.gender,
          email: editUserData.email,
          phoneNumber: values.phoneNumber,
          birthDate: editUserData.birthDate,
          password: editUserData.password,
          role: editUserData.role,
        };
        console.log(updatedUser);
        setEditUserData(updatedUser);
        await editUser(session.user.id, updatedUser);
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Failed to update profile:", error);
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  const handleMemberDelete = (memberId: string) => {
    //Delete from frontend
    setMemberData(memberData.filter((item) => item.id !== memberId));
    //Delete from server
    deleteMemberById(memberId);
  };
  const getStatusBadgeVariant = (status: string) => {
    if (!status) {
      return "secondary";
    }

    switch (status.toLowerCase()) {
      case "canceled":
      return "destructive";
      case "completed":
      return "default";
      case "in progress":
      return "outline";
      default:
      return "secondary";
    }
  };

  return (
    <div>
      <div className="flex flex-col px-15">
        <div>
          <div className="py-4">
            <p className="text-xl font-bold pl-2">Edit Your Profile</p>
          </div>
          <Form {...editProfileForm}>
            <form
              onSubmit={editProfileForm.handleSubmit(onEditProfileSubmit)}
              className="dark:border-gray-800"
            >
              <div>
                <div className="border rounded-md p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editProfileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base ml-2">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editProfileForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base ml-2">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editProfileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base ml-2">
                            Username
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editProfileForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base ml-2">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Phone Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-3">
                    <div>
                      <span className="pl-3 text-base font-semibold">
                        Birth Date:{" "}
                      </span>
                      <span>
                        {editUserData?.birthDate
                          ? new Date(
                              editUserData.birthDate
                            ).toLocaleDateString()
                          : ""}
                      </span>
                    </div>

                    <div className="grid justify-items-center">
                      <div>
                        <span className="pl-3 text-base font-semibold">
                          Email:{" "}
                        </span>
                        <span className="text-base">{editUserData?.email}</span>
                      </div>
                    </div>
                    <div className="grid justify-items-end">
                      <div>
                        <span className="pl-3 text-base font-semibold ">
                          Gender:{" "}
                        </span>
                        <span>{editUserData?.gender}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Button type="submit" className="self-end w-full mt-5 mb-6">
                Save
              </Button>
            </form>
          </Form>
        </div>
        <div className=" basis-2/12">
          <div className="py-4">
            <p className="text-xl font-bold pl-2">Add Your Trip Members</p>
          </div>
          <Form {...memberForm}>
            <form
              onSubmit={memberForm.handleSubmit(onNewMemberFormSubmit)}
              className="dark:border-gray-800 "
            >
              <div className="grid grid-cols-5 gap-4 border rounded-md p-4">
                <FormField
                  control={memberForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base ml-2">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={memberForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base ml-2">Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(UserGender).map((gender) => (
                            <SelectItem key={gender} value={gender}>
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={memberForm.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base ml-2">Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Age" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={memberForm.control}
                  name="allergy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base ml-2">Allergy</FormLabel>
                      <FormControl>
                        <Input placeholder="Allergy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={memberForm.control}
                  name="dietary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base ml-2">Dietary</FormLabel>
                      <FormControl>
                        <Input placeholder="Dietary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="self-end w-full mt-5 mb-6">
                Add Member
              </Button>
            </form>
          </Form>
        </div>
        <div className="basis-7/12">
          <p className="text-xl font-bold mb-4 pl-2">List of Members</p>
          <div className="overflow-auto max-h-[400px] border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10 ">
                <TableRow>
                  <TableHead className="text-base w-1/6 text-center">
                    Name
                  </TableHead>
                  <TableHead className="text-base w-1/6 text-center">
                    Gender
                  </TableHead>
                  <TableHead className="text-base w-1/6 text-center">
                    Age
                  </TableHead>
                  <TableHead className="text-base w-1/6 text-center">
                    Allergy
                  </TableHead>
                  <TableHead className="text-base w-1/6 text-center">
                    Dietary
                  </TableHead>
                  {/* <TableHead className="text-base w-1/6 text-center">
                    Delete
                  </TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Label className="text-[14px] grid justify-items-center">
                        {item.name}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <Label className="text-[14px] grid justify-items-center">
                        {item.gender}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <Label className="text-[14px] grid justify-items-center">
                        {item.age}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <Label className="text-[14px] grid justify-items-center">
                        {item.allergy}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <Label className="text-[14px] grid justify-items-center">
                        {item.dietary}
                      </Label>
                    </TableCell>
                    {/* <TableCell className="grid justify-items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMemberDelete(item.id)}
                      >
                        <TrashIcon className="w-5 h-5 text-red-500" />
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <p className="text-xl font-bold my-4 pl-2">List of Requirements</p>
        <div className="flex">
          <div className="flex-grow overflow-auto max-h-[400px] border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-base w-1/6">Start Date</TableHead>
                  <TableHead className="text-base w-1/6">End Date</TableHead>
                  <TableHead className="text-base w-1/6">City</TableHead>
                  <TableHead className="text-base ">Arrival Location</TableHead>
                  <TableHead className="text-base ">
                    Departure Location
                  </TableHead>
                  <TableHead className="text-base w-1/6 text-end">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirementList.map((item, index) => (
                  <TableRow
                    key={index} // Use a unique identifier from the item if available, or fall back to the index
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => selectRequirement(item)}
                  >
                    <TableCell className="text-[14px]">
                      {new Date(
                        item.requirement.start_date_time
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-[14px]">
                      {new Date(
                        item.requirement.end_date_time
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-[14px] truncate">
                      {item.requirement.city}
                    </TableCell>
                    <TableCell className="text-[14px] truncate">
                      {item.requirement.arrival_location}
                    </TableCell>
                    <TableCell className="text-[14px] truncate">
                      {item.requirement.departure_location}
                    </TableCell>
                    <TableCell className="text-[14px] float-right">
                      <Badge
                        variant={getStatusBadgeVariant(item.requirement.status)}
                        className="text-xs font-medium"
                      >
                        {item.requirement.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
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
