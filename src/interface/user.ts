import { UserGender } from "@/enum/UserGender";
import { UserRole } from "@/enum/UserRole";

export default interface User {
  id?: string;
  username?: string;
  name?: string;
  lastName?: string;
  gender?:  UserGender;
  email?: string;
  phoneNumber?: string;
  birthDate?: Date;
  password?: string;
  role?: UserRole;
}