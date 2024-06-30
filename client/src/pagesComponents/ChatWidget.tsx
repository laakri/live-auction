// src/components/ChatWidget.tsx
import { CornerDownLeft, Paperclip } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "../components/ui/textarea";
import { ScrollArea } from "../components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";

// New component for displaying bids
const BidMessage: React.FC<{
  username: string;
  amount: number;
  timestamp: string;
}> = ({ username, amount, timestamp }) => (
  <div className="flex items-center space-x-2 p-2 rounded-lg  mb-2">
    <Avatar>
      <AvatarImage src={`https://avatar.vercel.sh/${username}`} />
      <AvatarFallback>{username[0]}</AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <p className="font-semibold ">{username}</p>
      <Badge variant="secondary" className="text-xs">
        ${amount.toFixed(2)}
      </Badge>
    </div>
    <span className="text-xs  opacity-75">{timestamp}</span>
  </div>
);

const ChatWidget: React.FC = () => {
  const [message, setMessage] = useState("");

  // Dummy data for bids
  const bids = [
    { username: "Alice", amount: 100.5, timestamp: "2m ago" },
    { username: "Bob", amount: 150.75, timestamp: "5m ago" },
    { username: "Charlie", amount: 200.0, timestamp: "10m ago" },
  ];

  const handleSend = () => {
    // Logic to send message
    setMessage("");
  };

  return (
    <TooltipProvider>
      <div className="p-4 rounded-lg shadow-md border top-8 sticky">
        <h2 className="text-xl font-semibold mb-4 ">Community Chat & Bids</h2>
        <ScrollArea className="h-64 mb-4 p-2 rounded">
          {bids.map((bid, index) => (
            <BidMessage key={index} {...bid} />
          ))}
        </ScrollArea>

        <form className="relative overflow-hidden rounded-lg border bg-gray-700 focus-within:ring-1 focus-within:ring-purple-500">
          <Label className="sr-only">Message</Label>
          <Textarea
            id="message"
            placeholder="Type your message or bid here..."
            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:"
                >
                  <Paperclip className="size-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach File</TooltipContent>
            </Tooltip>

            <Button
              type="submit"
              size="sm"
              className="ml-auto gap-1.5 bg-purple-600 hover:bg-purple-700 "
              onClick={handleSend}
            >
              Send
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </TooltipProvider>
  );
};

export default ChatWidget;
