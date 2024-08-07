import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/users.model";
import { v4 as uuidv4 } from "uuid";

// Helper function to generate a unique referral code
const generateReferralCode = async (): Promise<string> => {
  let code: string = "";
  let isUnique = false;
  while (!isUnique) {
    code = uuidv4().substr(0, 8).toUpperCase();
    const existingUser = await User.findOne({ referralCode: code });
    if (!existingUser) {
      isUnique = true;
    }
  }
  return code;
};

// Helper function to calculate initial level based on XP
const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { username, email, password, referralCode } = request.body as {
    username: string;
    email: string;
    password: string;
    referralCode?: string;
  };

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return reply
        .status(400)
        .send({ error: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newReferralCode = await generateReferralCode();

    let referredBy: IUser | null = null;
    if (referralCode) {
      referredBy = await User.findOne({ referralCode });
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      referralCode: newReferralCode,
      referredBy: referredBy?._id,
      xp: 10,
      level: 1,
      achievements: ["New User"],
      customizations: {
        theme: "default",
        avatar: `https://api.dicebear.com/6.x/initials/svg?seed=${username}`,
      },
      loyaltyTier: "bronze",
    });

    await newUser.save();

    if (referredBy) {
      referredBy.xp += 50; // Reward for referral
      referredBy.level = calculateLevel(referredBy.xp);
      if (!referredBy.achievements.includes("Successful Referral")) {
        referredBy.achievements.push("Successful Referral");
      }
      await referredBy.save();
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    reply.send({ token, user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    reply.status(500).send({ error: "Error creating user" });
  }
};

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    user.xp += 5; // XP for logging in
    user.level = calculateLevel(user.xp);
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    reply.send({ token, user });
  } catch (error) {
    reply.status(500).send({ error: "Error logging in" });
  }
};
export const getProfile = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const userId = request.user!._id;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    reply.send(user);
  } catch (error) {
    reply.status(500).send({ error: "Error fetching user profile" });
  }
};
export const VerifyProfile = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const userId = request.user!._id;
  const updates = request.body as Partial<IUser>;

  const restrictedFields: (keyof Partial<IUser>)[] = [
    "password",
    "email",
    "username",
    "balance",
    "xp",
    "level",
    "achievements",
    "referralCode",
  ];

  restrictedFields.forEach((field) => delete updates[field]);

  // Set isVerified to true
  updates.isVerified = true;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { ...updates, isVerified: true },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    reply.send(user);
  } catch (error) {
    console.error("Error updating user profile:", error);
    reply.status(500).send({ error: "Error updating user profile" });
  }
};

export const updateCustomization = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const userId = request.user!._id;
  const { theme, avatar } = request.body as { theme?: string; avatar?: string };

  try {
    const user = await User.findById(userId);
    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    if (theme) user.customizations.theme = theme;
    if (avatar) user.customizations.avatar = avatar;

    await user.save();

    reply.send({
      message: "Customization updated successfully",
      customizations: user.customizations,
    });
  } catch (error) {
    reply.status(500).send({ error: "Error updating customization" });
  }
};

export const getAchievements = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const userId = request.user!._id;

  try {
    const user = await User.findById(userId).select("achievements");
    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    reply.send(user.achievements);
  } catch (error) {
    reply.status(500).send({ error: "Error fetching achievements" });
  }
};

export const getReferralInfo = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const userId = request.user!._id;

  try {
    const user = await User.findById(userId).select("referralCode");
    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    const referredUsers = await User.find({ referredBy: userId }).select(
      "username createdAt"
    );

    reply.send({ referralCode: user.referralCode, referredUsers });
  } catch (error) {
    reply.status(500).send({ error: "Error fetching referral information" });
  }
};
export const followUser = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { action, follower, following } = req.body as {
    action: 'follow' | 'unfollow';
    follower: string;
    following: string;
  };

  try {
    const followerUser = await User.findById(follower);
    const followingUser = await User.findById(following);

    if (!followerUser || !followingUser) {
      return res.status(404).send({ error: "User not found" });
    }

    const isAlreadyFollowing = followerUser.following.some(id => id.toString() === following);

    switch (action) {
      case 'follow':
        if (isAlreadyFollowing) {
          return res.status(400).send({ error: "User is already followed" });
        }
        await Promise.all([
          User.findByIdAndUpdate(follower, { $push: { following: following } }),
          User.findByIdAndUpdate(following, { $push: { followers: follower } })
        ]);
        break;

      case 'unfollow':
        if (!isAlreadyFollowing) {
          return res.status(400).send({ error: "User is not being followed" });
        }
        await Promise.all([
          User.findByIdAndUpdate(follower, { $pull: { following: following } }),
          User.findByIdAndUpdate(following, { $pull: { followers: follower } })
        ]);
        break;

      default:
        return res.status(400).send({ error: "Invalid action" });
    }

    res.send({ done: true });
  } catch (err) {
    res.status(500).send({ error: "An error occurred" });
  }
};


// Add more functions as needed for other user-related operations

export default {
  register,
  login,
  getProfile,
  VerifyProfile,
  updateCustomization,
  getAchievements,
  getReferralInfo,
  followUser
};
