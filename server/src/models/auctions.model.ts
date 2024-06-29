import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IAuction extends Document {
  _id: ObjectId;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  incrementAmount: number;
  startTime: Date;
  endTime: Date;
  seller: Schema.Types.ObjectId;
  winner?: Schema.Types.ObjectId;
  category: string;
  tags: string[];
  images: string[];
  isPrivate: boolean;
  invitedUsers?: Schema.Types.ObjectId[];
  status: "upcoming" | "active" | "ended";
  bids: Schema.Types.ObjectId[];
  watchedBy: Schema.Types.ObjectId[];
  charity?: {
    organization: string;
    percentage: number;
  };
}

const AuctionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    incrementAmount: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    winner: { type: Schema.Types.ObjectId, ref: "User" },
    category: { type: String, required: true },
    tags: [String],
    images: [String],
    isPrivate: { type: Boolean, default: false },
    invitedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["upcoming", "active", "ended"],
      default: "upcoming",
    },
    bids: [{ type: Schema.Types.ObjectId, ref: "Bid" }],
    watchedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    charity: {
      organization: String,
      percentage: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAuction>("Auction", AuctionSchema);
