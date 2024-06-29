// src/components/LiveAuctions.tsx
import React from "react";
import { Button } from "../components/ui/button";

const LiveAuctions: React.FC = () => {
  return (
    <section className="p-6 rounded-lg shadow-md border">
      <h2 className="text-2xl font-semibold mb-4">Live Auctions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Auction items would go here */}
        <div className="border p-4 rounded">
          <h3 className="font-bold">Vintage Watch</h3>
          <p className="text-sm ">Current Bid: $500</p>
          <div className="mt-2">
            <Button variant="outline" className="mr-2">
              Place Bid
            </Button>
            <Button>Watch</Button>
          </div>
        </div>
        {/* More auction items... */}
      </div>
    </section>
  );
};

export default LiveAuctions;
