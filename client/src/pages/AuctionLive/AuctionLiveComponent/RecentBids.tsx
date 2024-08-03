import React, { useState } from "react";
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
import { Button } from "../../../components/ui/button";

interface Bid {
  _id: string;
  bidder: {
    _id: string;
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
  const [visibleBids, setVisibleBids] = useState(5);

  const showMoreBids = () => {
    setVisibleBids((prevVisible) => Math.min(prevVisible + 5, bids.length));
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Recent Bids</CardTitle>
      </CardHeader>
      <CardContent>
        {bids.length > 0 ? (
          <>
            <div className="relative">
              <div
                className={
                  visibleBids < bids.length ? "max-h-60 overflow-hidden" : ""
                }
              >
                {bids.slice(0, visibleBids).map((bid) => (
                  <div
                    key={bid._id}
                    className="flex items-center justify-between mb-2"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        {bid.bidder.customizations?.avatar && (
                          <AvatarImage
                            src={bid.bidder.customizations.avatar}
                            alt={bid.bidder.username}
                          />
                        )}
                        <AvatarFallback>
                          {bid.bidder.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{bid.bidder.username}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold mr-2">
                        ${bid.amount.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(bid.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {visibleBids < bids.length && (
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none" />
              )}
            </div>
            {visibleBids < bids.length && (
              <Button
                onClick={showMoreBids}
                variant="ghost"
                className="mt-4 w-full"
              >
                Show More
              </Button>
            )}
          </>
        ) : (
          <p>No bids yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentBids;
