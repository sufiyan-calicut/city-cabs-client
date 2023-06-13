import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { otpSend } from "../../API/driver";
import { signupValidation } from "../../helper/validate";
import driverInstance from "../../instance/driverInstance";

const DriverSignup = () => {
  const navigate = useNavigate();
  const [license, setLicense] = useState("");
  const [vehicle, setVehicle] = useState([]);

  useEffect(() => {
    const getVehicle = async () => {
      driverInstance
        .get("/getVehicleData")
        .then((response) => {
          console.log(response);
          setVehicle(response.data.vehicles);
        })
        .catch((error) => {
          const { response, message } = error;
          const errorMessage = response ? response.data.message : message;
          toast.error(errorMessage);
        });
    };
    getVehicle();
  }, []);

  const handleLicense = (event) => {
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const licenseImage = event.target.files[0];
    if (licenseImage && validImageTypes.includes(licenseImage.type)) {
      setLicense(licenseImage);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const Formik = useFormik({
    initialValues: {
      userName: "",
      phone: "",
      email: "",
      password: "",
      registerNo: "",
        vehicle: "",
    },
    validate: signupValidation,
    validateOnBlur: false,
    validateOnChange: false,

    onSubmit: async (value) => {
      console.log(value)
      const licenseImage = license;
      if (!licenseImage) {
        toast.error("Please add your License");
      } else {
        toast.loading("Processing");
        let licenseData;
        const reader = new FileReader();
        reader.readAsDataURL(licenseImage);
        reader.onloadend = async () => {
          licenseData = reader.result;
          const response = await otpSend({ value, licenseData });
          toast.dismiss();
          toast.success(response.data.message);
          navigate("/driver/otp");
        };
      }
    },
  });
  return (
    <>
      <Navbar />
      <div className="p-12">
        <form onSubmit={Formik.handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-white">
                Profile
              </h2>
              <h2 className="text-base font-semibold leading-7 text-gray-900 mt-2">
                Personal Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Use a permanent address where you can receive mail.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="userName"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Username
                  </label>
                  <div className="mt-2">
                    <input
                      placeholder="Username"
                      name="userName"
                      type="text"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...Formik.getFieldProps("userName")}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      placeholder="Email"
                      name="email"
                      type="text"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...Formik.getFieldProps("email")}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      placeholder="Password"
                      name="password"
                      type="password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...Formik.getFieldProps("password")}
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Mobile
                  </label>
                  <div className="mt-2">
                    <input
                      placeholder="Phone Number"
                      name="phone"
                      type="number"
                      pattern="[7896][0-9]{9}"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...Formik.getFieldProps("phone")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Cab Details
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Please provide the neccessary details about your cab.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="registerNo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Cab Register No
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="registerNo"
                        placeholder="Register No"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        {...Formik.getFieldProps("registerNo")}
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="vehicle"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Select your cab
                  </label>
                  <div className="mt-2">
                    <select
                      name="vehicle"
                      required
                      value={Formik.values.vehicle} // Set the value prop to Formik's vehicle value
                      onChange={Formik.handleChange} // Let Formik handle the onChange event
                      onBlur={Formik.handleBlur}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value="">Select vehicle type</option>
                      {vehicle.map((vehicle) => {
                        return (
                          <option key={vehicle.id} value={vehicle.service} className="text-black">
                            {vehicle.service}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="license"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    License Document
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="license"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <input
                            placeholder="License document"
                            name="license"
                            type="file"
                            accept="image/*"
                            required
                            onChange={handleLicense}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              onClick={() => navigate("/driver/login")}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default DriverSignup;
