import { FastifyRequest, FastifyReply } from "fastify";
import ChatMessage from "../models/chatMessage.model";
import { socketHandler } from "../websocket/socketHandler";

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
    const message = new ChatMessage({
      auction: auctionId,
      sender: userId,
      content: content,
    });

    await message.save();

    // Emit real time websocket updates
    socketHandler.emitChatMessage(auctionId, { sender: userId, content });

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
