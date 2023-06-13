import { useState } from "react";
import { useNavigate } from "react-router-dom";
import tw from "tailwind-styled-components";

const Search = () => {
  const navigate = useNavigate();

  //Passing pickup and dropoff through query
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  const handleConfirm = () => {
    const query = `pickup=${pickup}&dropoff=${dropoff}`;
    navigate(`/confirmRide?${query}`);
  };

  return (
    <Wrapper>
      <ButtonContainer>
        <BackButton
          src="https://img.icons8.com/ios-filled/50/000000/left.png"
          onClick={() => navigate("/")}
        ></BackButton>
      </ButtonContainer>
      <InputContainer>
        <FromToIcons>
          <Circle src="https://img.icons8.com/ios-filled/50/9CA3AF/filled-circle.png" />
          <Line src="https://img.icons8.com/ios/50/9CA3AF/vertical-line.png" />
          <Square src="https://img.icons8.com/windows/50/000000/square-full.png" />
        </FromToIcons>
        <InputBoxes>
          <Input
            placeholder="Enter pick-up location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />
          <Input
            placeholder="Enter drop-off location"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
          />
        </InputBoxes>
        <PlusIcon src="https://img.icons8.com/ios/50/000000/plus-math.png" />
      </InputContainer>
      <SavedPlaces>
        <StarIcon src="https://img.icons8.com/ios-filled/50/ffffff/star--v1.png" />
        Saved places
      </SavedPlaces>
      <ConfirmButtonContainer onClick={handleConfirm}>
        Confirm Locations
      </ConfirmButtonContainer>
    </Wrapper>
  );
};

export default Search;

const Wrapper = tw.div`
bg-gray-200 h-screen
`;
const ButtonContainer = tw.div`
bg-white px-4
`;
const BackButton = tw.img`
h-12 cursor-pointer
`;
const InputContainer = tw.div`
bg-white flex items-center px-4 mb-2
`;
const FromToIcons = tw.div`
w-10 flex flex-col mr-2 items-center
`;
const Circle = tw.img`
h-2.5
`;
const Line = tw.img`
h-10
`;
const Square = tw.img`
h-3
`;
const InputBoxes = tw.div`
flex flex-col flex-1
`;
const Input = tw.input`
h-10 bg-gray-200 my-2 rounded-2 p-2 outline-none border-none
`;
const PlusIcon = tw.img`
  w-10 h-10 bg-gray-200 rounded-full ml-3 cursor-pointer
  transition duration-300 ease-in-out transform hover:scale-110
`;
const SavedPlaces = tw.div`
flex items-center bg-white px-4 py-2 cursor-pointer
`;
const StarIcon = tw.img`
bg-gray-400 w-10 h-10 p-2 rounded-full mr-2
`;
const ConfirmButtonContainer = tw.div`
bg-black text-white text-center mt-4 mx-4 px-4 py-4 text-md cursor-pointer uppercase tracking-wider rounded-md
`;
