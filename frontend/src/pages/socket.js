import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_BACKEND_URL || "https://skillshare-ebe1.onrender.com";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["polling", "websocket"],
});
let connectionProbe = null;

const isSocketBusy = () => socket.connected || socket.active;

export const connectSocket = async () => {
  if (isSocketBusy()) return true;

  if (connectionProbe) return connectionProbe;

  connectionProbe = fetch(`${SOCKET_URL}/api/health`)
    .then((res) => {
      if (!res.ok) throw new Error();
      socket.connect();
      return true;
    })
    .catch(() => {
      console.log("Backend waking up...");
      socket.connect();
      return true;
    })
    .finally(() => {
      connectionProbe = null;
    });

  return connectionProbe;
};