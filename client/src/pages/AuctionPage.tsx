// src/pages/AuctionPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuction, Auction } from "../services/auctionService";
import ChatWidget from "../pagesComponents/ChatWidget";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Heart, Share2 } from "lucide-react";
import CountdownTimer from "../components/CountdownTimer";
import RecentBids from "../pagesComponents/RecentBids";
import WatchersCard from "../pagesComponents/WatchersCard";
import RelatedAuctions from "../pagesComponents/RelatedAuctions";
import ImageGallery from "../pagesComponents/ImageGallery";

const AuctionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const data = await getAuction(id!);
        setAuction(data);
      } catch (error) {
        console.error("Error fetching auction:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="flex justify-center items-center h-screen">
        Auction not found
      </div>
    );
  }

  // Placeholder data for RecentBids and RelatedAuctions
  const recentBids = [
    { id: "1", bidder: "JohnDoe", amount: 150.0, time: "2 minutes ago" },
    { id: "2", bidder: "JaneSmith", amount: 145.0, time: "5 minutes ago" },
    { id: "3", bidder: "BobJohnson", amount: 140.0, time: "10 minutes ago" },
    { id: "4", bidder: "AliceWilliams", amount: 135.0, time: "15 minutes ago" },
    { id: "5", bidder: "CharlieB", amount: 130.0, time: "20 minutes ago" },
  ];

  const relatedAuctions = [
    {
      id: "1",
      title: "Vintage Watch",
      currentPrice: 250.0,
      image: "https://i.gyazo.com/435161d77444fbbc8130c05dbae32a9a.png",
    },
    {
      id: "2",
      title: "Antique Vase",
      currentPrice: 180.0,
      image: "https://i.gyazo.com/4184b3bc572c8a766822589767143dfd.png",
    },
    {
      id: "3",
      title: "Rare Coin",
      currentPrice: 500.0,
      image: "https://i.gyazo.com/134b0eb14155e955a9efcbcd7aa4ae4a.png",
    },
    {
      id: "4",
      title: "Classic Car Model",
      currentPrice: 75.0,
      image: "https://i.gyazo.com/e16d4912ce2fb00a0c4034ef197c2f0b.png",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="mb-4">
            <CardHeader>
              <div className="flex justify-between ">
                <div className="text-3xl  w-max">{auction.title}</div>
                <div className="flex items-center space-x-4 w-max ">
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="mr-2 h-4 w-4" /> Watch
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ImageGallery images={auction.images} />

              <p className="text-gray-600 my-4">{auction.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold">Current Price</h3>
                  <p className="text-2xl font-bold">${auction.currentPrice}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Time Left</h3>
                  <CountdownTimer endTime={auction.endTime} />
                </div>
              </div>
              <Button className="w-full mb-4">Place Bid</Button>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Details</h3>
                <ul className="list-disc list-inside">
                  <li>Starting Price: ${auction.startingPrice}</li>
                  <li>Increment Amount: ${auction.incrementAmount}</li>
                  <li>Category: {auction.category}</li>
                  <li>Status: {auction.status}</li>
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {auction.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <RecentBids bids={recentBids} />
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className=" flex  items-center  justify-between ">
                <div className="flex gap-4 items-center">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="">
                    <p className="font-semibold">{auction.seller.username}</p>
                    <p className="font-light text-gray">
                      {auction.seller.username}
                    </p>
                  </div>
                </div>
                <div>
                  <Button variant={"outline"}> Follow</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* <WatchersCard watchers={auction.watchedBy} /> */}
          <ChatWidget />
        </div>
      </div>

      <RelatedAuctions auctions={relatedAuctions} />
    </div>
  );
};

export default AuctionPage;
