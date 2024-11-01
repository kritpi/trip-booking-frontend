import { UserGender } from "@/enum/UserGender";

export default interface TripMember {
  id: string,
  name: string,
  gender: string,  
  age: string,
  allergy: string,
  dietary: string,
}
