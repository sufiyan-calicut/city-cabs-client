import tw from "tailwind-styled-components";
import Map from "../Map";
import RideSelector from "./RideSelector";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import instance from "../../../instance/instance";
import { toast } from "react-hot-toast";

const Confirm = ({ socket }) => {
  const navigate = useNavigate();
  const [pickupCoordinates, setPickupCoordinates] = useState([0, 0]);
  const [dropoffCoordinates, setDropoffCoordinates] = useState([0, 0]);
  const [parentSelectedCar, setParentSelectedCar] = useState(null);
  const [rideDuration, setrideDuration] = useState(null);
  const [rideDistance, setRideDistance] = useState(0);
  const [driverArriving, setDriverArriving] = useState(null);
  const [otp, setOtp] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [endConfirmModal, setEndConfirmModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [driverData, setDriverData] = useState(null);
  const [uniqueData, setUniqueData] = useState([]);
  const [cab, setCab] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  const token = JSON.parse(localStorage.getItem("clientToken"));

  // Access the location object from useLocation
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pickup = queryParams.get("pickup");
  const dropoff = queryParams.get("dropoff");

  useEffect(() => {
    getPickupCoordinates(pickup);
    getDropoffCoordinates(dropoff);
  }, [pickup, dropoff]);

  //get pickup coordinate
  const getPickupCoordinates = (pickup) => {
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${pickup}.json?` +
        new URLSearchParams({
          access_token:
            "pk.eyJ1IjoibmFqd2EyMDAxIiwiYSI6ImNsaGZ2d3c4dDFhc3YzbW52OXYwc3dpbDMifQ.h-g-GFjscHLCdp9IvtwQMQ",
          limit: 1,
        })
    )
      .then((response) => response.json())
      .then((data) => {
        setPickupCoordinates(data.features[0].center);
      });
  };

  //get dropoff coordinate
  const getDropoffCoordinates = (dropoff) => {
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${dropoff}.json?` +
        new URLSearchParams({
          access_token:
            "pk.eyJ1IjoibmFqd2EyMDAxIiwiYSI6ImNsaGZ2d3c4dDFhc3YzbW52OXYwc3dpbDMifQ.h-g-GFjscHLCdp9IvtwQMQ",
          limit: 1,
        })
    )
      .then((response) => response.json())
      .then((data) => {
        setDropoffCoordinates(data.features[0].center);
      });
  };

  useEffect(() => {
    fetchDriverDetails();
  }, []);

  const fetchDriverDetails = async () => {
    try {
      const response = await instance.get("/getDriverList");
      setDriverData(response.data.driverList);
      console.log(response.data.driverList);
    } catch (error) {
      console.error("Error fetching driver details:", error);
    }
  };

  useEffect(() => {
    if (pickupCoordinates && driverData) {
      // Calculate distance between pickupCoordinates and driverData
      const uniqueData = [];
      driverData.forEach((driver) => {
        console.log(driver);
        const driverId = driver[0];
        const driverLongitude = driver[1];
        const driverLatitude = driver[2];
        const driverCabType = driver[3];
        if (cab === driverCabType) {
          if (pickupCoordinates && driverLatitude && driverLongitude) {
            fetch(
              `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoordinates[0]},${pickupCoordinates[1]};${driverLongitude},${driverLatitude}?access_token=pk.eyJ1IjoibmFqd2EyMDAxIiwiYSI6ImNsaGZ2d3c4dDFhc3YzbW52OXYwc3dpbDMifQ.h-g-GFjscHLCdp9IvtwQMQ`
            )
              .then((res) => res.json())
              .then((data) => {
                if (data.code === "NoSegment") {
                  toast.error("NoSegment");
                } else {
                  const distance = data.routes[0].distance;
                  console.log(data.routes[0]);
                  if (distance < 70000) {
                    const driverData = { driverId, distance, driverCabType };
                    uniqueData.push(driverData);
                  }
                }
              })
              .catch((error) => {
                toast.error("Error fetching route data");
              });
          } else {
            toast.error("Route not found");
          }
        } else {
          console.log("Invalid cab type");
        }
      });
      // Update state with unique driver data
      setUniqueData(uniqueData);
    }
  }, [pickupCoordinates, driverData, cab]);

  //storing the selected-car
  const handleSelectedCar = (selectedCar) => {
    setParentSelectedCar(selectedCar);
    setCab(selectedCar.service);
  };

  //storing ride duration
  const handleRideDuration = (rideDuration) => {
    setrideDuration(rideDuration);
  };

  //storing ride distance
  const handleRideDistance = (rideDistance) => {
    setRideDistance(rideDistance);
  };

  const confirmRide = () => {
    socket.emit("rideConfirmation", {
      pickupCoordinates,
      dropoffCoordinates,
      pickup,
      dropoff,
      parentSelectedCar,
      rideDuration,
      rideDistance,
      token,
      uniqueData,
      cab,
    });
    setDriverArriving("loading");
  };

  useEffect(() => {
    socket.on("No Drivers", () => {
      setDriverArriving("No drivers");
      console.log("no drivers available");
    });
    return () => {
      socket.off("No Drivers");
    };
  }, [socket]);

  useEffect(() => {
    // Listen for 'driverArriving' event
    socket.on("driverArriving", (data) => {
      setBookingData(data);
      setOtp(data.otp);
      setDriverArriving("arriving");
    });

    return () => {
      socket.off("driverArriving");
    };
  }, [socket]);

  return (
    <>
      <Wrapper>
        <ButtonContainer>
          <BackButton
            src="https://img.icons8.com/ios-filled/50/000000/left.png"
            onClick={() => navigate("/search")}
          />
        </ButtonContainer>
        <Map
          pickupCoordinates={pickupCoordinates}
          dropoffCoordinates={dropoffCoordinates}
        />
        <RideContainer>
          {(() => {
            switch (driverArriving) {
              case "loading":
                return (
                  <>
                    <div class="h-screen bg-gray-100 flex items-center justify-center">
                      <div class="flex flex-col items-center">
                        <div class="opacity-50 mb-8">
                          Waiting for driver's acceptance, please don't close
                          the tab.
                        </div>
                        <svg
                          class="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            stroke="currentColor"
                            stroke-width="4"
                            cx="12"
                            cy="12"
                            r="10"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </>
                );
              case "No drivers":
                return (
                  <>
                    <div class="h-screen bg-gray-100 flex items-center justify-center">
                      <div class="flex flex-col items-center">
                        <div class="opacity-50 mb-8">
                          No drivers available,Please try again after some time
                        </div>
                        <div className="bg-gray-200  px-2 py-1 rounded-md">
                          <button
                            onClick={() => navigate("/")}
                            className="duration-500 uppercase tracking-wider font-medium"
                          >
                            Okay
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                );
              case "arriving":
                return (
                  <>
                    <div class="h-screen bg-gray-100 flex items-center justify-center">
                      <div class="flex flex-col items-center">
                        <div class="opacity-50 mb-8">
                          Driver is coming to pick you up.Please share the otp
                          with your driver for the verification.Please dont
                          close the tab.
                        </div>
                        <div className="uppercase tracking-wider px-2 py-1 rounded-md font-medium">
                          OTP : {otp}
                        </div>
                      </div>
                    </div>
                  </>
                );
              case "starting":
                return (
                  <>
                    <div class="h-screen bg-gray-100 flex items-center justify-center">
                      <div class="flex flex-col items-center">
                        <div class="opacity-50 mb-8">
                          Journey started.Sit back and relax.
                        </div>
                      </div>
                    </div>
                  </>
                );
              case "payment":
                return (
                  <>
                    <div class="h-screen bg-gray-100 flex items-center justify-center">
                      <div class="flex flex-col items-center">
                        <div class="opacity-50 mb-8">
                          Journey Completed.Please procced to payment.
                        </div>
                        <div className="bg-gray-200  px-2 py-1 rounded-md">
                          <button
                            onClick={() => payment(paymentData)}
                            className="duration-500 uppercase tracking-wider font-medium"
                          >
                            Okay
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                );
              default:
                return (
                  <>
                    <RideSelector
                      pickupCoordinates={pickupCoordinates}
                      dropoffCoordinates={dropoffCoordinates}
                      handleSelectedCar={handleSelectedCar}
                      handleRideDuration={handleRideDuration}
                      handleRideDistance={handleRideDistance}
                    />
                    <ConfirmButtonContainer>
                      <ConfirmButton onClick={confirmRide}>
                        Confirm uber
                      </ConfirmButton>
                    </ConfirmButtonContainer>
                  </>
                );
            }
          })()}
        </RideContainer>
      </Wrapper>
    </>
  );
};

export default Confirm;

const Wrapper = tw.div`
flex h-screen flex-col 
`;

const RideContainer = tw.div`
flex flex-col flex-1 h-1/2 
`;

const ConfirmButtonContainer = tw.div`
border-t-2
`;

const ConfirmButton = tw.div`
bg-black text-white my-4 mx-4 py-4 text-center text-xl uppercase cursor-pointer
`;

const ButtonContainer = tw.div`
  absolute top-4 left-4 rounded-full z-10 bg-white shadow-lg cursor-pointer
`;

const BackButton = tw.img`
  h-8 object-contain cursor-pointer
`;
