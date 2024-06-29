// src/components/ChatWidget.tsx
import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const ChatWidget: React.FC = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    // Logic to send message
    setMessage("");
  };

  return (
    <div className=" p-4 rounded-lg shadow-md border">
      <h2 className="text-xl font-semibold mb-4">Community Chat</h2>
      <div className="h-64 overflow-y-auto mb-4  p-2 rounded">
        {/* Chat messages would go here */}
      </div>
      <div className="flex">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow mr-2"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

export default ChatWidget;
