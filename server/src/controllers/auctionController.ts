import { FastifyRequest, FastifyReply } from "fastify";
import { MultipartFile } from "@fastify/multipart";
import Auction, { IAuction } from "../models/auctions.model";
import User from "../models/users.model";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";

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
  console.log(request.user);
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

    const auction = new Auction({
      ...auctionData,
      seller: userId,
      currentPrice: auctionData.startingPrice,
      images,
    });

    await auction.save();
    user.createdAuctions.push(auction._id);
    await user.save();

    reply.status(201).send(auction);
  } catch (error) {
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

  try {
    const auction = await Auction.findById(id).populate(
      "seller",
      "username customizations"
    );
    if (!auction) {
      return reply.status(404).send({ error: "Auction not found" });
    }
    reply.send(auction);
  } catch (error) {
    reply.status(500).send({ error: "Error fetching auction" });
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
// };

// };
