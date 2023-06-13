import React from 'react'
import Confirm from '../../components/rider/confirmRide/Confirm'

function ConfirmRide({socket}) {
  return (
    <div>
        <Confirm socket={socket} />
    </div>
  )
}

export default ConfirmRide