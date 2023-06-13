import React from 'react'
import { useNavigate } from 'react-router-dom';
import tw from 'tailwind-styled-components';

const UserActionLabel = () => {
    const navigate = useNavigate()
    const handleSearchClick = () => {
        navigate('/search');
      };
    return (
        <Wrapper>
            <ActionButton></ActionButton>
            <Labels>
                <LabelTitle onClick={handleSearchClick}>Where are you going?</LabelTitle>
            </Labels>
        </Wrapper>
    );
}

export default UserActionLabel

const Wrapper = tw.a`
  flex justify-start items-center gap-5 bg-black w-full rounded-lg p-4 mb-3
`
const Labels = tw.div`
    flex-grow-1
`
const ActionButton = tw.i`
    las la-search text-xl text-white
`
const LabelTitle = tw.h3`
  text-gray-200 text-lg cursor-pointer
`