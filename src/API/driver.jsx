import driverInstance from "../instance/driverInstance";

// ------------------------------------------------------------------OTP SEND-------------------------------------------------------------------//

export const otpSend = async ({ value, licenseData }) => {
  try {
    const response = await driverInstance.post("/otp", { value, licenseData });
    return response;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// ------------------------------------------------------------------OTP VERIFICATION-------------------------------------------------------------------//

export const OtpVerification = async (otp) => {
  try {
    const response = await driverInstance.post("/otpVerify", { otp });
    return response;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// ---------------------------------------------------------------------Resend Otp-------------------------------------------------------------------//

export const resendOtp = async () => {
  try {
    const response = await driverInstance.get("/resendOtp");
    return response;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// ------------------------------------------------------------------------FORGOT PASSWORD OTP SENDING-------------------------------------------------------------------//
export const forgotPasswordOtpDriver = async (value) => {
  try {
    const response = await driverInstance.post("/forgotPasswordOtp", { value });
    return response;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// ------------------------------------------------------------------------FORGOT PASSWORD OTP VERIFYING-------------------------------------------------------------------//

export const forgotPasswordOtpVerifyDriver = async (otp) => {
  try {
    const response = await driverInstance.post("/forgotPasswordOtpVerify", {
      otp,
    });
    return response;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// ------------------------------------------------------------------------RESET PASSWORD-------------------------------------------------------------------//

export const resetPasswordDriver = async (value) => {
  try {
    const response = driverInstance.post("/resetPassword", { value });
    return response;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};
