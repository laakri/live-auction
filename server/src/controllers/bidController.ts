import { FastifyRequest, FastifyReply } from "fastify";
import Bid from "../models/bid.model";
import Auction from "../models/auctions.model";
import User from "../models/users.model";
import { socketHandler } from "../websocket/socketHandler";

export const placeBid = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { auctionId, amount } = request.body as {
    auctionId: string;
    amount: number;
  };
  const userId = request.user!._id;

  try {
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return reply.status(404).send({ error: "Auction not found" });
    }

    if (auction.status !== "active") {
      return reply.status(400).send({ error: "Auction is not active" });
    }

    if (amount <= auction.currentPrice) {
      return reply
        .status(400)
        .send({ error: "Bid must be higher than current price" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    if (user.balance < amount) {
      return reply.status(403).send({ error: "Insufficient balance" });
    }

    const bid = new Bid({
      auction: auctionId,
      bidder: userId,
      amount: amount,
    });

    await bid.save();

    auction.currentPrice = amount;
    auction.bids.push(bid._id);
    await auction.save();

    // Emit real-time update
    socketHandler.emitBid(auctionId, {
      amount,
      bidder: user.username,
      timestamp: bid.timestamp,
    });

    reply.status(201).send(bid);
  } catch (error) {
    reply.status(500).send({ error: "Error placing bid" });
  }
};
export const getBidsByAuctionId = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { auctionId } = request.params as { auctionId: string };

  try {
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return reply.status(404).send({ error: "Auction not found" });
    }

    const bids = await Bid.find({ auction: auctionId })
      .sort({ timestamp: -1 })
      .populate("bidder", "username");

    reply.send(bids);
  } catch (error) {
    console.error("Error fetching bids:", error);
    reply.status(500).send({ error: "Error fetching bids" });
  }
};
