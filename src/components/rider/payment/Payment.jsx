import React, { useState } from "react";
import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:4000');
import { useLocation, useNavigate } from "react-router-dom";
import tw from "tailwind-styled-components";
import { toast } from "react-hot-toast";
import Header from "../Header";
import instance from "../../../instance/instance";

const Payment = () => {
  const navigate = useNavigate()
  const [method, setMethod] = useState("none");
  const location = useLocation();
  const paymentData = location.state;

  const amount = paymentData?.[0]?.fare;
  const notificationId = paymentData?.[0]?._id;

  const onlinePayment = async () => {
    try {
      await instance
        .post('/initializePayment', { amount })
        .then((response) => {
          handleRazorpay(response.data.order);
          setMethod("online");
        })
        .catch((error) => {
          console.log(error);
          toast.dismiss();
          toast.error(error?.response?.data?.message);
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  const handleRazorpay = (order) => {
    const options = {
      key: import.meta.env.RAZORPAY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "city-cabs",
      order_id: order.id,
      handler: async function (response) {
        const data = {
          notificationId,
        };
        instance
          .post('/verifyPayment', { data, response })
          .then((response) => {
            toast.success(response.data.message);
            socket.emit("paymentSuccess")
            // console.log("payment successfully compoletererereree");
            setMethod("success");
            navigate("/rating");
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const offlinePayment =() => {
    socket.emit("offlinePayment",{notificationId});
    localStorage.setItem("notificationId",notificationId)
    navigate('/rating')
  }

  return (
    <>
      <Wrapper>
        <Header />
        
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 bg-white rounded-lg shadow dark:bg-gray-700">
              <div class="px-6 py-4 border-b rounded-t dark:border-gray-600">
                <h3 class="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                  Select payment method
                </h3>
              </div>
              <div class="p-6" >
                <ul class="my-4 space-y-3">
                  <li onClick={onlinePayment}>
                    <a
                      href="#"
                      class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                    >
                      <span class="flex-1 ml-3 whitespace-nowrap">Online</span>
                      <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400"></span>
                    </a>
                  </li>
                  <li onClick={offlinePayment}>
                    <a
                      href="#"
                      class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                    >
                      <span class="flex-1 ml-3 whitespace-nowrap">Offline</span>
                    </a>
                  </li>
                </ul>
                <div>
                  <a
                    href="#"
                    class="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400"
                  ></a>
                </div>
              </div>
            </div>
      </Wrapper>
    </>
  );
};

export default Payment;

const Wrapper = tw.div`
h- screen w-screen bg-yellow-200
`;
