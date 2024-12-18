import axios from "@/lib/axios.config";
import { TEditTripSchema } from "@/types/zodSchema";

export const getTripFromRequirementId = async (requirementId: string) => {
  try {
    const { data } = await axios.get(`/user/requirement/trip/${requirementId}`);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);    
  }
}

export const getTripById = async (tripId: string) => {
  try {
    const { data } = await axios.get(`user/trip/${tripId}`);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);    
  }
}

export const editTrip = async (tripId: string, editedTrip: TEditTripSchema) => {
  try {
    console.log(tripId);
    console.log(" editedTrip", editedTrip);
    
    await axios.put(`/user/trip/${tripId}`, editedTrip);
    console.log("Trip Edited");
  } catch (error) {
    console.log(error);
  }
}

export const patchTrip = async (tripId: string, patchedTrip: any) => {
  console.log(tripId);
  console.log(patchedTrip);
  try {
    await axios.patch(`/user/trip/${tripId}`, patchedTrip);
    console.log("Trip Patched");    
  } catch (error) {
    console.log(error);    
  }
}
