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

type ChatMessage = {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  color: string;
};

type Bid = {
  id: string;
  username: string;
  amount: number;
  timestamp: Date;
  color: string;
};

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

const ChatMessage: React.FC<{ message: ChatMessage }> = ({ message }) => (
  <div className="flex items-start space-x-2 p-2 rounded-lg mb-2">
    <div className="flex-1">
      <p className={`font-semibold ${message.color}`}>{message.username}</p>
      <p className="text-sm">{message.content}</p>
    </div>
    <span className="text-xs opacity-75">
      {message.timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  </div>
);

const TopBids: React.FC<{ bids: Bid[] }> = ({ bids }) => (
  <div className="bg-secondary p-4 rounded-lg mb-4">
    <h3 className="font-semibold mb-2">Top Bids</h3>
    <div className="flex flex-wrap gap-2">
      {bids.map((bid) => (
        <Badge
          key={bid.id}
          variant="outline"
          className={`text-xs ${bid.color}`}
        >
          {bid.username}: ${bid.amount.toFixed(2)}
        </Badge>
      ))}
    </div>
  </div>
);

const ChatWidget: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({
  isOpen,
  onToggle,
}) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [latestBid, setLatestBid] = useState<Bid | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };
  useEffect(scrollToBottom, [chatMessages]);

  // Simulating incoming messages and bids
  useEffect(() => {
    const timer = setInterval(() => {
      const isChat = Math.random() > 0.3;
      if (isChat) {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          username: `User${Math.floor(Math.random() * 100)}`,
          content: `Random message ${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date(),
          color: getRandomColor(),
        };
        setChatMessages((prev) => [...prev, newMessage]);
      } else {
        const newBid: Bid = {
          id: Date.now().toString(),
          username: `User${Math.floor(Math.random() * 100)}`,
          amount: Math.floor(Math.random() * 1000) + 100,
          timestamp: new Date(),
          color: getRandomColor(),
        };
        setBids((prev) =>
          [...prev, newBid].sort((a, b) => b.amount - a.amount).slice(0, 5)
        );
        setLatestBid(newBid);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        username: "You",
        content: message.trim(),
        timestamp: new Date(),
        color: getRandomColor(),
      };
      setChatMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };
  return (
    <TooltipProvider>
      <div
        className={`fixed right-0 top-16 bottom-0 w-96 bg-background shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Fixed header */}
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
              <p className="text-2xl font-bold text-primary">$120</p>
            </div>
            <Button className="px-8">Place Bid</Button>
          </div>
        </div>

        {/* Scrollable message area */}
        <ScrollArea ref={scrollAreaRef} className="flex-grow p-4">
          <div className="space-y-2">
            {chatMessages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
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
