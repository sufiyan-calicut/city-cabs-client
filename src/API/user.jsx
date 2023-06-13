import { toast } from "react-hot-toast";
import instance from "../instance/instance";

// ----------------------------------------------------------------USER REGISTER OTP-------------------------------------------------------------------//

export const userRegisterOtp = async (value) => {
  try {
    console.log(value);
    const response = await instance.post("/otp", { value });
    return response;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// ------------------------------------------------------------------------USER LOGIN-------------------------------------------------------------------//

export const doLogin = async (value) => {
  try {
    const response = await instance.post("/login", { value });
    return response;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// ----------------------------------------------------------------VERIFY OTP IN REGISTERATION-------------------------------------------------------------------//

export const otpVerify = async (otp) => {
  try {
    const response = await instance.post("/otpVerify", { otp });
    return response;
  } catch (error) {
    toast.error(error.reponse.data.message);
  }
};

// ------------------------------------------------------------------------FORGOT PASSWORD OTP SENDING-------------------------------------------------------------------//
export const forgotPasswordOtp = async (value) => {
  try {
    const response = await instance.post("/forgotPasswordOtp", { value });
    return response;
  } catch (error) {
    toast.error(error.reponse.data.message);
  }
};

// ------------------------------------------------------------------------FORGOT PASSWORD OTP VERIFYING-------------------------------------------------------------------//

export const forgotPasswordOtpVerify = async (otp) => {
  try {
    const response = await instance.post("/forgotPasswordOtpVerify", { otp });
    return response;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// ------------------------------------------------------------------------RESET PASSWORD-------------------------------------------------------------------//

export const resetPassword = async (value) => {
  try {
    const response = instance.post("/resetPassword", { value });
    return response;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// ------------------------------------------------------------------------GET VEHICLE-LIST-------------------------------------------------------------------//

export const getVehicleList = async () => {
  try {
    const response = instance.get("/getVehicleList");
    return response;
  } catch (error) {
    const { response, message } = error;
    const errorMessage = response ? response.data.message : message;
    toast.error(errorMessage);
  }
};