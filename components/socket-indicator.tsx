"use client";

import { useSocket } from "./providersUI/socket-provider";
import { Badge } from "./ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge
        variant="secondary"
        className="bg-rose-500 text-white border-none"
      ></Badge>
    );
  }
  return (
    <Badge
      variant="secondary"
      className="bg-green-400 text-white border-none"
    ></Badge>
  );
};
