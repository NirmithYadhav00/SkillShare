import { useParams } from "react-router-dom";

const ChatWindow = () => {
  const { id } = useParams();

  return (
    <div className="chat-window-content">
      <h2>Chat with user {id}</h2>

      <div className="messages">
        <div className="message received">Hello 👋</div>
        <div className="message sent">Hi there!</div>
      </div>

      <div className="message-input">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;