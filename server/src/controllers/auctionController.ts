import { FastifyRequest, FastifyReply } from "fastify";
import Auction, { IAuction } from "../models/auctions.model";
import User from "../models/users.model";

export const createAuction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const auctionData = request.body as IAuction;
  const userId = request.user!._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    if (user.freeAuctionsRemaining > 0) {
      user.freeAuctionsRemaining--;
    } else if (user.balance < 1) {
      // Assuming 1 credit to create an auction
      return reply.status(403).send({ error: "Insufficient credits" });
    } else {
      user.balance -= 1;
    }

    const auction = new Auction({
      ...auctionData,
      seller: userId,
      status: "upcoming",
    });

    await auction.save();
    user.createdAuctions.push(auction._id);
    await user.save();

    reply.status(201).send(auction);
  } catch (error) {
    reply.status(500).send({ error: "Error creating auction" });
  }
};

export const getAuction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };

  try {
    const auction = await Auction.findById(id).populate("seller", "username");
    if (!auction) {
      return reply.status(404).send({ error: "Auction not found" });
    }
    reply.send(auction);
  } catch (error) {
    reply.status(500).send({ error: "Error fetching auction" });
  }
};

// Add more controller methods as needed (updateAuction, deleteAuction, etc.)
