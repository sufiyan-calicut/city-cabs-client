import axios from "axios";
import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { useNavigate } from "react-router-dom";
import { getVehicleList } from "../../../API/user";
import { toast } from "react-hot-toast";

const RideSelector = ({
  pickupCoordinates,
  dropoffCoordinates,
  handleSelectedCar,
  handleRideDuration,
  handleRideDistance,
}) => {
  const [carList, setCarList] = useState([]);
  const [rideDuration, setRideDuration] = useState({ hours: 0, minutes: 0 });
  const [rideDistance, setRideDistance] = useState(0);
  const [selectedCar, setSelectedCar] = useState();

  const navigate = useNavigate();

  //get car list from admin side
  useEffect(() => {
    const vehicleData = async () => {
      try {
        const response = await getVehicleList();
        setCarList(response.data.carList);
      } catch (error) {
        console.log("error", error);
      }
    };
    vehicleData();
  }, []);

  //calculate the distance between pickup and dropoff
  // duration of travelling
  useEffect(() => {
    fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoordinates[0]},${pickupCoordinates[1]};${dropoffCoordinates[0]},${dropoffCoordinates[1]}?access_token=pk.eyJ1IjoibmFqd2EyMDAxIiwiYSI6ImNsaGZ2d3c4dDFhc3YzbW52OXYwc3dpbDMifQ.h-g-GFjscHLCdp9IvtwQMQ`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data,'this is rideselector')
        toast.loading("Calculating distance");
        if (data && data.routes && data.routes[0] && data.routes[0].duration) {
          const durationInMinutes = parseInt(data.routes[0].duration / 60);
          const hours = Math.floor(durationInMinutes / 60);
          const minutes = durationInMinutes % 60;
          console.log(data.routes[0],'this pick up and drop off');
          setRideDuration({ hours, minutes });
          setRideDistance(Math.floor(data.routes[0].distance / 1000));
          toast.dismiss();
        } else {
          // Handle the case when the response data is undefined or doesn't have the expected structure
          toast.error("Error calculating distance");
        }
      })
      .catch((error) => {
        toast.error("Error fetching directions");
      });
  }, [pickupCoordinates, dropoffCoordinates]);

  // Store the selected car details in the state
  const handleCarClick = (car) => {
    setSelectedCar(car);
    handleSelectedCar(car); //Pass the selected car to confirm.js
    handleRideDuration(rideDuration); //pass the ride duration to confirm.js
    handleRideDistance(Math.floor(rideDistance));
  };

  return (
    <>
      <Wrapper>
        <Title>
          Choose a ride.
          <p>
            {" "}
            {"Estimated Time : "}
            {rideDuration.hours} hour{rideDuration.hours !== 1 ? "s" : ""}{" "}
            {rideDuration.minutes} minute{rideDuration.minutes !== 1 ? "s" : ""}
          </p>
        </Title>
        <CarList>
          {carList.map((car, index) => (
            <Car
              key={index}
              onClick={() => handleCarClick(car)}
              className={`${
                selectedCar && selectedCar._id === car._id ? "bg-gray-300" : ""
              }`}
            >
              <CarImage src={car.image} />
              <CarDetails>
                <Service>{car.service}</Service>
                <Persons>{car.persons} persons</Persons>
              </CarDetails>
              <Price>
                RS :
                {rideDistance <= 3
                  ? car.minCharge
                  : parseFloat(((rideDistance - 3) * car.price).toFixed(0)) +
                    parseFloat(car.minCharge)}
              </Price>
            </Car>
          ))}
        </CarList>
      </Wrapper>
    </>
  );
};

export default RideSelector;

const Wrapper = tw.div`
flex flex-col flex-1 overflow-y-scroll
`;

const Title = tw.div`
text-gray-500 text-center text-xs py-2 border-b
`;

const CarList = tw.div`
overflow-y-scroll
`;

const Car = tw.div`
  flex p-4 items-center hover:bg-gray-300 cursor-pointer
`;

const CarImage = tw.img`
h-14 mr-4
`;

const CarDetails = tw.div`
flex-1
`;

const Service = tw.div`
font-medium
`;

const Persons = tw.div`
text-xs text-blue-500
`;

const Price = tw.div`
text-sm
`;