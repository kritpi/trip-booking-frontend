"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';
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
import { UserGender } from "@/enum/UserGender";
import { SVGProps } from "react";

const memberSchema = z.object({
  uuid: z.string(),
  name: z.string().min(1),
  gender: z.enum(Object.values(UserGender) as [string, ...string[]]),
  age: z.string(),
  allergy: z.string(),
  dietary: z.string(),
})
type TMemberSchema = z.infer<typeof memberSchema>;

export default function Profile() {
  const [data, setData] = useState<TMemberSchema[]>([]);
  const form = useForm<Omit<TMemberSchema, 'uuid'>>({
    resolver: zodResolver(memberSchema.omit({ uuid: true })),
    defaultValues: {
      name: "",
      gender: UserGender.Male,
      age: "",
      allergy: "",
      dietary: "",
    }
  })

  const handleDelete = (uuid: string) => {
    setData(data.filter((item) => item.uuid !== uuid));
  };

  const handleEdit = (
    uuid: string,
    updates: Partial<Omit<TMemberSchema, 'uuid'>>
  ) => {
    setData(
      data.map((item) => (item.uuid === uuid ? { ...item, ...updates } : item))
    );
  };

  const onSubmit = async (values: Omit<TMemberSchema, 'uuid'>) => {
    const newMember = { ...values, uuid: uuidv4() };
    form.reset();
    await setData([...data, newMember]);
    await console.log(data, newMember);
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b dark:border-gray-800">
        <h2 className="text-lg font-medium">Members</h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-6 py-4 border-b dark:border-gray-800 grid grid-cols-5 gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
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
                      <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Age" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="allergy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allergy</FormLabel>
                <FormControl>
                  <Input placeholder="Allergy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dietary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dietary</FormLabel>
                <FormControl>
                  <Input placeholder="Dietary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="self-end">
            Add Member
          </Button>
        </form>
      </Form>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Gender
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Age
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Allergy
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Dietary
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.uuid}
                className="border-b dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3 text-sm">
                  <Input
                    value={item.name}
                    onChange={(e) =>
                      handleEdit(item.uuid, { name: e.target.value })
                    }
                    className="bg-transparent border-none focus:ring-0 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-sm">
                  <Select
                    value={item.gender}
                    onValueChange={(value) =>
                      handleEdit(item.uuid, { gender: value as UserGender })
                    }
                  >
                    <SelectTrigger className="bg-transparent border-none focus:ring-0 focus:outline-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(UserGender).map((gender) => (
                        <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3 text-sm">
                  <Input
                    value={item.age}
                    onChange={(e) =>
                      handleEdit(item.uuid, { age: e.target.value })
                    }
                    className="bg-transparent border-none focus:ring-0 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-sm">
                  <Input
                    value={item.allergy}
                    onChange={(e) =>
                      handleEdit(item.uuid, { allergy: e.target.value })
                    }
                    className="bg-transparent border-none focus:ring-0 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-sm">
                  <Input
                    value={item.dietary}
                    onChange={(e) =>
                      handleEdit(item.uuid, { dietary: e.target.value })
                    }
                    className="bg-transparent border-none focus:ring-0 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.uuid)}
                  >
                    <TrashIcon className="w-5 h-5 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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