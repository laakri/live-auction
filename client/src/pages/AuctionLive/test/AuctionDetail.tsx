import React, { useEffect, useState } from "react";
import { socketService } from "../socketService";
import BidList from "./BidList";
import ChatBox from "./ChatBox";

const AuctionDetail: React.FC = () => {
  const auctionId = "6680746f36931d1d3dfbf3dc";
  const [auction, setAuction] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/auctions/${auctionId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAuction(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching auction:", error);
        setError("Failed to fetch auction data. Please try again later.");
        setLoading(false);
      }
    };

    fetchAuction();

    socketService.connect("http://localhost:3000");
    socketService.joinAuction(auctionId);

    socketService.on("price update", (newPrice: number) => {
      setAuction((prevAuction: any) => {
        if (prevAuction) {
          return { ...prevAuction, currentPrice: newPrice };
        }
        return prevAuction;
      });
    });

    return () => {
      socketService.leaveAuction(auctionId);
      socketService.disconnect();
    };
  }, [auctionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!auction) {
    return <div>Auction not found</div>;
  }

  return (
    <div>
      <h1>{auction.title}</h1>
      <p>{auction.description}</p>
      <p>Current Price: ${auction.currentPrice}</p>
      <p>End Time: {new Date(auction.endTime).toLocaleString()}</p>
      <BidList auctionId={auctionId} />
      {/* <ChatBox auctionId={auctionId} /> */}
    </div>
  );
};

export default AuctionDetail;
