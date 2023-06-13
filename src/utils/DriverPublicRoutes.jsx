import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const DriverPublicRoutes = () => {
  const driverToken = JSON.parse(localStorage.getItem("driverToken"));
  return driverToken ? <Navigate to="/driver" /> : <Outlet />;
};

export default DriverPublicRoutes;