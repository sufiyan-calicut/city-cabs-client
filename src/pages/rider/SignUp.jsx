import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import Navbar from "../../components/Navbar";
import { userRegisterOtp } from "../../API/user";
import { signupValidation } from "../../helper/validate";

function SignUp() {
  const navigate = useNavigate();

  const Formik = useFormik({
    initialValues: {
      userName: "",
      phone: "",
      email: "",
      password: "",
    },
    validate: signupValidation,
    validateOnBlur: false,
    validateOnChange: false,

    onSubmit: async (value) => {
        console.log(value)
      const response = await userRegisterOtp(value);
      toast.success(response.data.message);
      navigate("/otp");
    },
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <p className="mt-2 text-center text-sm text-gray-600">
              <a className="font-bold text-zinc-600 hover:text-zinc-800 uppercase">
                Signup
              </a>
            </p>
          </div>

          <div className=" bg-white max-w-md rounded overflow-hidden shadow-xl p-5">
            <form className="space-y-4" onSubmit={Formik.handleSubmit}>
              <input type="hidden" name="remember" value="True" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="grid gap-6">
                  <div className="col-span-12">
                    <label
                      htmlFor="userName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      User name
                    </label>
                    <input
                      type="text"
                      placeholder="Username"
                      name="userName"
                      required
                      {...Formik.getFieldProps("userName")}
                      className="outline-none mt-1 block w-full md:h-10 h-8 shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div className="col-span-12">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <input
                      placeholder="Email"
                      name="email"
                      type="email"
                      {...Formik.getFieldProps("email")}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full md:h-10 h-8 shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>

                  <div className="col-span-12">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      placeholder="Phone number"
                      name="phone"
                      type="number"
                      pattern="[7896][0-9]{9}"
                      required
                      {...Formik.getFieldProps("phone")}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full md:h-10 h-8 shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div className="col-span-12">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <input
                      placeholder="Password"
                      name="password"
                      type="password"
                      pattern=".{8,}"
                      required
                      {...Formik.getFieldProps("password")}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full md:h-10 h-8 shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Already have account?
                    <p
                      className="cursor-pointer font-semibold"
                      onClick={() => navigate("/login")}
                    >
                      LOGIN
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-zinc-600 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
