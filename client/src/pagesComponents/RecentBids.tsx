// src/components/RecentBids.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

interface Bid {
  id: string;
  bidder: string;
  amount: number;
  time: string;
}

interface RecentBidsProps {
  bids: Bid[];
}

const RecentBids: React.FC<RecentBidsProps> = ({ bids }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bids</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {bids.map((bid) => (
            <li key={bid.id} className="flex justify-between items-center">
              <span>{bid.bidder}</span>
              <span className="font-semibold">${bid.amount.toFixed(2)}</span>
              <span className="text-sm text-gray-500">{bid.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecentBids;
