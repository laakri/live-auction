// src/pages/AuctionPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Auction } from "../../services/auctionService";
import ChatWidget from "./AuctionLiveComponent/ChatWidget";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import {
  BadgeCheck,
  Circle,
  Globe,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import CountdownTimer from "../../components/CountdownTimer";
import RecentBids from "./AuctionLiveComponent/RecentBids";
import RelatedAuctions from "./AuctionLiveComponent/RelatedAuctions";
import ImageGallery from "./AuctionLiveComponent/ImageGallery";
import WatchersCard from "./AuctionLiveComponent/WatchersCard";
import PlaceBidDialog from "./AuctionLiveComponent/PlaceBidDialog";
import { socketService } from "./socketService";
import AnimatedBidButton from "../../components/AnimatedBidButton";

const AuctionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isPlaceBidOpen, setIsPlaceBidOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  useEffect(() => {
    const fetchAuction = async () => {
      if (!id) return;
      try {
        const response = await fetch(
          `http://localhost:3000/api/auctions/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
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
    if (id) socketService.joinAuction(id);

    socketService.on("price update", (newPrice: number) => {
      setAuction((prevAuction) => {
        if (prevAuction) {
          return { ...prevAuction, currentPrice: newPrice };
        }
        return prevAuction;
      });
    });

    return () => {
      if (id) socketService.leaveAuction(id);
      socketService.disconnect();
    };
  }, [id]);

  const handlePlaceBid = async (amount: number) => {
    try {
      const response = await fetch("http://localhost:3000/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          amount: amount,
        }),
      });
      if (response.ok) {
      } else {
        console.error("Failed to submit bid");
      }
    } catch (error) {
      console.error("Error submitting bid:", error);
    }
  };

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
      className={` mx-auto transition-all duration-300 ease-in-out ${
        isChatOpen ? "pr-96" : ""
      }`}
    >
      <div
        className={"flex flex-col mt-4 transition-all duration-300 ease-in-out"}
      >
        <Card className="mb-4 border-0 shadow-none">
          <CardContent>
            <div className="relative mb-4">
              <ImageGallery images={auction.images} />
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-background to-transparent p-4">
                <div className="flex items-end justify-between">
                  <div className="flex flex-col  gap-2 ">
                    <Avatar className="rounded-md min-h-16 min-w-16 ">
                      <AvatarImage
                        src={auction.seller.customizations.avatar}
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold flex items-center gap-1">
                        <span className="text-lg">
                          {auction.seller.username}
                        </span>
                        <BadgeCheck className="h-5  text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-600 dark:text-gray-300">
                          |
                        </span>
                        <Globe className="h-4" />
                      </p>
                      <button className="my-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_200%] animate-gradient text-white font-bold py-1 px-2 rounded-lg transform transition-transform duration-300 hover:scale-105 shadow-md hover:shadow-lg focus:outline-none">
                        Follow
                      </button>
                      <div className="bg-[#24342b] text-[#79fbb8] flex items-center  px-2 rounded-lg">
                        <Circle className="h-2 live-pulse" />
                        <span>Auction Live</span>
                      </div>
                    </div>
                  </div>
                  <AnimatedBidButton onClick={() => setIsPlaceBidOpen(true)} />

                  <div className="flex items-end gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-bold text-green-500 dark:text-green-400">
                        ${auction.currentPrice}
                      </span>
                      <span className="text-sm text-gray-900 dark:text-gray-300">
                        Current Price
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-bold  ">
                        ${auction.startingPrice}
                      </span>
                      <span className="text-sm text-gray-900 dark:text-gray-300">
                        Started Price
                      </span>
                    </div>
                    <div className="flex flex-col items-center ">
                      <span className="text-xl font-bold ">
                        <CountdownTimer
                          endTime={auction.endTime}
                          size="sm"
                          shortLabels={true}
                        />
                      </span>
                      <span className="text-sm text-gray-900 dark:text-gray-300">
                        Time Left
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <WatchersCard watchers={auction.watchedBy.length} />
              </div>
            </div>
            <div className="flex flex-col gap-6 mb-6">
              <div className="col-span-2">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">{auction.title}</h1>
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="mr-2 h-4 w-4" />
                      Watch
                    </Button>
                  </div>
                </div>{" "}
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {auction.description}
                </p>
                <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold mb-2">Key Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Starting Price
                      </p>
                      <p className="font-medium">${auction.startingPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Increment Amount
                      </p>
                      <p className="font-medium">${auction.incrementAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Category
                      </p>
                      <p className="font-medium">{auction.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Status
                      </p>
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
            </div>
          </CardContent>
        </Card>

        <RecentBids bids={recentBids} />
        <RelatedAuctions auctions={relatedAuctions} />
      </div>
      <ChatWidget
        isOpen={isChatOpen}
        onToggle={toggleChat}
        auctionId={id!}
        currentPrice={auction?.currentPrice || 0}
      />
      <PlaceBidDialog
        isOpen={isPlaceBidOpen}
        onClose={() => setIsPlaceBidOpen(false)}
        onPlaceBid={handlePlaceBid}
        currentPrice={auction?.currentPrice || 0}
        incrementAmount={auction?.incrementAmount || 1}
        auctionId={id!}
      />

      {!isChatOpen && (
        <Button
          size={"icon"}
          className="fixed bottom-4 right-4 bg-purple-600 text-white hover:bg-purple-500"
          onClick={toggleChat}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default AuctionPage;
