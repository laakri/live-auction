import React, { useState, useEffect, useRef } from "react";
import {
  CornerDownLeft,
  Paperclip,
  ArrowRightFromLine,
  Users,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "../../../components/ui/textarea";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Badge } from "../../../components/ui/badge";
import socket from "../../../utils/socket";
import useAuthStore from "../../../stores/authStore";
import AnimatedBidButton from "../../../components/AnimatedBidButton";

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

const getRandomColor = () => {
  const colors = [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-500",
    "text-purple-500",
    "text-pink-500",
    "text-indigo-500",
    "text-teal-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const ChatMessage: React.FC<{ message: IChatMessage; color: string }> = ({
  message,
  color,
}) => (
  <div className=" p-2 rounded-lg mb-2">
    {/* <span className="text-[10px] opacity-75">
      {new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span> */}
    <span className={`font-semibold ${color}`}>{message.sender.username}:</span>
    <span className="ml-1 text-gray-700 dark:text-gray-100 text-sm">
      {message.content}
    </span>
  </div>
);

const BidMessage: React.FC<{ bid: IBid; color: string }> = ({ bid, color }) => (
  <div className="flex items-start space-x-2 p-2 rounded-lg mb-2 bg-secondary/30">
    <div className="flex-1">
      <p className={`font-semibold ${color}`}>{bid.bidder.username}</p>
      <p className="text-sm">Placed a bid of ${bid.amount.toFixed(2)}</p>
    </div>
    <span className="text-xs opacity-75">
      {new Date(bid.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  </div>
);

const TopBids: React.FC<{ bids: IBid[] }> = ({ bids }) => (
  <div className="bg-secondary p-4 rounded-lg mb-4">
    <h3 className="font-semibold mb-2">Top Bids</h3>
    <div className="flex flex-wrap gap-2">
      {bids.map((bid) => (
        <Badge
          key={bid._id}
          variant="outline"
          className={`text-xs ${getRandomColor()}`}
        >
          {bid.bidder.username}: ${bid.amount.toFixed(2)}
        </Badge>
      ))}
    </div>
  </div>
);

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  auctionId: string;
  currentPrice: number;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen,
  onToggle,
  auctionId,
  currentPrice,
}) => {
  const { isAuthenticated, token } = useAuthStore();

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
  const [bids, setBids] = useState<IBid[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isPlaceBidOpen, setIsPlaceBidOpen] = useState(false);

  useEffect(() => {
    const fetchBidsAndChat = async () => {
      if (!isAuthenticated || !token) {
        console.error("User is not authenticated");
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [bidsResponse, chatResponse] = await Promise.all([
          fetch(`http://localhost:3000/api/bids/${auctionId}`, { headers }),
          fetch(`http://localhost:3000/api/chat/${auctionId}`, { headers }),
        ]);

        if (bidsResponse.ok && chatResponse.ok) {
          const bidsData = await bidsResponse.json();
          const chatData = await chatResponse.json();

          setBids(bidsData);
          setChatMessages(chatData);
        } else {
          console.error("Failed to fetch bids or chat data");
        }
      } catch (error) {
        console.error("Error fetching bids and chat data:", error);
      }
    };

    fetchBidsAndChat();

    socket.on("new message", (msg: IChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    socket.on("new bid", (bid: IBid) => {
      setBids((prev) => {
        const newBids = [...prev, bid];
        return newBids.sort((a, b) => b.amount - a.amount).slice(0, 5);
      });
      setChatMessages((prev) => [
        ...prev,
        {
          _id: bid._id,
          auction: bid.auction,
          sender: bid.bidder,
          content: `Placed a bid of $${bid.amount.toFixed(2)}`,
          timestamp: bid.timestamp,
        },
      ]);
    });

    return () => {
      socket.off("new message");
      socket.off("new bid");
    };
  }, [auctionId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = async () => {
    if (message.trim()) {
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
          const newMessage = await response.json();
          setChatMessages((prev) => [...prev, newMessage]);
          setMessage("");
        } else {
          console.error("Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handlePlaceBid = () => {
    setIsPlaceBidOpen(true);
  };

  return (
    <TooltipProvider>
      <div
        className={`fixed right-0 top-16 bottom-0 w-96 bg-background shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onToggle}
              className="p-2 rounded-full hover:bg-secondary"
            >
              <ArrowRightFromLine className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold">Live Auction Chat</h2>
            <button className="p-2 rounded-full hover:bg-secondary">
              <Users className="h-5 w-5" />
            </button>
          </div>
          <TopBids bids={bids} />
          <div className="flex items-center justify-between bg-secondary/30 rounded-lg py-2 px-4 ">
            <div>
              <p className="text-sm text-gray">Current Bid</p>
              <p className="text-2xl font-bold text-primary">${currentPrice}</p>
            </div>
            <AnimatedBidButton onClick={() => setIsPlaceBidOpen(true)} />
          </div>
        </div>

        {/* Scrollable message area */}
        <ScrollArea ref={scrollAreaRef} className="flex-grow p-4">
          <div className="space-y-2">
            {chatMessages.map((msg) =>
              msg.content.startsWith("Placed a bid of $") ? (
                <BidMessage
                  key={msg._id}
                  bid={msg as unknown as IBid}
                  color={getRandomColor()}
                />
              ) : (
                <ChatMessage key={msg._id} message={msg} color={"white"} />
              )
            )}
          </div>
        </ScrollArea>

        {/* Fixed form at the bottom */}
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative overflow-hidden rounded-lg border focus-within:ring-1 focus-within:ring-primary"
          >
            <Label className="sr-only">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              className="min-h-12 max-h-32 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex items-center p-3 pt-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="ghost" size="icon">
                    <Paperclip className="size-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Attach File</TooltipContent>
              </Tooltip>

              <Button type="submit" size="sm" className="ml-auto gap-1.5">
                Send
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ChatWidget;
