import { FastifyRequest, FastifyReply } from "fastify";
import Auction, { IAuction } from "../models/auctions.model";
import User from "../models/users.model";
import mongoose from "mongoose";

export const createAuction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const auctionData = request.body as Omit<
    IAuction,
    "_id" | "seller" | "status" | "currentPrice"
  >;
  const userId = request.user!._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    if (user.freeAuctionsRemaining > 0) {
      user.freeAuctionsRemaining--;
    } else if (user.balance < 1) {
      return reply.status(403).send({ error: "Insufficient credits" });
    } else {
      user.balance -= 1;
    }

    const auction = new Auction({
      ...auctionData,
      seller: userId,
      status: "upcoming",
      currentPrice: auctionData.startingPrice,
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

export const updateAuction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const updates = request.body as Partial<IAuction>;
  const userId = request.user!._id;

  try {
    const auction = await Auction.findById(id);
    if (!auction) {
      return reply.status(404).send({ error: "Auction not found" });
    }

    if (auction.seller.toString() !== userId.toString()) {
      return reply
        .status(403)
        .send({ error: "Not authorized to update this auction" });
    }

    if (auction.status !== "upcoming") {
      return reply
        .status(400)
        .send({ error: "Cannot update an active or ended auction" });
    }

    Object.assign(auction, updates);
    await auction.save();

    reply.send(auction);
  } catch (error) {
    reply.status(500).send({ error: "Error updating auction" });
  }
};

export const deleteAuction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const userId = request.user!._id;

  try {
    const auction = await Auction.findById(id);
    if (!auction) {
      return reply.status(404).send({ error: "Auction not found" });
    }

    if (auction.seller.toString() !== userId.toString()) {
      return reply
        .status(403)
        .send({ error: "Not authorized to delete this auction" });
    }

    if (auction.status !== "upcoming") {
      return reply
        .status(400)
        .send({ error: "Cannot delete an active or ended auction" });
    }

    await auction.deleteOne();
    await User.findByIdAndUpdate(userId, { $pull: { createdAuctions: id } });

    reply.send({ message: "Auction deleted successfully" });
  } catch (error) {
    reply.status(500).send({ error: "Error deleting auction" });
  }
};

export const listAuctions = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const {
    category,
    status,
    limit = 10,
    page = 1,
  } = request.query as {
    category?: string;
    status?: string;
    limit?: number;
    page?: number;
  };

  try {
    const query: any = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const total = await Auction.countDocuments(query);
    const auctions = await Auction.find(query)
      .populate("seller", "username")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    reply.send({
      auctions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    reply.status(500).send({ error: "Error fetching auctions" });
  }
};

// export const watchAuction = async (
//   request: FastifyRequest,
//   reply: FastifyReply
// ) => {
//   const { id } = request.params as { id: string };
//   const userId = request.user!._id;

//   try {
//     const auction = await Auction.findById(id);
//     if (!auction) {
//       return reply.status(404).send({ error: "Auction not found" });
//     }

//     const userIdString = userId.toString();
//     const index = auction.watchedBy.findIndex(
//       (id) => id.toString() === userIdString
//     );

//     if (index !== -1) {
//       auction.watchedBy.splice(index, 1);
//     } else {
//       auction.watchedBy.push(userId);
//     }

//     await auction.save();
//     reply.send({ message: "Watch status updated successfully" });
//   } catch (error) {
//     reply.status(500).send({ error: "Error updating watch status" });
//   }
// };
