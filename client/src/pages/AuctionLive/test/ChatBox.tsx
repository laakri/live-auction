import React, { useEffect, useState } from "react";
import { socketService } from "../socketService";

interface Props {
  auctionId: string;
}

const ChatBox: React.FC<Props> = ({ auctionId }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chat/${auctionId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Listen for new messages
    socketService.on("new message", (newMessage: any) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socketService.off("new message");
    };
  }, [auctionId]);

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auctionId,
          content: newMessage,
        }),
      });
      if (response.ok) {
        setNewMessage("");
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div style={{ height: "300px", overflowY: "scroll" }}>
        {messages.map((message) => (
          <div key={message._id.toString()}>
            <strong>{message.sender}:</strong> {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleMessageSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
