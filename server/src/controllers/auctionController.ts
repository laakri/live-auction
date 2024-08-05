import { FastifyRequest, FastifyReply } from "fastify";
import { MultipartFile } from "@fastify/multipart";
import Auction, { IAuction } from "../models/auctions.model";
import User from "../models/users.model";
import Bid from "../models/bid.model";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import { socketHandler } from "../websocket/socketHandler";
import { ObjectId } from "mongoose";

const UPLOAD_DIR = path.join(__dirname, "../uploads");

async function optimizeAndSaveImage(file: MultipartFile): Promise<string> {
  const filename = `${uuidv4()}.webp`;
  const filepath = path.join(UPLOAD_DIR, filename);

  const buffer = await file.toBuffer();
  await sharp(buffer)
    .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(filepath);

  return filename;
}

async function deleteImage(filename: string): Promise<void> {
  const filepath = path.join(UPLOAD_DIR, filename);
  await fs.unlink(filepath);
}

export const createAuction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
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

    const parts = request.parts();
    const auctionData: any = {};
    const images: string[] = [];

    for await (const part of parts) {
      if (part.type === "file") {
        const filename = await optimizeAndSaveImage(part);
        images.push(filename);
      } else {
        auctionData[part.fieldname] = part.value;
      }
    }

    // Parse dates
    auctionData.startTime = new Date(auctionData.startTime);
    auctionData.endTime = new Date(auctionData.endTime);

    const auction = new Auction({
      ...auctionData,
      seller: userId,
      currentPrice: auctionData.startingPrice,
      images,
      ownerControls: {
        isChatOpen: auctionData.isChatOpen === "true",
        canEndEarly: auctionData.allowEarlyEnd === "true",
      },
    });

    await auction.save();
    user.createdAuctions.push(auction._id);
    await user.save();

    reply.status(201).send(auction);
  } catch (error) {
    console.error("Error creating auction:", error);
    reply.status(500).send({ error: "Error creating auction" });
  }
};

export const getDiscoveryAuctions = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const {
      search,
      category,
      sort,
      page = 1,
      limit = 12,
    } = request.query as {
      search?: string;
      category?: string;
      sort?: string;
      page?: number;
      limit?: number;
    };

    const query: any = {};

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Sorting
    let sortOption: any = { createdAt: -1 }; // Default sort by newest
    if (sort === "price_asc") sortOption = { currentPrice: 1 };
    if (sort === "price_desc") sortOption = { currentPrice: -1 };
    if (sort === "ending_soon") sortOption = { endTime: 1 };

    const totalAuctions = await Auction.countDocuments(query);
    const totalPages = Math.ceil(totalAuctions / limit);

    const auctions = await Auction.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("seller", "username avatar rating")
      .lean();

    // Get trending auctions (most watched)
    const trendingAuctions = await Auction.find({
      endTime: { $gt: new Date() },
    })
      .sort({ "watchedBy.length": -1 })
      .limit(6)
      .populate("seller", "username avatar rating")
      .lean();

    // Get upcoming auctions
    const upcomingAuctions = await Auction.find({
      startTime: { $gt: new Date() },
    })
      .sort({ startTime: 1 })
      .limit(3)
      .populate("seller", "username avatar rating")
      .lean();

    reply.send({
      auctions,
      trendingAuctions,
      upcomingAuctions,
      pagination: {
        currentPage: page,
        totalPages,
        totalAuctions,
      },
    });
  } catch (error) {
    console.error("Error fetching discovery auctions:", error);
    reply.status(500).send({ error: "Error fetching auctions" });
  }
};

export const updateAuction = async (
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
        .send({ error: "Not authorized to update this auction" });
    }

    if (new Date() > auction.startTime && new Date() < auction.endTime) {
      return reply
        .status(400)
        .send({ error: "Cannot update an active auction" });
    }

    const parts = request.parts();
    const updates: any = {};
    const newImages: string[] = [];
    const imagesToDelete: string[] = [];

    for await (const part of parts) {
      if (part.type === "file") {
        const filename = await optimizeAndSaveImage(part);
        newImages.push(filename);
      } else if (part.fieldname === "deleteImages") {
        imagesToDelete.push(...(part.value as string).split(","));
      } else {
        updates[part.fieldname] = part.value;
      }
    }

    // Delete old images
    for (const filename of imagesToDelete) {
      await deleteImage(filename);
      auction.images = auction.images.filter((img) => img !== filename);
    }

    // Add new images
    auction.images.push(...newImages);

    Object.assign(auction, updates);
    await auction.save();

    reply.send(auction);
  } catch (error) {
    reply.status(500).send({ error: "Error updating auction" });
  }
};

