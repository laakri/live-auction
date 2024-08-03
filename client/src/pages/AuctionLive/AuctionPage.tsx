// src/pages/AuctionPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Auction } from "../../services/auctionService";
import ChatWidget from "./AuctionLiveComponent/ChatWidget";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import {
  AlertTriangle,
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
import PlaceBidDialog from "./AuctionLiveComponent/PlaceBidDialog";
import { socketService } from "./socketService";
import AnimatedBidButton from "../../components/AnimatedBidButton";
import { useToast } from "../../components/ui/use-toast";
import { useAuth } from "../../hooks/useAuth";
import OwnerControls from "./AuctionLiveComponent/OwnerControls";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Settings } from "lucide-react";
import LiveViewerCount from "./LiveViewerCount";

const AuctionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isPlaceBidOpen, setIsPlaceBidOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [isOwnerControlsOpen, setIsOwnerControlsOpen] = useState(false);

  const toggleChat = () => {
    if (auction?.ownerControls.isChatOpen) {
      setIsChatOpen(!isChatOpen);
    }
  };

  useEffect(() => {
    const fetchAuction = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auctions/${id}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Auction not found");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setAuction(data);
      } catch (error) {
        console.error("Error fetching auction:", error);
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          setError("Network error. Please check your internet connection.");
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      } finally {
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

    socketService.on("owner controls update", (data: any) => {
      setAuction((prevAuction) => {
        if (prevAuction) {
          return {
            ...prevAuction,
            ownerControls: { ...prevAuction.ownerControls, ...data },
          };
        }
        return prevAuction;
      });
      if (data.isChatOpen === false) {
        setIsChatOpen(false);
      }
    });

    socketService.on("auction ended", () => {
      setAuction((prevAuction) => {
        if (prevAuction) {
          return { ...prevAuction, status: "ended" };
        }
        return prevAuction;
      });
      setIsChatOpen(false);
      toast({
        title: "Auction Ended",
        description: "This auction has been ended by the owner.",
        variant: "default",
      });
    });

    return () => {
      if (id) socketService.leaveAuction(id);
      socketService.disconnect();
    };
  }, [id, toast]);

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

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-red-400 text-center">{error}</p>
        <Button className="mt-4 " onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="flex justify-center items-center h-screen">
        No auction data available
      </div>
    );
  }

  const isOwner =
    !!user?._id && !!auction?.seller?._id && user._id === auction.seller._id;

  const now = new Date();
  const auctionEndDate = new Date(auction.endTime);
  const isEnded = now >= auctionEndDate;

  return (
    <div
      className={`mx-auto transition-all duration-300 ease-in-out ${
        isChatOpen && auction.ownerControls?.isChatOpen && !isEnded
          ? "pr-96"
          : ""
      }`}
    >
      <div className="flex flex-col mt-4 transition-all duration-300 ease-in-out">
        <Card className="mb-4 border-0 shadow-none">
          <CardContent>
            <div className="relative mb-4">
              <ImageGallery images={auction.images} />
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-background to-transparent p-4">
                <div className="flex items-end justify-between">
                  <div className="flex flex-col gap-2">
                    <Avatar className="rounded-md min-h-16 min-w-16">
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
                        <BadgeCheck className="h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-600 dark:text-gray-300">
                          |
                        </span>
                        <Globe className="h-4" />
                      </p>
                      <button className="my-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_200%] animate-gradient text-white font-bold py-1 px-2 rounded-lg transform transition-transform duration-300 hover:scale-105 shadow-md hover:shadow-lg focus:outline-none">
                        Follow
                      </button>
                      {!isEnded && (
                        <div className="bg-[#24342b] text-[#79fbb8] flex items-center px-2 rounded-lg">
                          <Circle className="h-2 live-pulse" />
                          <span>Auction Live</span>
                        </div>
                      )}
                      {isEnded && (
                        <div className="bg-red-900 text-red-200 flex items-center px-2 rounded-lg">
                          <AlertTriangle className="h-4 mr-1" />
                          <span>Auction Ended</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {!isEnded && (
                    <AnimatedBidButton
                      onClick={() => setIsPlaceBidOpen(true)}
                    />
                  )}
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
                      <span className="text-xl font-bold">
                        ${auction.startingPrice}
                      </span>
                      <span className="text-sm text-gray-900 dark:text-gray-300">
                        Started Price
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-bold">
                        {!isEnded ? (
                          <CountdownTimer
                            endTime={auction.endTime}
                            size="sm"
                            shortLabels={true}
                          />
                        ) : (
                          "Ended"
                        )}
                      </span>
                      <span className="text-sm text-gray-900 dark:text-gray-300">
                        {!isEnded ? "Time Left" : "Auction Status"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-2 right-2 flex space-x-2">
                <LiveViewerCount
                  auctionId={id!}
                  initialViewers={auction.currentViewers}
                />
              </div>
            </div>
            <div className="flex flex-col gap-6 mb-6">
              <div className="col-span-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{auction.title}</h1>
                    <Badge variant="secondary">
                      {auction.totalUniqueViewers} total views
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="mr-2 h-4 w-4" /> Watch
                    </Button>
                    {isOwner && (
                      <Dialog
                        open={isOwnerControlsOpen}
                        onOpenChange={setIsOwnerControlsOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Settings className="mr-2 h-4 w-4" /> Owner Controls
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Owner Controls</DialogTitle>
                          </DialogHeader>
                          <OwnerControls auction={auction} />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {auction.description}
                </p>
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold mb-4">Key Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Starting Price",
                        value: `$${auction.startingPrice}`,
                      },
                      {
                        label: "Increment Amount",
                        value: `$${auction.incrementAmount}`,
                      },
                      { label: "Category", value: auction.category },
                      { label: "Status", value: isEnded ? "Ended" : "Active" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-700/50 rounded-md p-3 shadow-sm"
                      >
                        <p className="text-sm text-muted-foreground mb-1">
                          {item.label}
                        </p>
                        <p className="font-medium text-foreground">
                          {item.value}
                        </p>
                      </div>
                    ))}
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
            <div>
              {/* ... other auction details ... */}
              {auction.bids && <RecentBids bids={auction.bids as any[]} />}
              <RelatedAuctions auctions={[]} />
              {/* ... rest of the component ... */}
            </div>
          </CardContent>
        </Card>
      </div>
      {!isEnded && auction.ownerControls?.isChatOpen && (
        <ChatWidget
          isOpen={isChatOpen}
          onToggle={toggleChat}
          auctionId={id!}
          currentPrice={auction.currentPrice}
        />
      )}
      <PlaceBidDialog
        isOpen={isPlaceBidOpen}
        onClose={() => setIsPlaceBidOpen(false)}
        onPlaceBid={handlePlaceBid}
        currentPrice={auction.currentPrice}
        incrementAmount={auction.incrementAmount}
        auctionId={id!}
      />

      {!isChatOpen && !isEnded && auction.ownerControls.isChatOpen && (
        <Button
          size="icon"
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
