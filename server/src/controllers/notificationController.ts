import { FastifyRequest, FastifyReply } from "fastify";
import Notification from "../models/notification.model";
import { Types } from "mongoose";

export const notificationController = {
  async getUnreadNotifications(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user!._id;
      console.log("Fetching notifications for user:", userId);

      if (!userId) {
        console.error("User ID is undefined");
        reply.code(401).send({ error: "Unauthorized: User not authenticated" });
        return;
      }

      // Verify that userId is a valid ObjectId
      if (!Types.ObjectId.isValid(userId)) {
        console.error("Invalid userId:", userId);
        reply.code(400).send({ error: "Invalid user ID" });
        return;
      }

      const notifications = await Notification.find({
        user: new Types.ObjectId(userId),
        isRead: false,
      })
        .sort({ createdAt: -1 })
        .limit(20);

      console.log("Found notifications:", notifications);

      if (notifications.length === 0) {
        console.log("No unread notifications found for user:", userId);
      }

      reply.send(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      reply.code(500).send({ error: "Internal Server Error" });
    }
  },

  async markAsRead(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const userId = request.user!._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      reply.code(404).send({ error: "Notification not found" });
      return;
    }

    reply.send(notification);
  },

  async createNotification(request: FastifyRequest, reply: FastifyReply) {
    const { userId, type, message, relatedAuction } = request.body as {
      userId: string;
      type: string;
      message: string;
      relatedAuction?: string;
    };

    const notification = new Notification({
      user: new Types.ObjectId(userId),
      type,
      message,
      relatedAuction: relatedAuction
        ? new Types.ObjectId(relatedAuction)
        : undefined,
    });

    await notification.save();
    reply.code(201).send(notification);
  },

  async deleteNotification(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const userId = request.user!._id;

    const result = await Notification.deleteOne({ _id: id, user: userId });

    if (result.deletedCount === 0) {
      reply.code(404).send({ error: "Notification not found" });
      return;
    }

    reply.code(204).send();
  },
};