// ... (keep other existing functions)

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

    if (new Date() > auction.startTime && new Date() < auction.endTime) {
      return reply
        .status(400)
        .send({ error: "Cannot delete an active auction" });
    }

    // Delete associated images
    for (const filename of auction.images) {
      await deleteImage(filename);
    }

    await auction.deleteOne();
    await User.findByIdAndUpdate(userId, { $pull: { createdAuctions: id } });

    reply.send({ message: "Auction deleted successfully" });
  } catch (error) {
    reply.status(500).send({ error: "Error deleting auction" });
  }
};

export const getAuction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const userId = request.user?._id;

  try {
    const auction = await Auction.findById(id)
      .populate("seller", "username customizations")
      .lean();

    if (!auction) {
      return reply.status(404).send({
        error: "Auction not found",
        message: "The requested auction does not exist or has been removed.",
      });
    }

    // Fetch bids separately
    const bids = await Bid.find({ auction: id })
      .populate("bidder", "username customizations")
      .sort({ timestamp: -1 })
      .lean();

    // Check if the user is the owner of the auction
    const isOwner =
      userId && auction.seller._id.toString() === userId.toString();

    // If the user is the owner, allow access regardless of privacy settings
    if (isOwner) {
      return reply.send({
        auction: { ...auction, bids },
        message: "You are viewing your own auction.",
      });
    }

    // Handle private auction access for non-owners
    if (auction.isPrivate) {
      if (!userId) {
        return reply.status(401).send({
          error: "Authentication required",
          message: "This is a private auction. Please log in to view it.",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return reply.status(401).send({
          error: "User not found",
          message:
            "Your user account could not be verified. Please log in again.",
        });
      }

      const isInvited =
        auction.invitedUsers?.some(
          (invitedUser) => invitedUser.toString() === userId.toString()
        ) || false;

      if (!isInvited) {
        return reply.status(403).send({
          error: "Access denied",
          message:
            "This is a private auction, and you have not been invited to participate.",
        });
      }
    }

    // If we've reached this point, the user has access to the auction
    reply.send({
      auction: { ...auction, bids },
      message: auction.isPrivate
        ? "You are viewing a private auction."
        : "You are viewing a public auction.",
    });
  } catch (error) {
    console.error("Error fetching auction:", error);
    reply.status(500).send({
      error: "Internal server error",
      message:
        "An unexpected error occurred while fetching the auction details. Please try again later.",
    });
  }
};

interface SearchQuery {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  status?: "upcoming" | "active" | "ended";
  sort?: "price_asc" | "price_desc" | "end_time" | "start_time";
  page?: string;
  limit?: string;
}

export const searchAuctions = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      status,
      sort,
      page = "1",
      limit = "10",
    } = request.query as SearchQuery;

    // Build the query
    const query: any = {};

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range
    if (minPrice || maxPrice) {
      query.currentPrice = {};
      if (minPrice) query.currentPrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.currentPrice.$lte = parseFloat(maxPrice);
    }

    // Status filter
    if (status) {
      const now = new Date();
      switch (status) {
        case "upcoming":
          query.startTime = { $gt: now };
          break;
        case "active":
          query.startTime = { $lte: now };
          query.endTime = { $gt: now };
          break;
        case "ended":
          query.endTime = { $lte: now };
          break;
      }
    }

    // Sorting
    let sortOption: any = { createdAt: -1 }; // Default sort by newest
    switch (sort) {
      case "price_asc":
        sortOption = { currentPrice: 1 };
        break;
      case "price_desc":
        sortOption = { currentPrice: -1 };
        break;
      case "end_time":
        sortOption = { endTime: 1 };
        break;
      case "start_time":
        sortOption = { startTime: 1 };
        break;
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return reply.status(400).send({ error: "Invalid pagination parameters" });
    }

    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const totalAuctions = await Auction.countDocuments(query);
    const totalPages = Math.ceil(totalAuctions / limitNum);

    const auctions = await Auction.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate("seller", "username avatar rating")
      .lean();

    // Prepare response
    const response = {
      auctions,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalAuctions,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    };

    reply.send(response);
  } catch (error) {
    console.error("Error in searchAuctions:", error);
    if (error instanceof Error) {
      reply
        .status(500)
        .send({ error: `Internal Server Error: ${error.message}` });
    } else {
      reply.status(500).send({ error: "An unexpected error occurred" });
    }
  }
};

