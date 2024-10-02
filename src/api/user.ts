import User from "@/interface/user";
import UserRegister from "@/interface/userRegister";
import axios from "@/lib/axios.config";

export const getUser = async (userId: string) => {
  try {
    const { data } = await axios.get(`/user/${userId}`);
    console.log(data); 
    return data;
  } catch (error) {
    console.log(error);    
  }
}

export const createUser = async (newUser: UserRegister) => {
  try {
    const { data } = await axios.post<User>("/user/sign-up", newUser)
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

export const loginUser = async (username: string, password: string) => {
  try {
    await axios.post("/auth/login", { username, password })
  } catch (error) {
    console.log(error);    
  }
}
export const editUser = async (userId: string, editedUser: User) => {
  try {
    await axios.put(`/user/${userId}`, editedUser);
  } catch (error) {
    console.log(error);
  }
}