// src/components/AuctionRoom.tsx

import React, { useEffect, useState } from "react";
import { socketService } from "./socketService";

const AuctionRoom: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [auctionId, setAuctionId] = useState("6680746f36931d1d3dfbf3dc");

  useEffect(() => {
    // Connect to the WebSocket server
    socketService.connect("http://localhost:3000");
    setConnected(true);

    // Join the auction room
    socketService.joinAuction(auctionId);

    // Cleanup on component unmount
    return () => {
      socketService.leaveAuction();
      socketService.disconnect();
    };
  }, [auctionId]);

  const handlePlaceBid = () => {
    const amount = parseFloat(bidAmount);
    if (!isNaN(amount)) {
      socketService.placeBid(amount);
      setBidAmount("");
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      socketService.sendChatMessage(chatMessage);
      setChatMessage("");
    }
  };

  return (
    <div>
      <h2>Auction Room: {auctionId}</h2>
      <p>Connection status: {connected ? "Connected" : "Disconnected"}</p>

      <div>
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Bid amount"
        />
        <button onClick={handlePlaceBid}>Place Bid</button>
      </div>

      <div>
        <input
          type="text"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          placeholder="Chat message"
        />
        <button onClick={handleSendMessage}>Send Message</button>
      </div>
    </div>
  );
};

export default AuctionRoom;
