import React, { useEffect, useState } from "react";
import { socketService } from "../socketService";

interface Bid {
  _id: string;
  amount: number;
  bidder: {
    _id: string;
    username: string;
  };
  timestamp: string;
}

interface Props {
  auctionId: string;
}

const BidList: React.FC<Props> = ({ auctionId }) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [newBidAmount, setNewBidAmount] = useState("");

  useEffect(() => {
    // Fetch initial bids
    const fetchBids = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/bids/${auctionId}`
        );
        const data = await response.json();
        setBids(data);
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };

    fetchBids();

    // Listen for new bids
    socketService.on("new bid", (newBid: Bid) => {
      setBids((prevBids) => [newBid, ...prevBids]);
    });

    return () => {
      socketService.off("new bid");
    };
  }, [auctionId]);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auctionId,
          amount: parseFloat(newBidAmount),
        }),
      });
      if (response.ok) {
        setNewBidAmount("");
      } else {
        console.error("Failed to submit bid");
      }
    } catch (error) {
      console.error("Error submitting bid:", error);
    }
  };

  return (
    <div>
      <h2>Bids</h2>
      <form onSubmit={handleBidSubmit}>
        <input
          type="number"
          value={newBidAmount}
          onChange={(e) => setNewBidAmount(e.target.value)}
          placeholder="Enter bid amount"
          step="0.01"
          min="0"
          required
        />
        <button type="submit">Place Bid</button>
      </form>
      <ul>
        {bids.map((bid) => (
          <li key={bid._id}>
            ${bid.amount} by {bid.bidder.username} at{" "}
            {new Date(bid.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BidList;
