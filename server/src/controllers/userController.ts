import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/users.model";

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { username, email, password } = request.body as IUser;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }] });
    if (existingUser) {
      return reply
        .status(400)
        .send({ error: "Username or email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, {
    //   expiresIn: "1d",
    // });

    // reply.status(201).send({ user: newUser, token });
  } catch (error) {
    reply.status(500).send({ error: "Error registering user" });
  }
};

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return reply.status(400).send({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.status(400).send({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    reply.send({ user, token });
  } catch (error) {
    reply.status(500).send({ error: "Error logging in" });
  }
};

export const getProfile = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = await User.findById(request.user!._id).select("-password");
    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }
    reply.send(user);
  } catch (error) {
    reply.status(500).send({ error: "Error fetching profile" });
  }
};

export const updateProfile = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const updates = request.body as Partial<IUser>;
    const user = await User.findByIdAndUpdate(request.user!._id, updates, {
      new: true,
    }).select("-password");
    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }
    reply.send(user);
  } catch (error) {
    reply.status(500).send({ error: "Error updating profile" });
  }
};
