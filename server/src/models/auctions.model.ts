import mongoose, { Document, ObjectId, Schema, Types } from "mongoose";

export interface IAuction extends Document {
  _id: ObjectId;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  incrementAmount: number;
  startTime: Date;
  endTime: Date;
  seller: {
    _id: Types.ObjectId | string;
    username: string;
  };
  winner?: Schema.Types.ObjectId;
  category: string;
  tags: string[];
  images: string[];
  isPrivate: boolean;
  invitedUsers?: Schema.Types.ObjectId[];
  status: "upcoming" | "active" | "ended";
  bids: Schema.Types.ObjectId[];
  charity?: {
    organization: string;
    percentage: number;
  };
  ownerControls: {
    isChatOpen: boolean;
    canEndEarly: boolean;
  };
  currentViewers: number;
  totalUniqueViewers: number;
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
    bids: [{ type: Schema.Types.ObjectId, ref: "Bid" }],
    watchedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    charity: {
      organization: String,
      percentage: Number,
    },
    ownerControls: {
      isChatOpen: { type: Boolean, default: true },
      canEndEarly: { type: Boolean, default: false },
    },
    currentViewers: { type: Number, default: 0 },
    totalUniqueViewers: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAuction>("Auction", AuctionSchema);
