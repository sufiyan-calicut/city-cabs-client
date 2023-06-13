import React from "react";
import { useNavigate } from "react-router-dom";

const DriverSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <p className="mt-2 text-center text-sm text-gray-600">
            <a className="font-semibold text-zinc-600 hover:text-zinc-800 uppercase">
              Your registration has been completed successfully,We will contact
              you with the updates within 15 days.
            </a>
          </p>
        </div>

        <div className=" bg-white max-w-md rounded overflow-hidden shadow-xl p-5">
          <div>
            <button
              onClick={() => navigate("/driver/login")}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold uppercase rounded-md text-black bg-zinc-100 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2"
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverSuccess;
