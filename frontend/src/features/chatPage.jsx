import { Outlet } from "react-router-dom";
import ChatList from "./ChatList";
import "./chat.css";

const ChatPage = () => {
  return (
    <div className="chat-layout">
      <ChatList />

      <div className="chat-window">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatPage;