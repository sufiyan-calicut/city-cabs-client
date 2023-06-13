import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import video from "../../assets/video/bg.mp4";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <section className="relative bg-video h-screen w-screen">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
          type="video/mp4"
          src={video}
        ></video>{" "}
        <div className="absolute inset-0 "></div>
        <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
          <div className="max-w-xl text-center sm:text-left py-14 bg-white sm:pl-5 rounded-sm bg-opacity-50">
            <h1 className="text-3xl font-extrabold">
              Get a ride in minutes,
              <strong className="block font-extrabold">
                Or become a driver.
              </strong>
            </h1>
            <p className="mt-4 max-w-lg sm:leading-relaxed font-bold">
              Get where you’re going easily and reliably with the tap of a
              button. With driver app you can decide how, where, and when you
              earn.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-center justify-center items-center md:justify-start">
              <a
                className="block w-3/4 cursor-pointer rounded bg-zinc-900 px-12 py-3 text-sm font-medium text-white shadow  focus:outline-none focus:ring  sm:w-auto duration-700 hover:shadow-inner transform hover:scale-110"
                onClick={() => navigate("/login")}
              >
                Rider app
              </a>
              <a
                className="block w-3/4 cursor-pointer rounded bg-white px-12 py-3 text-sm font-medium  shadow  focus:outline-none focus:ring  sm:w-auto duration-700 hover:shadow-inner transform hover:scale-110 md:ml-8"
                onClick={() => navigate("/driver/login")}
              >
                Driver app
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
