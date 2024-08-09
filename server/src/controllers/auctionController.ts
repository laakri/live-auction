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
import { notificationService } from "../services/notificationService";

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
    // Check if this is the user's first auction
    if (user.createdAuctions.length === 1) {
      const message = `Congratulations on creating your first auction! You have ${user.freeAuctionsRemaining} free auctions remaining. Remember, you can always boost your auction visibility with credits.`;
      await notificationService.createNotification(
        userId.toString(),
        "first_auction",
        message,
        auction._id.toString()
      );
    }
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
    const now = new Date();

    // Common projection for all queries
    const auctionProjection = {
      title: 1,
      images: { $slice: 1 }, // Only the first image
      currentPrice: 1,
      startTime: 1,
      endTime: 1,
      watchedBy: 1,
      seller: 1,
      category: 1,
    };

    // Helper function to fetch auctions
    const fetchAuctions = async (query: any, sort: any, limit: number) => {
      const results = await Auction.find({
        ...query,
        startTime: { $lte: now },
        endTime: { $gt: now },
        isPrivate: false, // Add this line to exclude private auctions
      })
        .select(auctionProjection)
        .sort(sort)
        .limit(limit)
        .populate("seller", "username customizations.avatar")
        .lean();

      return results;
    };

    // Fetch auctions for different sections
    const [
      featuredAuctions,
      trendingAuctions,
      endingSoonAuctions,
      newAuctions,
    ] = await Promise.all([
      fetchAuctions({}, { currentPrice: -1 }, 4),
      fetchAuctions({}, { "watchedBy.length": -1 }, 10),
      fetchAuctions({}, { endTime: 1 }, 10),
      fetchAuctions({}, { startTime: -1 }, 10),
    ]);

    // Fetch a sample of auctions for each category
    const categories = ["Art", "Electronics", "Fashion", "Jewelry"];
    const categorySamples = await Promise.all(
      categories.map(async (category) => {
        const auctions = await fetchAuctions({ category }, {}, 8);
        return { category, auctions };
      })
    );

    // Process auctions to include only necessary information
    const processAuction = (auction: any) => ({
      _id: auction._id,
      title: auction.title,
      image: auction.images[0],
      currentPrice: auction.currentPrice,
      timeLeft:
        auction.startTime > now
          ? { type: "starts", value: auction.startTime }
          : { type: "ends", value: auction.endTime },
      watchersCount: auction.watchedBy?.length || 0,
      seller: {
        username: auction.seller.username,
        avatar: auction.seller.customizations?.avatar,
      },
    });

    // Prepare response with processed auctions
    const response = {
      featuredAuctions: featuredAuctions.map(processAuction),
      trendingAuctions: trendingAuctions.map(processAuction),
      endingSoonAuctions: endingSoonAuctions.map(processAuction),
      newAuctions: newAuctions.map(processAuction),
      categorySamples: categorySamples.map((category) => ({
        category: category.category,
        auctions: category.auctions.map(processAuction),
      })),
    };

    reply.send(response);
  } catch (error) {
    console.error("Error fetching discovery auctions:", error);
    reply.status(500).send({ error: "Error fetching auctions" });
  }
};
export const get3DAuctions = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const now = new Date();

    const auctions = await Auction.find({
      startTime: { $lte: now },
      endTime: { $gt: now },
      isPrivate: false,
    })
      .select(
        "title images currentPrice startTime endTime watchedBy seller category"
      )
      .populate("seller", "username customizations.avatar")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const processedAuctions = auctions.map((auction) => ({
      _id: auction._id,
      title: auction.title,
      image: auction.images[0],
      currentPrice: auction.currentPrice,
      timeLeft: { type: "ends", value: auction.endTime },
      watchersCount: auction.currentViewers || 0,
      seller: {
        username: auction.seller.username,
      },
      category: auction.category,
    }));

    reply.send({
      auctions: processedAuctions,
    });
  } catch (error) {
    console.error("Error fetching 3D auctions:", error);
    reply.status(500).send({
      error: "Internal server error",
      message:
        "An unexpected error occurred while fetching the 3D auctions. Please try again later.",
    });
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
      .populate("invitedUsers", "username email customizations")
      .lean();

    if (!auction) {
      return reply.status(404).send({
        error: "Auction not found",
        message: "The requested auction does not exist or has been removed.",
      });
    }

    const isOwner =
      userId && auction.seller._id.toString() === userId.toString();

    // Fetch bids separately
    const bids = await Bid.find({ auction: id })
      .populate("bidder", "username customizations")
      .sort({ timestamp: -1 })
      .lean();

    let invitedUsers: any[] = [];
    if (isOwner && auction.isPrivate) {
      invitedUsers = auction.invitedUsers || [];
    }

    reply.send({
      auction: { ...auction, bids },
      isOwner,
      invitedUsers: isOwner ? invitedUsers : undefined,
      message: isOwner
        ? "You are viewing your own auction."
        : auction.isPrivate
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
  const { q, category, sort, page, limit, minPrice, maxPrice, status } =
    request.query as {
      q?: string;
      category?: string;
      sort?: string;
      page?: string;
      limit?: string;
      minPrice?: string;
      maxPrice?: string;
      status?: string;
    };

  try {
    const query: any = {};
    console.log("Category:", category);
    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    // Category filter
    if (category && category !== "all") {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.currentPrice = {};
      if (minPrice) query.currentPrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.currentPrice.$lte = parseFloat(maxPrice);
    }

    // Status filter
    if (status && status !== "all") {
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
    const pageNum = parseInt(page || "1", 10);
    const limitNum = parseInt(limit || "12", 10);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const totalAuctions = await Auction.countDocuments(query);
    const totalPages = Math.ceil(totalAuctions / limitNum);

    const auctions = await Auction.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate("seller", "username customizations")
      .lean();

    reply.send({
      auctions,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalAuctions,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Error in searchAuctions:", error);
    reply
      .status(500)
      .send({ error: "An unexpected error occurred while searching auctions" });
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
  const { auctionId } = request.params as { auctionId: string };
  const userId = request.user!._id;

  console.log("Received request to end auction early:", auctionId);
  try {
    const auction = await Auction.findById(auctionId).populate("bids");
    if (!auction) {
      console.log("Auction not found:", auctionId);
      return reply.status(404).send({ error: "Auction not found" });
    }

    if (auction.seller.toString() !== userId.toString()) {
      console.log("User not authorized to end auction:", userId);
      return reply
        .status(403)
        .send({ error: "Not authorized to end this auction" });
    }

    if (!auction.ownerControls.canEndEarly) {
      console.log("Early ending not allowed for auction:", auctionId);
      return reply
        .status(400)
        .send({ error: "Early ending is not allowed for this auction" });
    }

    auction.status = "ended";
    auction.endTime = new Date();
    await auction.save();

    // Notify winner and losers
    const highestBid = auction.bids.sort(
      (a, b) => (b as any).amount - (a as any).amount
    )[0];
    if (highestBid) {
      await notificationService.createNotification(
        highestBid.toString(), // Ensure this is the bidder's ID
        "auction_won",
        `Congratulations! You have won the auction "${auction.title}".`,
        auction._id.toString()
      );
      const losingBidders = auction.bids
        .filter((bid) => bid.toString() !== highestBid.toString())
        .map((bid) => bid.toString());

      for (const loserId of losingBidders) {
        await notificationService.createNotification(
          loserId,
          "auction_lost",
          `You have lost the auction "${auction.title}". Better luck next time!`,
          auction._id.toString()
        );
      }
    }

    // Emit real-time update
    socketHandler.emitAuctionEnded(auction._id.toString());

    console.log("Auction ended successfully:", auctionId);
    reply.send({ message: "Auction ended successfully", auction });
  } catch (error) {
    console.error("Error ending auction:", error);
    reply.status(500).send({ error: "Error ending auction" });
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

    if (!auction.isPrivate) {
      return reply.status(400).send({ error: "This auction is not private" });
    }

    if (auction.seller.toString() !== userId.toString()) {
      return reply
        .status(403)
        .send({ error: "Not authorized to invite users to this auction" });
    }

    const users = await User.find({ email: { $in: emails } });

    // Handle case when no users are found
    if (users.length === 0) {
      return reply.status(200).send({
        success: false,
        message: "No matching users found",
        invitedUsers: [],
        notFoundEmails: emails,
      });
    }

    const newInvitedUsers = users.map((user) => user._id);
    const invitedEmails = users.map((user) => user.email);
    const notFoundEmails = emails.filter(
      (email) => !invitedEmails.includes(email)
    );

    auction.invitedUsers = auction.invitedUsers || [];
    const uniqueInvitedUsers = [
      ...new Set([...auction.invitedUsers, ...newInvitedUsers]),
    ];
    auction.invitedUsers = uniqueInvitedUsers as ObjectId[];
    await auction.save();

    const invitedUsersData = await User.find({
      _id: { $in: uniqueInvitedUsers },
    }).select("email username");

    // Emit socket event for invited users update
    socketHandler.emitInvitedUsersUpdate(
      auction._id.toString(),
      invitedUsersData
    );

    reply.send({
      success: true,
      message:
        notFoundEmails.length > 0
          ? "Some users invited successfully, some emails not found"
          : "All users invited successfully",
      invitedUsers: invitedUsersData,
      notFoundEmails,
    });
  } catch (error) {
    console.error("Error inviting users:", error);
    reply.status(500).send({ error: "Error inviting users" });
  }
};

export const removeInvitedUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id, userId } = request.params as { id: string; userId: string };
  const ownerId = request.user!._id;

  try {
    const auction = await Auction.findById(id);
    if (!auction) {
      return reply.status(404).send({ error: "Auction not found" });
    }

    if (auction.seller.toString() !== ownerId.toString()) {
      return reply
        .status(403)
        .send({ error: "Not authorized to remove users from this auction" });
    }

    if (auction.invitedUsers) {
      auction.invitedUsers = auction.invitedUsers.filter(
        (invitedUser) => invitedUser.toString() !== userId
      );
    }
    await auction.save();

    const updatedInvitedUsers = await User.find({
      _id: { $in: auction.invitedUsers },
    }).select("email username");

    // Emit socket event for invited users update
    socketHandler.emitInvitedUsersUpdate(
      auction._id.toString(),
      updatedInvitedUsers
    );

    reply.send({
      message: "User removed successfully",
      invitedUsers: updatedInvitedUsers,
    });
  } catch (error) {
    console.error("Error removing invited user:", error);
    reply.status(500).send({ error: "Error removing invited user" });
  }
};
