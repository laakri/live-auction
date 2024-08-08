import mongoose from "mongoose";
import Auction from "../models/auctions.model";
import User from "../models/users.model";
import { config } from "dotenv";

config(); // Load environment variables

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://glassisaif:icwxys1oyAenGq6q@cluster0.v8zmnny.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const categories = ["art", "electronics", "fashion", "jewelry"];
const titles = {
  art: [
    "Modern Painting",
    "Antique Vase",
    "Handcrafted Sculpture",
    "Limited Edition Print",
  ],
  electronics: ["Gaming Console", "Smartphone", "Laptop", "Smart Watch"],
  fashion: [
    "Designer Handbag",
    "Limited Edition Sneakers",
    "Vintage Dress",
    "Luxury Sunglasses",
  ],
  jewelry: [
    "Diamond Necklace",
    "Vintage Watch",
    "Gold Bracelet",
    "Sapphire Ring",
  ],
};

const generateRandomAuction = async (sellers: any[]) => {
  const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const title = `${
    titles[category as keyof typeof titles][
      Math.floor(Math.random() * titles[category as keyof typeof titles].length)
    ]
  } #${Math.floor(Math.random() * 1000)}`;

  const now = new Date();
  const startTime = new Date(
    now.getTime() + (Math.random() * 60 - 30) * 24 * 60 * 60 * 1000
  );
  const endTime = new Date(
    startTime.getTime() + (Math.random() * 30 + 1) * 24 * 60 * 60 * 1000
  );

  return {
    title,
    description: "This is a test auction description.",
    startingPrice: Math.floor(Math.random() * 1000) + 10,
    currentPrice: Math.floor(Math.random() * 1000) + 10,
    incrementAmount: Math.floor(Math.random() * 10) + 1,
    startTime,
    endTime,
    seller: randomSeller._id,
    category,
    images: ["Rolex-Opinion-21-scaled.webp"],
    watchedBy: Array.from(
      { length: Math.floor(Math.random() * 10) },
      () => sellers[Math.floor(Math.random() * sellers.length)]._id
    ),
  };
};
const seedAuctions = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Fetch all users to use as sellers
    const sellers = await User.find();
    if (sellers.length === 0) {
      console.log("No users found. Please create some users first.");
      return;
    }

    // Delete existing auctions
    await Auction.deleteMany({});
    console.log("Deleted existing auctions");

    // Generate and insert new auctions
    const auctionsToInsert = await Promise.all(
      Array(100)
        .fill(null)
        .map(() => generateRandomAuction(sellers))
    );

    await Auction.insertMany(auctionsToInsert);
    console.log("Inserted 100 random auctions");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding auctions:", error);
  }
};

seedAuctions();
