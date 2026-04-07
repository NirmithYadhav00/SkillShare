import { NavLink } from "react-router-dom";

const ChatList = () => {
  // TEMP dummy data (replace with API later)
  const chats = [
    { id: "1", name: "John Doe", lastMessage: "Hey bro!" },
    { id: "2", name: "Alice Smith", lastMessage: "Let's catch up" },
  ];

  return (
    <div className="chat-list">
      <h3>Chats</h3>

      {chats.map((chat) => (
        <NavLink
          key={chat.id}
          to={`/chat/${chat.id}`}
          className={({ isActive }) =>
            isActive ? "chat-item active" : "chat-item"
          }
        >
          <div className="chat-info">
            <strong>{chat.name}</strong>
            <p>{chat.lastMessage}</p>
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default ChatList;