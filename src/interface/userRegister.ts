import { UserGender } from "@/enum/UserGender";

export default interface UserRegister {
  name: string;
  lastName: string;
  gender: UserGender;
  email: string;
  phoneNumber: string;
  birthDate: Date;
  username: string;
  password: string;
}