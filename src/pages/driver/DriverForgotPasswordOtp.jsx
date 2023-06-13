import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { forgotPasswordOtpVerifyDriver } from "../../API/driver";
import driverInstance from "../../instance/driverInstance";

const DriverForgotPasswordOtp = () => {
  const [counter, setCounter] = useState(30);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  const navigate = useNavigate();

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("Otp should contain atleast 6 digits");
    } else {
      const response = await forgotPasswordOtpVerifyDriver(otp);
      toast.success(response.data.message);
      navigate("/driver/resetPassword");
    }
  };

  // Resend Otp

  const otpResend = () => {
    try {
      setCounter(60);
      toast.loading("Resending Otp");
      driverInstance.get("/resendOtp").then((response) => {
        toast.dismiss();
        toast.success(response.data.message);
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <p className="mt-2 text-center text-sm text-gray-600">
              <a className="font-medium text-zinc-600 hover:text-zinc-800 uppercase">
                Verify otp
              </a>
            </p>
          </div>

          <div className=" bg-white max-w-md rounded overflow-hidden shadow-xl p-5">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input type="hidden" name="remember" value="True" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="grid gap-6">
                  <div className="col-span-12">
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Enter the otp send to your registered email
                    </label>
                    <input
                      type="text"
                      placeholder="Enter the otp"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full md:h-10 h-8 shadow-sm sm:text-sm border-gray-300 rounded-md text-center"
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-zinc-600 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit
                </button>
              </div>
            </form>
            <div>
              <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-zinc-100 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2">
                {counter ? (
                  <p className="text-sm font-semibold">
                    Resend Otp : {counter} Sec
                  </p>
                ) : (
                  <p className="text-sm font-semibold ">
                    Didn't get OTP?
                    <button onClick={otpResend} className="ml-1  text-cyan-900">
                      Resend
                    </button>
                  </p>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverForgotPasswordOtp;
