"use client";

import { io as ClientIO } from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const path = "/api/socket";
    const SocketIO = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
      path,
      addTrailingSlash: false,
    });

    SocketIO.on("connect", () => {
      console.log("socket connected");
      setIsConnected(true);
    });

    SocketIO.on("disconnect", () => {
      console.log("socket disconnected");
      setIsConnected(false);
    });

    setSocket(SocketIO);

    return () => {
      SocketIO.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
