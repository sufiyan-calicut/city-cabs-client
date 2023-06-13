import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import instance from "../instance/instance";

const ClientProtectedRoutes = () => {
  const clientToken = JSON.parse(localStorage.getItem("clientToken"));
  const navigate = useNavigate();
  const [client, setClient] = useState(false);

  useEffect(() => {
    if (!clientToken) {
      // Redirect to login if token is missing
      navigate("/dashboard");
      return;
    }

    instance
      .get("/tokenVerify", {
        headers: { Authorization: `Bearer ${clientToken}` },
      })
      .then((response) => {
        setClient(true);
      })
      .catch((error) => {
        if (error.response && error.response.data.message === "userBlocked") {
          toast.dismiss();
          toast.error("You are blocked from this website");
        }
        localStorage.clear();
        navigate("/dashboard");
      });
  }, []);

  return client ? <Outlet /> : null;
};

export default ClientProtectedRoutes;
