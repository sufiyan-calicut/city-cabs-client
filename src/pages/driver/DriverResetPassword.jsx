import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { passwordValidation } from "../../helper/validate";
import { resetPasswordDriver } from "../../API/driver";

const DriverResetPassword = () => {
  const navigate = useNavigate();

  const Formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: passwordValidation,
    validateOnBlur: false,
    validateOnChange: false,

    // Submit
    onSubmit: async (value) => {
      const response = await resetPasswordDriver(value);
      toast.success(response.data.message);
      navigate("/driver/login");
    },
  });
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <p className="mt-2 text-center text-sm text-gray-600">
              <a className="font-medium text-zinc-600 hover:text-zinc-800 uppercase">
                Reset password
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
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New password
                    </label>
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      pattern=".{8,}"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full md:h-10 h-8 shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                      {...Formik.getFieldProps("password")}
                    />
                  </div>

                  <div className="col-span-12">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      required
                      pattern=".{8,}"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full md:h-10 h-8 shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                      {...Formik.getFieldProps("confirmPassword")}
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
              <button
                onClick={() => navigate("/driver/login")}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-zinc-100 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverResetPassword;
