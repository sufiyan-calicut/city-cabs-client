import React from "react";
import tw from "tailwind-styled-components";
import Header from "../../components/rider/Header";
import UserActionLabel from "../../components/rider/home/ActionLabel";
import LocationSuggestion from "../../components/rider/home/LocationSuggestion";
import Map from "../../components/rider/Map";

const Home = () => {
  return (
    <div>
      <Header />
      <Wrapper>
        <ActionBox>
          <GradientBox>
            <Container>
              <Greeting>Hello !</Greeting>
              <UserActionLabel/>
              <LocationSuggestion/>
            </Container>
          </GradientBox>
        </ActionBox>
        <Map id="map" />
      </Wrapper>
    </div>
  );
};

const Wrapper = tw.div`
flex flex-col md:flex-row min-h-screen w-full bg-blue-200 
`;
const ActionBox = tw.div`
  absolute  bottom-0 left-0 w-full z-10 px-3 pb-8 bg-gradient-to-t from-gray-200 cursor-pointer
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

export default Home;
