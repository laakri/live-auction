import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Switch } from "../../../components/ui/switch";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { Auction } from "../../../services/auctionService";
import { Settings, MessageSquare, Clock, AlertTriangle } from "lucide-react";
import axios from "axios";
import { useToast } from "../../../components/ui/use-toast";

interface OwnerControlsProps {
  auction: Auction;
}

const OwnerControls: React.FC<OwnerControlsProps> = ({ auction }) => {
  const [isChatOpen, setIsChatOpen] = useState(
    auction.ownerControls.isChatOpen
  );
  const [canEndEarly, setCanEndEarly] = useState(
    auction.ownerControls.canEndEarly
  );
  const { toast } = useToast();

  const handleChatToggle = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/auctions/${auction._id}/owner-controls`,
        {
          isChatOpen: !isChatOpen,
        }
      );
      if (response.status === 200) {
        setIsChatOpen(!isChatOpen);
        toast({
          title: "Chat settings updated",
          description: `Chat is now ${!isChatOpen ? "open" : "closed"}.`,
        });
      }
    } catch (error) {
      console.error("Error updating chat settings:", error);
      toast({
        title: "Error",
        description: "Failed to update chat settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEndEarlyToggle = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/auctions/${auction._id}/owner-controls`,
        {
          canEndEarly: !canEndEarly,
        }
      );
      if (response.status === 200) {
        setCanEndEarly(!canEndEarly);
        toast({
          title: "Early end settings updated",
          description: `Early ending is now ${
            !canEndEarly ? "allowed" : "disallowed"
          }.`,
        });
      }
    } catch (error) {
      console.error("Error updating early end settings:", error);
      toast({
        title: "Error",
        description: "Failed to update early end settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEndAuction = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/auctions/${auction._id}/end-early`
      );
      if (response.status === 200) {
        toast({
          title: "Auction ended",
          description: "The auction has been ended successfully.",
        });
      }
    } catch (error) {
      console.error("Error ending auction:", error);
      toast({
        title: "Error",
        description: "Failed to end the auction. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mt-6 bg-secondary/30">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="mr-2" />
          Owner Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="text-primary" />
            <Label htmlFor="chat-toggle">Chat Open</Label>
          </div>
          <Switch
            id="chat-toggle"
            checked={isChatOpen}
            onCheckedChange={handleChatToggle}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="text-primary" />
            <Label htmlFor="end-early-toggle">Allow Early End</Label>
          </div>
          <Switch
            id="end-early-toggle"
            checked={canEndEarly}
            onCheckedChange={handleEndEarlyToggle}
          />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="w-full"
              disabled={!canEndEarly || auction.status !== "active"}
            >
              End Auction Early
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently end the
                auction and notify all participants.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleEndAuction}>
                End Auction
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default OwnerControls;
