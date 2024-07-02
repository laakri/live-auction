// src/pages/AuctionPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuction, Auction } from "../../services/auctionService";
import ChatWidget from "./AuctionLiveComponent/ChatWidget";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Circle, Heart, Icon, MessageCircle, Share2 } from "lucide-react";
import CountdownTimer from "../../components/CountdownTimer";
import RecentBids from "./AuctionLiveComponent/RecentBids";
import RelatedAuctions from "./AuctionLiveComponent/RelatedAuctions";
import ImageGallery from "./AuctionLiveComponent/ImageGallery";
import WatchersCard from "./AuctionLiveComponent/WatchersCard";

const AuctionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

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
    <div
      className={` mx-auto py-4 mt-8 transition-all duration-300 ease-in-out ${
        isChatOpen ? "pr-96" : ""
      }`}
    >
      <div
        className={"flex flex-col mt-4 transition-all duration-300 ease-in-out"}
      >
        <Card className="mb-4 border-0 shadow-none">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{auction.title}</h1>
              <div className="flex items-center space-x-4">
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
            <div className="relative mb-4">
              <ImageGallery images={auction.images} />
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-background to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center ">
                    <Avatar className="rounded-md min-h-16 min-w-16 ">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="bg-[#24342b] text-[#6cbe93] flex items-center">
                        <Circle className="h-2 live-pulse" />
                        <span>Auction Live</span>
                      </div>
                      <p className="font-semibold">{auction.seller.username}</p>
                      <p className="text-sm opacity-75">
                        {/* {auction.seller.rating} ★ */}★★★★★
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Follow</Button>
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <WatchersCard watchers={auction.watchedBy.length} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="col-span-2">
                <h2 className="text-2xl font-bold mb-3">{auction.title}</h2>
                <p className="text-gray-600 mb-4">{auction.description}</p>

                <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold mb-2">Key Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Starting Price</p>
                      <p className="font-medium">${auction.startingPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Increment Amount</p>
                      <p className="font-medium">${auction.incrementAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">{auction.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium">{auction.status}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {auction.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold mb-2">Current Price</h3>
                  <p className="text-3xl font-bold text-primary mb-4">
                    ${auction.currentPrice}
                  </p>

                  <h3 className="font-semibold mb-2">Time Left</h3>
                  <div className="text-xl font-medium mb-6">
                    <CountdownTimer endTime={auction.endTime} />
                  </div>
                </div>

                <Button className="w-full text-lg py-6" size="lg">
                  Place Bid
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <RecentBids bids={recentBids} />
        <RelatedAuctions auctions={relatedAuctions} />
      </div>

      <ChatWidget isOpen={isChatOpen} onToggle={toggleChat} />
      {!isChatOpen && (
        <Button
          size={"icon"}
          className="fixed bottom-4 right-4 bg-purple-600 text-white hover:bg-purple-500"
          onClick={toggleChat}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        // <button
        //   onClick={toggleChat}
        //   className="fixed bottom-4 right-4 p-3 rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 ease-in-out hover:bg-primary/90"
        // >
        //   <MessageCircle className="h-6 w-6" />

        // </button>
      )}
    </div>
  );
};

export default AuctionPage;
