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
const ChatWidget: React.FC = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    // Logic to send message
    setMessage("");
  };

  return (
    <TooltipProvider>
      <div className=" p-4 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4">Community Chat</h2>
        <div className="h-64 overflow-y-auto mb-4  p-2 rounded"></div>

        <form className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
          <Label className="sr-only">Message</Label>
          <Textarea
            id="message"
            placeholder="Type your message here..."
            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Paperclip className="size-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach File</TooltipContent>
            </Tooltip>

            <Button
              type="submit"
              size="sm"
              className="ml-auto gap-1.5"
              onClick={handleSend}
            >
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </TooltipProvider>
  );
};

export default ChatWidget;
