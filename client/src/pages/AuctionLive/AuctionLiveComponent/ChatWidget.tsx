import React, { useState, useEffect, useRef } from "react";
import { Send, ArrowRightFromLine, Clock, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import useAuthStore from "../../../stores/authStore";
import { socketService } from "../socketService";
import { ScrollArea, ScrollBar } from "../../../components/ui/scroll-area";
import AnimatedBidButton from "../../../components/AnimatedBidButton";
import { Card, CardContent } from "../../../components/ui/card";
interface IChatMessage {
  _id: string;
  auction: string;
  sender: {
    _id: string;
    username: string;
  };
  content: string;
  timestamp: Date;
}

interface IBid {
  _id: string;
  auction: string;
  bidder: {
    _id: string;
    username: string;
  };
  amount: number;
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  auctionId: string;
  currentPrice: number;
}

const ChatMessage: React.FC<{
  message: IChatMessage;
  isCurrentUser: boolean;
}> = ({ message, isCurrentUser }) => (
  <div>
    <div
      className={`max-w-[100%] p-3 rounded-lg shadow-md   ${
        isCurrentUser
          ? " text-purple-700 dark:text-purple-300"
          : " text-black dark:text-white"
      }`}
    >
      <div className="flex gap-1">
        <p className="text-sm">
          <span className="text-md font-bold  ">
            {message.sender.username || "Anonymous"} :{" "}
          </span>
          {message.content}
        </p>
      </div>
      <p className="text-xs mt-1 opacity-75">
        {new Date(message.timestamp).toLocaleTimeString()}
      </p>
    </div>
  </div>
);

const BidMessage: React.FC<{ bid: IBid; isHighestBid: boolean }> = ({
  bid,
  isHighestBid,
}) => (
  <Card className={`mb-4 ${isHighestBid ? "border-gold" : ""}`}>
    <CardContent className="p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div>
            <p className="font-semibold">
              {bid.bidder.username || "Anonymous"}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(bid.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">${bid.amount.toLocaleString()}</p>
          {isHighestBid && <Badge variant="secondary">Highest Bid</Badge>}
        </div>
      </div>
    </CardContent>
  </Card>
);
const TopBids: React.FC<{ bids: IBid[] }> = ({ bids }) => (
  <div className="bg-secondary/30 p-4 rounded-lg mb-4">
    <h3 className="font-semibold mb-2">Top Bids</h3>
    <ScrollArea className="w-full whitespace-nowrap pb-4">
      <div className="flex space-x-2">
        {bids.map((bid, index) => (
          <Badge
            key={index}
            variant="outline"
            className="text-xs whitespace-nowrap py-2"
          >
            {bid.bidder.username || "Anonymous"}: ${bid.amount.toLocaleString()}
          </Badge>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </div>
);

const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen,
  onToggle,
  auctionId,
  currentPrice,
}) => {
  const { token, user } = useAuthStore();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<(IChatMessage | IBid)[]>([]);
  const [topBids, setTopBids] = useState<IBid[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBidHistory, setShowBidHistory] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollToBottom = (smooth = true) => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: smooth ? "smooth" : "auto",
        });
      }
    }
  };

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        const { scrollTop, scrollHeight, clientHeight } = scrollElement;
        setIsNearBottom(scrollHeight - scrollTop - clientHeight < 50);
      }
    }
  };

  useEffect(() => {
    const fetchChatAndBids = async () => {
      if (!token || !user) {
        setError("User is not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [chatResponse, bidsResponse] = await Promise.all([
          fetch(`http://localhost:3000/api/chat/${auctionId}`, { headers }),
          fetch(`http://localhost:3000/api/bids/${auctionId}`, { headers }),
        ]);

        if (chatResponse.ok && bidsResponse.ok) {
          const chatData: IChatMessage[] = await chatResponse.json();
          const bidsData: IBid[] = await bidsResponse.json();

          const combinedData = [...chatData, ...bidsData].sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          setChatMessages(combinedData);
          setTopBids(bidsData.sort((a, b) => b.amount - a.amount).slice(0, 5));
        } else {
          throw new Error("Failed to fetch chat or bids data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load auction data. Please try again.");
      } finally {
        setIsLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    };

    fetchChatAndBids();

    socketService.connect("http://localhost:3000");
    socketService.joinAuction(auctionId);

    socketService.on("new message", (msg: IChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);
      if (isNearBottom) {
        setTimeout(() => scrollToBottom(), 100);
      }
    });

    socketService.on("new bid", (bid: IBid) => {
      setChatMessages((prev) => [...prev, bid]);
      setTopBids((prev) => {
        const newBids = [...prev, bid]
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5);
        return newBids;
      });
      if (isNearBottom) {
        setTimeout(() => scrollToBottom(), 100);
      }
    });

    return () => {
      socketService.leaveAuction(auctionId);
      socketService.off("new message");
      socketService.off("new bid");
    };
  }, [auctionId, token, user, isNearBottom]);

  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom(false);
    }
  }, [chatMessages, isNearBottom]);

  const handleSend = async () => {
    if (message.trim() && user) {
      try {
        const response = await fetch(`http://localhost:3000/api/chat/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            auctionId: auctionId,
            content: message.trim(),
          }),
        });

        if (response.ok) {
          setMessage("");
        } else {
          throw new Error("Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setError("Failed to send message. Please try again.");
      }
    }
  };

  const handlePlaceBid = () => {
    // Implement bid placement logic here
    console.log("Place bid clicked");
  };

  return (
    <div
      className={`fixed right-0 top-16 bottom-0 w-96 border-l shadow-2xl transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } flex flex-col`}
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onToggle}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowRightFromLine className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Live Auction
          </h2>
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setShowBidHistory(!showBidHistory)}
          >
            <Clock className="h-5 w-5" />
          </button>
        </div>
        {!showBidHistory && (
          <>
            <TopBids bids={topBids} />
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-inner flex justify-between items-center">
              <div className="flex flex-col gap-2 items-center ">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Current Bid
                </p>
                <AnimatedBidButton onClick={handlePlaceBid} />
              </div>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                ${currentPrice.toLocaleString()}
              </p>
            </div>
          </>
        )}
      </div>

      <ScrollArea
        ref={scrollAreaRef}
        className="flex-grow"
        onScroll={handleScroll}
      >
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : showBidHistory ? (
            chatMessages
              .filter((item) => "bidder" in item)
              .map((bid: IBid) => (
                <BidMessage key={bid._id} bid={bid} isHighestBid={false} />
              ))
          ) : (
            chatMessages.map((item) =>
              "bidder" in item ? (
                <BidMessage key={item._id} bid={item} isHighestBid={false} />
              ) : (
                <ChatMessage
                  key={item._id}
                  message={item}
                  isCurrentUser={item.sender._id === user?.id}
                />
              )
            )
          )}
        </div>
      </ScrollArea>
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <Textarea
            placeholder="Type your message..."
            className="flex-grow resize-none rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;
