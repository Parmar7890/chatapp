
import axiosInstance from "../config/axiosConfig";


export const registerUser = async (formData) => {
  try {
      const response = await axiosInstance.post("/auth/register", formData);
      return response.data;
  } catch (error) {
      throw error;
  }
};

export const loginUser = async (loginData) => {
  try {
      const response = await axiosInstance.post("/auth/login", loginData);

      console.log(response, "currentuser");

      return response.data;
  } catch (error) {
      throw error;
  }
};