import React, { createContext } from "react";

// Create a new context
const SocketContext = createContext();

// Create a SocketProvider component to wrap your app
const SocketProvider = ({ children, socket }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
