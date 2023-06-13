import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import driverInstance from "../instance/driverInstance";

const DriverProtectedRoutes = () => {
  const driverToken = JSON.parse(localStorage.getItem("driverToken"));
  const navigate = useNavigate();
  const [driver, setDriver] = useState(false);

  useEffect(() => {
    if (!driverToken) {
        // Redirect to login if token is missing
        navigate("/dashboard");
        return;
      }
    driverInstance
      .get("/verifyToken", {
        headers: { Authorization: `Bearer ${driverToken}` },
      })
      .then((response) => {
        setDriver(true);
      })
      .catch((error) => {
        localStorage.clear();
        navigate("/dashboard");
      });
  }, []);

  return driver && <Outlet />;
};

export default DriverProtectedRoutes;
