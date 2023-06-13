import React, { useState, useEffect } from "react";
import MapGL, { GeolocateControl, Marker, Popup } from "react-map-gl";
import tw from "tailwind-styled-components";
import { toast } from "react-hot-toast";
import socketIO from "socket.io-client";
const socket = socketIO.connect("http://localhost:4000");

const DriverMap = ({ pickup, dropoff, notificationId }) => {
  const [pickupCoordinates, setPickupCoordinates] = useState([0, 0]);
  const [dropoffCoordinates, setDropoffCoordinates] = useState([0, 0]);
  const [coordinates, setCoordinates] = useState(false);
  const [form, setForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(false);

  const driverToken = JSON.parse(localStorage.getItem("driverToken"));

  const [viewPort, setViewPort] = useState({
    longitude: 75.922096,
    latitude: 10.914627,
    zoom: 3,
  });

  //Initializing geolocator
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setViewPort((prevViewport) => ({
        ...prevViewport,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        zoom: 3.5,
      }));
    });
  }, []);

  // Emit live location to the server
  useEffect(() => {
    const emitLiveLocation = () => {
      if (viewPort.latitude && viewPort.longitude) {
        const liveLocation = {
          latitude: viewPort.latitude,
          longitude: viewPort.longitude,
        };
        console.log(liveLocation)
        socket.emit(
          "liveLocation",
          { liveLocation, token: driverToken },
          (error) => {
            if (error) {
              toast.error(error.message);
            }
          }
        );
      }
    };
    // Emit the live location every 5 seconds
    const interval = setInterval(emitLiveLocation, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [viewPort.latitude, viewPort.longitude]);

  // Event handler for the "error" event
  socket.on("error", (data) => {
    toast.error(data.message);
  });

  useEffect(() => {
    if (pickup) {
      setCoordinates(true);
      getPickupCoordinates(pickup);
    } else {
      setCoordinates(false);
      setPickupCoordinates([0, 0]);
    }

    if (dropoff) {
      setCoordinates(true);
      getDropoffCoordinates(dropoff);
    } else {
      setCoordinates(false);
      setDropoffCoordinates([0, 0]);
    }
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
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch coordinates for pickup.");
        }
      })
      .then((data) => {
        setPickupCoordinates(data.features[0].center);
      })
      .catch((error) => {
        //console.log(error);
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
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch coordinates for dropoff.");
        }
      })
      .then((data) => {
        setDropoffCoordinates(data.features[0].center);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const handleModal = (e) => {
    setForm(true);
  };

  const closeModal = () => {
    setForm(false);
  };

  const verifyData = {
    otp,
    notificationId: notificationId,
  };

  const verifyRide = (e) => {
    e.preventDefault();
    socket.emit("verifyRide", verifyData);
  };

  useEffect(() => {
    socket.on("verifyRideResponse", (data) => {
      console.log(data.message);
      setForm(false);
      setStatus(true);
    });
    return () => {
      socket.off("verifyRideResponse");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("notVerifyRideResponse", (data) => {
      console.log(data.message);
    });
    return () => {
      socket.off("notVerifyRideResponse");
    };
  }, [socket]);

  const handlePayment = (e) => {
    e.preventDefault();
    socket.emit("handlePayment", { verifyData });
  };

  useEffect(() => {
    // Listen for 'notification' event
    socket.on("proceedOfflinePayment", (data) => {
      setPaymentData(data);
      setPaymentStatus(true);
    });
    return () => {
      socket.off("proceedOfflinePayment");
    };
  }, [socket]);

  const fare = paymentData?.[0]?.fare;

  const closePaymentModal = () => {
    setStatus(null);
    setPaymentStatus(false);
    socket.emit("confirmOfflinePayment", verifyData);
  };

  console.log(status);

  useEffect(() => {
    socket.on("verifyPaymentSuccess", () => {
      setStatus(null);
    });
    return () => {
      socket.off("verifyPaymentSuccess");
    };
  }, [socket]);

  return (
    <>
      <Wrapper className="mt-16">
        {viewPort.latitude && viewPort.longitude && (
          <MapGL
            initialViewState={{ ...viewPort }}
            mapboxAccessToken="pk.eyJ1IjoibmFqd2EyMDAxIiwiYSI6ImNsaGZ2d3c4dDFhc3YzbW52OXYwc3dpbDMifQ.h-g-GFjscHLCdp9IvtwQMQ"
            style={{ width: "100vw", height: "100vh" }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            <GeolocateControl
              positionOptions={{ enableHighAccuracy: true }}
              trackUserLocation={true}
            />

            {/* live location */}
            <Marker
              longitude={viewPort.longitude}
              latitude={viewPort.latitude}
            />
            {/* Pickup Marker */}
            {pickupCoordinates.length > 0 && (
              <Marker
                longitude={pickupCoordinates[0]}
                latitude={pickupCoordinates[1]}
              >
                <Popup
                  longitude={pickupCoordinates[0]}
                  latitude={pickupCoordinates[1]}
                >
                  <div className="font-bold">Pickup Location </div>
                  <div>{pickup}</div>
                </Popup>
              </Marker>
            )}

            {/* Dropoff Marker */}
            {dropoffCoordinates.length > 0 && (
              <Marker
                longitude={dropoffCoordinates[0]}
                latitude={dropoffCoordinates[1]}
              >
                <Popup
                  longitude={dropoffCoordinates[0]}
                  latitude={dropoffCoordinates[1]}
                >
                  <div className="font-bold">Dropoff Location </div>
                  <div>{dropoff}</div>
                </Popup>
              </Marker>
            )}
          </MapGL>
        )}
        {coordinates && (
          <ActionBox>
            <GradientBox>
              <Container>
                <Greeting>Hello </Greeting>
                <ActionContainer>
                  <ActionButton></ActionButton>
                  {status === true && (
                    <Labels onClick={handleModal}>
                      <LabelTitle>Start journey</LabelTitle>
                    </Labels>
                  )}
                  {status === false && (
                    <Labels onClick={handlePayment}>
                      <LabelTitle>End journey</LabelTitle>
                    </Labels>
                  )}
                </ActionContainer>
              </Container>
            </GradientBox>
          </ActionBox>
        )}
        {form && (
          <>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                  onClick={closeModal}
                  type="button"
                  class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                  data-modal-hide="authentication-modal"
                >
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
                <div class="px-6 py-6 lg:px-8">
                  <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white text-center uppercase">
                    Verify ride
                  </h3>
                  <form class="space-y-6" onSubmit={verifyRide}>
                    <div>
                      <label
                        for="otp"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        OTP
                      </label>
                      <input
                        type="text"
                        maxLength="6"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Enter 6 digit otp"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      class="w-full text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
        {paymentStatus && (
          <>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 bg-white rounded-lg shadow dark:bg-gray-700">
              {" "}
              <div class="p-6 text-center">
                <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Please collect the fare RS: {fare}
                </h3>

                <button
                  onClick={closePaymentModal}
                  type="button"
                  class="text-white bg-gray-500 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5  focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  PAYMENT COMPLETED
                </button>
              </div>
            </div>
          </>
        )}
      </Wrapper>
    </>
  );
};

export default DriverMap;

const Wrapper = tw.div`
bg-gray-100 w-full inset-y-0 flex-1 
`;
const ActionBox = tw.div`
  absolute bottom-0 left-0 w-full z-10 px-3 pb-8 bg-gradient-to-t from-gray-200 cursor-pointer
`;
const GradientBox = tw.div`
  p-px rounded-lg bg-gradient-to-b from-gray-300 via-gray-300
`;
const Container = tw.div`
  bg-white w-full rounded-lg filter drop-shadow-xl p-3
`;
const Greeting = tw.div`
  font-semibold text-xl text-black pb-3 pt-5
`;
const ActionContainer = tw.a`
  flex justify-start items-center gap-5 bg-black w-full rounded-lg p-4 mb-3
`;
const Labels = tw.div`
    flex-grow-1 
`;
const ActionButton = tw.i`
    las la-search text-xl text-white
`;
const LabelTitle = tw.h3`
  text-gray-200 text-lg cursor-pointer 
`;
