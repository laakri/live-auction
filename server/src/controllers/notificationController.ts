import { FastifyRequest, FastifyReply } from "fastify";
import Notification from "../models/notification.model";
import { Types } from "mongoose";

export const notificationController = {
  async getUnreadNotifications(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const notifications = await Notification.find({
      user: userId,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .limit(20);
    reply.send(notifications);
  },

  async markAsRead(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const userId = (request.user as any).id;

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
    const userId = (request.user as any).id;

    const result = await Notification.deleteOne({ _id: id, user: userId });

    if (result.deletedCount === 0) {
      reply.code(404).send({ error: "Notification not found" });
      return;
    }

    reply.code(204).send();
  },
};
