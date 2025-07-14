"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_BACK_END_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000, // 1 second initial delay
      reconnectionDelayMax: 5000, // Max 5 seconds between attempts
      randomizationFactor: 0.5,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setConnected(true);
    });

    newSocket.on("connect_error", (err: Error) => {
      console.log(err.message);
    });

    newSocket.on("disconnect", (reason: string) => {
      console.log("Socket disconnected:", reason);
      setConnected(false);

      // Optional: Handle server-initiated disconnects
      if (reason === "io server disconnect") {
        // Force reconnection if server disconnected you
        newSocket.connect();
      }
    });

    newSocket.on("reconnect", (attemptNumber: number) => {
      console.log("Reconnected to server after", attemptNumber, "attempts");
      // Optionally re-authenticate or rejoin rooms here
    });

    newSocket.on("reconnect_error", (error: Error) => {
      console.error("Reconnection error:", error);
    });

    newSocket.on("reconnect_failed", () => {
      console.log("Reconnection attempts failed");
      // Handle failed reconnection (e.g., show user a message)
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
