import axios from "@/lib/axios.config";

export const createLocation = async (location: any, tripId: string) => {
  try {
    await axios.post(`/admin/trip/location/${tripId}`, location);
    console.log("Location Created");
  } catch (error) {
    console.log(error);    
  }
}

export const deleteLocationById = async (tripId: string) => {
  try {
    console.log(tripId);
    await axios.delete(`/admin/trip/location/${tripId}`);
    console.log("Location Deleted");    
  } catch (error) {
    console.log(error);    
  }
}

export const getLocationByTripId = async (tripId: string) => {
  try {
    const locationList = await axios.get(`/admin/trip/location-list/${tripId}`);
    
    console.log("Location List API: ", locationList);
    return locationList;    
  } catch (error) {
    console.log(error);    
  }
}