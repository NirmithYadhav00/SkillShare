import { io } from "socket.io-client";
import { API_BASE_URL, BACKEND_URL } from "../config/api";

const SOCKET_URL = BACKEND_URL;

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

  connectionProbe = fetch(`${API_BASE_URL}/health`)
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
