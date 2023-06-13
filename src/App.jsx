import { BrowserRouter, Routes, Route } from "react-router-dom";

import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:4000');

import Dashboard from "./pages/Dashboard";

// Import Rider Page
import SignUp from "./pages/rider/SignUp";
import Otp from "./pages/rider/Otp";
import Login from "./pages/rider/Login";
import ForgotPassword from "./pages/rider/ForgotPassword";
import OtpForgotPassword from "./pages/rider/OtpForgotPassword";
import ResetPassword from "./pages/rider/ResetPassword";
import Home from "./pages/rider/Home";
import SearchPage from "./pages/rider/Search";
import ConfirmRide from "./pages/rider/ConfirmRide";
import Payment from "./components/rider/payment/Payment";
import Rating from "./components/rider/rating/Rating"
import Profile from "./pages/rider/Profile";

// Import Driver Page
import DriverSignup from "./pages/driver/DriverSignup";
import DriverOtp from "./pages/driver/DriverOtp";
import DriverSuccess from "./pages/driver/DriverSuccess";
import DriverLogin from "./pages/driver/DriverLogin";
import RequestRejected from "./pages/driver/RequestRejected";
import RequestPending from "./pages/driver/RequestPending";
import DriverForgotPassword from "./pages/driver/DriverForgotPassword";
import DriverForgotPasswordOtp from "./pages/driver/DriverForgotPasswordOtp";
import DriverResetPassword from "./pages/driver/DriverResetPassword";
import DriverHome from "./pages/driver/DriverHome";
import DriverProfile from "./pages/driver/DriverProfile";

// Import Public and Protected Routes
import ClientPublicRoutes from "./utils/ClientPublicRoutes";
import ClientProtectedRoutes from "./utils/ClientProtectedRoutes";
import DriverPublicRoutes from "./utils/DriverPublicRoutes";
import DriverProtectedRoutes from "./utils/DriverProtectedRoutes";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard/>} />
          {/* Rider */}
          <Route element={<ClientPublicRoutes />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp/>} />
            <Route path="/otp" element={<Otp/>} />
            <Route path="/forgotPassword" element={<ForgotPassword/>} />
            <Route path="/forgotPasswordOtp" element={<OtpForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPassword/>}/>
          </Route>
          <Route element={<ClientProtectedRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/confirmRide" element={<ConfirmRide socket={socket} />} />
            <Route path="/payment" element={<Payment/>} />
            <Route path="/rating" element={<Rating/>} />
            <Route path="/profile" element={<Profile/>} />
          </Route>

          {/* Driver */}
          <Route element={<DriverPublicRoutes/>}>
            <Route path="/driver/signUp" element={<DriverSignup/>}/>
            <Route path="/driver/otp" element={<DriverOtp/>} />
            <Route path="/driver/success" element={<DriverSuccess/>} />
            <Route path="/driver/login" element={<DriverLogin/>} />
            <Route path="/driver/declined" element={<RequestRejected/>} />
            <Route path="/driver/pending" element={<RequestPending/>} />
            <Route path="/driver/forgotPassword" element={<DriverForgotPassword/>} />
            <Route path="/driver/forgotPasswordOtp" element={<DriverForgotPasswordOtp/>} />
            <Route path="/driver/resetPassword" element={<DriverResetPassword/>} />
          </Route>
          <Route element={<DriverProtectedRoutes/>}>
            <Route path="/driver" element={<DriverHome socket={socket} />} />
            <Route path="/driver/profile" element={<DriverProfile/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
