import React, { useEffect, useState } from "react";
import DriverHeader from "../DriverHeader";
import DriverMap from "../DriverMap";
import { useNavigate } from "react-router-dom";
import driverInstance from "../../../instance/driverInstance";
import tw from "tailwind-styled-components";
import { toast } from "react-hot-toast";

const Container = ({socket}) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [response, setResponse] = useState(null);
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [acceptClicked, setAcceptClicked] = useState(false);
  const [notificationId, setNotificationId] = useState(null);
  const [driverId, setDriverId] = useState(null);

  const token = JSON.parse(localStorage.getItem("driverToken"));

  useEffect(() => {
    driverInstance
      .post("/getDriverId", { token })
      .then((response) => {
        setDriverId(response.data.driverId);
        console.log(response.data.driverId);
      })
      .catch((error) => {
        const { response, message } = error;
        const errorMessage = response ? response.data.message : message;
        toast.error(errorMessage);
      });
  }, []);

  useEffect(() => {
    // Listen for 'notification' event
    socket.on("notification", (data) => {
      console.log(data, "notification data");
      const dataobject = data[0].drivers;
      const driverCheck = dataobject.filter(
        (item) => item.driverId == driverId
      );
      const statusVerification =
        driverCheck.length > 0 && driverCheck[0].status === true;
      statusVerification && setNotifications(data);
    });
    return () => {
      socket.off("notification");
    };
  }, [socket]);

  useEffect(() => {
    let timer;
    if (notifications.length > 0) {
      timer = setTimeout(() => {
        const notificationId = notifications[0]._id; // Get the _id of the first notification
        socket.emit("declineRequest", { driverId, notificationId });
        setNotifications((prevNotifications) => prevNotifications.slice(1));
      }, 30000);
    }
    return () => clearTimeout(timer);
  }, [notifications]);

  const handleAccept = (notification) => {
    const notificationId = notification._id;
    setPickup(notification.pickup);
    setDropoff(notification.dropoff);
    setNotificationId(notification._id);
    setAcceptClicked(true);
    socket.emit("acceptRequest", { notificationId, driverId });
    // Remove the accepted notification from the state
    setNotifications((prevNotifications) =>
      prevNotifications.filter((item) => item._id !== notificationId)
    );
  };

  const handleDecline = (notification) => {
    const notificationId = notification._id;
    // Emit the declineRequest event
    socket.emit("declineRequest", { driverId, notificationId });
    // Remove the declined notification from the state
    setNotifications((prevNotifications) =>
      prevNotifications.filter((item) => item._id !== notificationId)
    );
  };

  return (
    <>
      <DriverHeader />
      <div className="overflow-hidden h-screen">
        <Wrapper>
          <NotificationBox>
            {notifications.map((notification) => (
              <>
                <NotificationContainer>
                  <HeadingBox>
                    <HeadingContainer>
                      <Heading>RIDE FROM {notification.userId}</Heading>
                    </HeadingContainer>
                  </HeadingBox>
                  <Border></Border>
                  <ContentsContainer>
                    <ContentsBox key={notification._id}>
                      <Contents>
                        <TitleBox>
                          <Title>
                            PICK-UP :<SubTitle> {notification.pickup}</SubTitle>
                          </Title>
                        </TitleBox>

                        <TitleBox>
                          <Title>
                            DROP-OFF :
                            <SubTitle> {notification.dropoff}</SubTitle>
                          </Title>
                        </TitleBox>
                        <TitleBox>
                          <Title>
                            PRICE :<SubTitle> {notification.fare}</SubTitle>
                          </Title>
                        </TitleBox>
                      </Contents>
                    </ContentsBox>
                    <ButtonContainer>
                      <AcceptButton onClick={() => handleAccept(notification)}>
                        Accept
                      </AcceptButton>
                    </ButtonContainer>
                    <ButtonContainer>
                      <DeclineButton
                        onClick={() => handleDecline(notification)}
                      >
                        Decline
                      </DeclineButton>
                    </ButtonContainer>
                  </ContentsContainer>
                </NotificationContainer>
              </>
            ))}
          </NotificationBox>
          {acceptClicked ? (
            <DriverMap
              pickup={pickup}
              dropoff={dropoff}
              notificationId={notificationId}
            />
          ) : (
            <DriverMap />
          )}
        </Wrapper>
      </div>
    </>
  );
};

export default Container;

const Wrapper = tw.div`
  flex flex-col items-center overflow-hidden justify-center md:flex-row min-h-screen w-full
`;
const NotificationBox = tw.div`
max-w-sm w-full space-y-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10
`;
const NotificationContainer = tw.div`
bg-white max-w-md rounded overflow-hidden shadow-xl p-4
`;
const HeadingBox = tw.div`
`;
const HeadingContainer = tw.p`
mt-2 mb-2 text-center text-md text-gray-600 tracking-wider
`;
const Heading = tw.a`
font-medium text-black uppercase cursor-none
`;
const Border = tw.div`
border-b border-gray-400
`;
const ContentsContainer = tw.div`
space-y-4
`;
const ContentsBox = tw.div`
rounded-md shadow-sm -space-y-px 
`;
const Contents = tw.div`
grid
`;
const TitleBox = tw.div`
col-span-12 
`;
const Title = tw.p`
mt-2 text-center mx-10 text-sm text-black tracking-wider font-semibold 
`;
const SubTitle = tw.a`
font-medium text-gray-600  cursor-none
`;
const ButtonContainer = tw.div`
cursor-pointer
`;
const AcceptButton = tw.div`
group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-zinc-600 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
`;
const DeclineButton = tw.div`
group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-zinc-100 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2
`;
