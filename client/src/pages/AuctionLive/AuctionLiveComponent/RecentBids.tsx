import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";

interface Bid {
  _id: string;
  bidder: {
    username: string;
    customizations?: {
      avatar?: string;
    };
  };
  amount: number;
  timestamp: string;
}

interface RecentBidsProps {
  bids: Bid[];
}

const RecentBids: React.FC<RecentBidsProps> = ({ bids }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Recent Bids</CardTitle>
      </CardHeader>
      <CardContent>
        {bids.length > 0 ? (
          bids.map((bid) => (
            <div
              key={bid._id}
              className="flex items-center justify-between mb-2"
            >
              <div className="flex items-center">
                {/* <Avatar className="h-8 w-8 mr-2">
                  {bid.bidder.customizations && (
                    <AvatarImage
                      src={bid.bidder.customizations?.avatar}
                      alt={bid.bidder.username}
                    />
                  )}
                  <AvatarFallback>
                    {bid.bidder.username.charAt(0)}
                  </AvatarFallback>
                </Avatar> */}
                {/* <span>{bid.bidder.username}</span> */}
              </div>
              <div className="flex items-center">
                {/* <span className="font-bold mr-2">${bid.amount.toFixed(2)}</span> */}
                <span className="text-sm text-gray-500">
                  {/* {new Date(bid.timestamp).toLocaleString()} */}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No bids yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentBids;
