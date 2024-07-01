import { FastifyRequest, FastifyReply } from "fastify";
import ChatMessage from "../models/chatMessage.model";
import { socketHandler } from "../websocket/socketHandler";
import User from "../models/users.model";

export const sendMessage = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { auctionId, content } = request.body as {
    auctionId: string;
    content: string;
  };
  const userId = request.user!._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    const message = new ChatMessage({
      auction: auctionId,
      sender: userId,
      content: content,
    });

    await message.save();

    // Emit real-time websocket updates
    socketHandler.emitChatMessage(auctionId, {
      _id: message._id,
      sender: user.username,
      content: message.content,
      timestamp: message.timestamp,
    });
    reply.status(201).send(message);
  } catch (error) {
    reply.status(500).send({ error: "Error sending message" });
  }
};

export const getMessages = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { auctionId } = request.params as { auctionId: string };

  try {
    const messages = await ChatMessage.find({ auction: auctionId })
      .sort({ timestamp: -1 })
      .limit(50)
      .populate("sender", "username");

    reply.send(messages);
  } catch (error) {
    reply.status(500).send({ error: "Error fetching messages" });
  }
};
