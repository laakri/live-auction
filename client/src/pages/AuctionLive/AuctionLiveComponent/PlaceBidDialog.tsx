// src/pages/AuctionLiveComponent/PlaceBidDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import useAuthStore from "../../../stores/authStore";

interface PlaceBidDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceBid: (amount: number) => void;
  currentPrice: number;
  incrementAmount: number;
  auctionId: string;
}

const PlaceBidDialog: React.FC<PlaceBidDialogProps> = ({
  isOpen,
  onClose,
  onPlaceBid,
  currentPrice,
  incrementAmount,
  auctionId,
}) => {
  const [bidAmount, setBidAmount] = useState(currentPrice + incrementAmount);
  const { token } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount > currentPrice) {
      try {
        const response = await fetch("http://localhost:3000/api/bids", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            auctionId,
            amount: bidAmount,
          }),
        });

        if (response.ok) {
          onPlaceBid(bidAmount);
          onClose();
        } else {
          console.error("Failed to submit bid");
        }
      } catch (error) {
        console.error("Error submitting bid:", error);
      }
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Place a Bid</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="bid-amount" className="text-right">
                Bid Amount
              </label>
              <Input
                id="bid-amount"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                min={currentPrice + incrementAmount}
                step={incrementAmount}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Place Bid</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlaceBidDialog;
