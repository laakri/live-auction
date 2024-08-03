// src/services/auctionService.ts
import axios from "axios";

const API_URL = "http://localhost:3000/api";

export interface Auction {
  _id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  incrementAmount: number;
  startTime: string;
  endTime: string;
  seller: any;
  category: string;
  tags: string[];
  images: string[];
  isPrivate: boolean;
  invitedUsers: string[];
  status: string;
  bids: {
    _id: string;
    bidder: {
      username: string;
      customizations?: {
        avatar?: string;
      };
    };
    amount: number;
    timestamp: string;
  }[];
  watchedBy: string[];
  createdAt: string;
  updatedAt: string;
  ownerControls: {
    isChatOpen: boolean;
    canEndEarly: boolean;
  };
  currentViewers: number;
  totalUniqueViewers: number;
}

export const getAuction = async (id: string): Promise<Auction> => {
  const response = await axios.get(`${API_URL}/auctions/${id}`);
  return response.data;
};
