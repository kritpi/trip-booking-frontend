import { z } from "zod";
import { UserGender } from "@/enum/UserGender";

//User Register Schema and type
export const signUpSchema = z
  .object({
    username: z.string().trim().min(1, "*Username cannot be blank"),
    name: z.string().trim().min(1, "*Name cannot be blank"),
    lastName: z.string().trim().min(1, "*Last name cannot be blank"),
    gender: z.enum(Object.values(UserGender) as [string, ...string[]]),
    email: z.string().trim().email("*Wrong email format"),
    phoneNumber: z
      .string()
      .trim()
      .min(10, "*Phone number must be at least 10 characters"),
    birthDate: z.date({ required_error: "*A date of birth is required" }),
    password: z.string().min(1, "*Password cannot be blank"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "*Passwords must match",
    path: ["confirmPassword"],
  });

export type TSignUpSchema = z.infer<typeof signUpSchema>;

//User Login Schema and type
export const logInSchema = z
  .object({
    email: z.string().email("Incorrect email"),
    password: z.string().min(1, "Incorect password"),
  })
  .refine(
    (data) => data.password === data.password && data.email === data.email,
    {
      message: "Username or password is incorrect",
    }
  );
export type TLogInSchema = z.infer<typeof logInSchema>;

//Member Schema and type
export const memberSchema = z.object({
  uuid: z.string(),
  name: z.string().min(1),
  gender: z.enum(Object.values(UserGender) as [string, ...string[]]),
  age: z.string(),
  allergy: z.string(),
  dietary: z.string(),
});
export type TMemberSchema = z.infer<typeof memberSchema>;

//Requirement Schema and type
export const requirementSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  memberList: z.array(z.string()),
  city: z.string().min(1, "Select a city"),
  arrivalLocation: z.string().min(1, "Select a pickup location"),
  departureLocation: z.string().min(1, "Select a drop off location"),
  roomType: z.string().min(1, "Room type cannot be blank"),
  breakfast: z.boolean(),
  description: z.string().min(1, "Trip information cannot be blank"),
});
export type TRequirementSchema = z.infer<typeof requirementSchema>;


export const tripSchema = z.object({
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

//Edit profile Schema and type
export const editProfileSchema = z.object({
  username: z.string().trim().min(1, "*Username cannot be blank"),
  name: z.string().trim().min(1, "*Name cannot be blank"),
  lastName: z.string().trim().min(1, "*Last name cannot be blank"),
  phoneNumber: z
      .string()
      .trim()
      .min(10, "*Phone number must be at least 10 characters"),
});
export type TEditprofileSchema = z.infer<typeof editProfileSchema>;