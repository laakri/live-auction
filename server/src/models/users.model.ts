import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  balance: number;
  reputation: number;
  rank: string;
  isVerified: boolean;
  freeAuctionsRemaining: number;
  createdAuctions: Schema.Types.ObjectId[];
  wonAuctions: Schema.Types.ObjectId[];
  preferences: {
    notifications: boolean;
    privateProfile: boolean;
  };
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: String,
    bio: String,
    balance: { type: Number, default: 0 },
    reputation: { type: Number, default: 0 },
    rank: { type: String, default: "Novice" },
    isVerified: { type: Boolean, default: false },
    freeAuctionsRemaining: { type: Number, default: 3 },
    createdAuctions: [{ type: Schema.Types.ObjectId, ref: "Auction" }],
    wonAuctions: [{ type: Schema.Types.ObjectId, ref: "Auction" }],
    preferences: {
      notifications: { type: Boolean, default: true },
      privateProfile: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