export const updateOwnerControls = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { auctionId } = request.params as { auctionId: string };
  const { isChatOpen, canEndEarly } = request.body as {
    isChatOpen?: boolean;
    canEndEarly?: boolean;
  };
  const userId = request.user!._id;

  try {
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return reply.status(404).send({ error: "Auction not found" });
    }

    if (auction.seller.toString() !== userId.toString()) {
      return reply
        .status(403)
        .send({ error: "Not authorized to update this auction" });
    }

    if (isChatOpen !== undefined) {
      auction.ownerControls.isChatOpen = isChatOpen;
    }
    if (canEndEarly !== undefined) {
      auction.ownerControls.canEndEarly = canEndEarly;
    }

    await auction.save();

    // Emit real-time update
    socketHandler.emitOwnerControlsUpdate(auctionId, {
      isChatOpen: auction.ownerControls.isChatOpen,
      canEndEarly: auction.ownerControls.canEndEarly,
    });

    reply.send({ message: "Owner controls updated successfully", auction });
  } catch (error) {
    reply.status(500).send({ error: "Error updating owner controls" });
  }
};

export const endAuctionEarly = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id: auctionId } = request.params as { id: string };
  const userId = request.user!._id;

  try {
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return reply.status(404).send({ error: "Auction not found" });
    }

    if (auction.seller.toString() !== userId.toString()) {
      return reply
        .status(403)
        .send({ error: "Not authorized to end this auction" });
    }

    if (!auction.ownerControls.canEndEarly) {
      return reply
        .status(400)
        .send({ error: "Early ending is not allowed for this auction" });
    }

    auction.status = "ended";
    auction.endTime = new Date();
    await auction.save();
    // Emit real-time update
    socketHandler.emitAuctionEnded(auction._id.toString());

    reply.send({ message: "Auction ended successfully", auction });
  } catch (error) {
    reply.status(500).send({ error: "Error ending auction early" });
  }
};
export const inviteUsers = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const { emails } = request.body as { emails: string[] };
  const userId = request.user?._id;

  if (!userId) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  try {
    const auction = await Auction.findById(id);
    if (!auction) {
      return reply.status(404).send({ error: "Auction not found" });
    }

    if (auction.seller.toString() !== userId.toString()) {
      return reply
        .status(403)
        .send({ error: "Not authorized to invite users to this auction" });
    }

    const users = await User.find({ email: { $in: emails } });
    const newInvitedUsers = users.map((user) => user._id);

    auction.invitedUsers = auction.invitedUsers || [];
    auction.invitedUsers = [
      ...new Set([...auction.invitedUsers, ...newInvitedUsers]),
    ] as ObjectId[];
    await auction.save();

    reply.send({
      message: "Users invited successfully",
      invitedUsers: auction.invitedUsers,
    });
  } catch (error) {
    reply.status(500).send({ error: "Error inviting users" });
  }
};

export const removeInvitedUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id, userId: userIdToRemove } = request.params as {
    id: string;
    userId: string;
  };
  const userId = request.user?._id;

  if (!userId) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  try {
    const auction = await Auction.findById(id);
    if (!auction) {
      return reply.status(404).send({ error: "Auction not found" });
    }

    if (auction.seller.toString() !== userId.toString()) {
      return reply
        .status(403)
        .send({ error: "Not authorized to remove users from this auction" });
    }

    auction.invitedUsers = auction.invitedUsers || [];
    auction.invitedUsers = auction.invitedUsers.filter(
      (invitedUser) => invitedUser.toString() !== userIdToRemove
    );
    await auction.save();

    reply.send({
      message: "User removed successfully",
      invitedUsers: auction.invitedUsers,
    });
  } catch (error) {
    reply.status(500).send({ error: "Error removing user" });
  }
};
