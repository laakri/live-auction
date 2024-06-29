import mongoose, { Document, Schema } from "mongoose";

export interface IAuction extends Document {
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  startTime: Date;
  endTime: Date;
  seller: Schema.Types.ObjectId;
  winner?: Schema.Types.ObjectId;
}

const AuctionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    winner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAuction>("Auction", AuctionSchema);
