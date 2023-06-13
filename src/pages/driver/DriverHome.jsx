import React from 'react'
import Container from '../../components/driver/home/Container'

const DriverHome = ({socket}) => {
  return (
    <>
    <Container socket={socket} />
    </>
  )
}

export default DriverHome