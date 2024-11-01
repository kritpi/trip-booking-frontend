import axios from "@/lib/axios.config";

export const createRequirement = async (requirement: any) => {
  try {
    await axios.post(`/user/requirement`, requirement);
    console.log("Requirement Created");    
  } catch (error) {    
    console.log(error);    
  }
}

export const getRequirements = async () => {
  try {
    const { data } = await axios.get('/admin/requirements');
    console.log(data);  
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const getRequirementByUserId = async (userId: string) => {
  try {
    const { data } = await axios.get(`/user/requirement/user/${userId}`);
    console.log(data);
    return data;
    
  } catch (error) {
    console.log(error);     
  }
}

export const getRequirementById = async (requirementId: string) => {
  try {
    const { data } = await axios.get(`/user/requirement/${requirementId}`);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);    
  }
}