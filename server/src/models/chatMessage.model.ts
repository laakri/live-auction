import mongoose, { Document, Schema } from "mongoose";

export interface IChatMessage extends Document {
  auction: Schema.Types.ObjectId;
  sender: Schema.Types.ObjectId;
  content: string;
  timestamp: Date;
}

const ChatMessageSchema: Schema = new Schema({
  auction: { type: Schema.Types.ObjectId, ref: "Auction", required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
