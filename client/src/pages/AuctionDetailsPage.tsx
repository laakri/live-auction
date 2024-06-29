import React from "react";
import { useParams } from "react-router-dom";

const AuctionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Auction Details</h1>
      <p>Auction ID: {id}</p>
      {/* Add detailed auction information and bidding interface */}
    </div>
  );
};

export default AuctionDetailsPage;
