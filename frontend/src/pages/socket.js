import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
  reconnection: false,
});

let connectionProbe = null;

const isSocketBusy = () => socket.connected || socket.active;

export const connectSocket = async () => {
  if (isSocketBusy()) {
    return true;
  }

  if (connectionProbe) {
    return connectionProbe;
  }

  connectionProbe = fetch(`${SOCKET_URL}/api/health`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Backend unavailable");
      }

      socket.connect();
      return true;
    })
    .catch(() => false)
    .finally(() => {
      connectionProbe = null;
    });

  return connectionProbe;
};
