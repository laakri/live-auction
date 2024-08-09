import { FastifyRequest, FastifyReply } from "fastify";
import Bid from "../models/bid.model";
import Auction from "../models/auctions.model";
import User from "../models/users.model";
import { socketHandler } from "../websocket/socketHandler";
import { notificationService } from "../services/notificationService";
import mongoose from "mongoose";

export const placeBid = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { auctionId, amount } = request.body as {
    auctionId: string;
    amount: number;
  };
  const userId = request.user!._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const auction = await Auction.findById(auctionId).session(session);
    if (!auction) {
      await session.abortTransaction();
      return reply.status(404).send({ error: "Auction not found" });
    }

    const now = new Date();
    if (now < auction.startTime || now > auction.endTime) {
      await session.abortTransaction();
      return reply.status(400).send({
        error: "Auction is not active or not within the valid time range",
      });
    }

    if (amount <= auction.currentPrice) {
      await session.abortTransaction();
      return reply
        .status(400)
        .send({ error: "Bid must be higher than current price" });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return reply.status(404).send({ error: "User not found" });
    }

    if (user.balance < amount) {
      await session.abortTransaction();
      return reply.status(403).send({ error: "Insufficient balance" });
    }

    // Check for simultaneous bids
    const latestBid = await Bid.findOne({ auction: auctionId })
      .sort({ amount: -1, timestamp: -1 })
      .session(session);

    if (latestBid && latestBid.amount >= amount) {
      await session.abortTransaction();
      return reply
        .status(400)
        .send({ error: "A higher or equal bid was just placed" });
    }

    const bid = new Bid({
      auction: auctionId,
      bidder: userId,
      amount: amount,
    });

    await bid.save({ session });

    // Update auction
    auction.currentPrice = amount;
    auction.bids.push(bid._id);
    await auction.save({ session });

    // Notify previous highest bidder
    if (latestBid && latestBid.bidder.toString() !== userId.toString()) {
      await notificationService.createNotification(
        latestBid.bidder.toString(),
        "outbid",
        `You've been outbid on the auction "${auction.title}".`,
        auction._id.toString()
      );
    }

    await session.commitTransaction();

    // Emit real-time update
    socketHandler.emitBid(auctionId, {
      amount,
      bidder: user.username,
      timestamp: bid.timestamp,
    });

    reply.status(201).send(bid);
  } catch (error) {
    await session.abortTransaction();
    console.error("Error placing bid:", error);
    reply.status(500).send({ error: "Error placing bid" });
  } finally {
    session.endSession();
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
