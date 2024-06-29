import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IBid extends Document {
  _id: ObjectId;
  auction: Schema.Types.ObjectId;
  bidder: Schema.Types.ObjectId;
  amount: number;
  timestamp: Date;
}

const BidSchema: Schema = new Schema({
  auction: { type: Schema.Types.ObjectId, ref: "Auction", required: true },
  bidder: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IBid>("Bid", BidSchema);
