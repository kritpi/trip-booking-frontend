import TripMember from "@/interface/tripMember";
import axios from "@/lib/axios.config";
import { log } from "console";

export const createMember = async (member: any) => {
  try {
    await axios.post(`/user/member`, member);    
    console.log("sent");
  } catch (error) {
    console.log(error);
  }
}

export const getMembersByUserId = async (userId: string) => {
  try {
    const { data } = await axios.get<TripMember[]>(`/user/member/${userId}`);    
    console.log(data);    
    return data
  } catch (error) {
    console.error(error);
  }
}

export const getMembersByRequirementId = async (requirementId: string) => {
  try {
    const { data } = await axios.get<TripMember[]>(`/user/member/requirement/${requirementId}`);    
    console.log(data);    
    return data
  } catch (error) {
    console.error(error);
  }
}

export const deleteMemberById = async (memberId: string) => {
  try {
    //Delete Success
    await axios.delete(`/user/member/${memberId}`);
    console.log("Delete Success");
    
  } catch (error) {
    console.log(error);
    console.log("Delete Failed");    
  }
}