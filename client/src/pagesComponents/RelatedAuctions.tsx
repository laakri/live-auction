// src/components/RelatedAuctions.tsx
import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

interface RelatedAuction {
  id: string;
  title: string;
  currentPrice: number;
  image: string;
}

interface RelatedAuctionsProps {
  auctions: RelatedAuction[];
}

const RelatedAuctions: React.FC<RelatedAuctionsProps> = ({ auctions }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Related Auctions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {auctions.map((auction) => (
          <Card key={auction.id}>
            <img
              src={auction.image}
              alt={auction.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{auction.title}</h3>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  ${auction.currentPrice.toFixed(2)}
                </Badge>
                <a
                  href={`/auction/${auction.id}`}
                  className="text-primary hover:underline"
                >
                  View
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedAuctions;
