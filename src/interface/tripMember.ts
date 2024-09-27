import { UserGender } from "@/enum/UserGender";

export default interface TripMember {
  name: string,
  gender: UserGender,  
  age: string,
  allergy: string,
  dietary: string,
}
