import React from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { loginValidation } from "../../helper/validate";
import { doLogin } from "../../API/user";
import Navbar from "../../components/Navbar"

const Login = () => {
  const navigate = useNavigate();

  const Formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: loginValidation,
    validateOnBlur: false,
    validateOnChange: false,

    // Submit
    onSubmit: async (value) => {
      const response = await doLogin(value);
      localStorage.setItem("clientToken", JSON.stringify(response.data.token));
      toast.success(response.data.message);
      navigate("/");
    },
  });

  return (
    <>
    <Navbar/>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className=" bg-white max-w-md rounded overflow-hidden shadow-xl p-5">
            <form className="space-y-4" onSubmit={Formik.handleSubmit}>
              <input type="hidden" name="remember" value="True" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="grid gap-6">
                  <div className="col-span-12">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Email"
                      name="email"
                      {...Formik.getFieldProps("email")}
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
                      type="password"
                      placeholder="Password"
                      name="password"
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
                    Dont have account?
                    <p
                      className="cursor-pointer font-semibold"
                      onClick={() => navigate("/signUp")}
                    >
                      REGISTER
                    </p>
                  </label>
                </div>

                <div className="text-sm">
                  <p
                    className="font-medium text-zinc-600 hover:text-zinc-800 cursor-pointer"
                    onClick={() => navigate("/forgotPassword")}
                  >
                    Forgot your password?
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-zinc-600 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
