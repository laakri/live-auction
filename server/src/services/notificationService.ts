import { sseController } from "../controllers/sseController";
import Notification, { INotification } from "../models/notification.model";
import { Types } from "mongoose";

export const notificationService = {
  async createNotification(
    userId: string,
    type: string,
    message: string,
    relatedAuction?: string
  ): Promise<INotification> {
    const notification = new Notification({
      user: new Types.ObjectId(userId),
      type,
      message,
      relatedAuction: relatedAuction
        ? new Types.ObjectId(relatedAuction)
        : undefined,
    });
    const savedNotification = await notification.save();

    // Send real-time notification count via SSE
    const unreadCount = await this.getUnreadNotifications(userId);
    sseController.sendNotificationCount(userId, unreadCount);

    return savedNotification;
  },

  async getUnreadNotifications(userId: string): Promise<number> {
    return await Notification.countDocuments({ user: userId, isRead: false });
  },

  async markNotificationAsRead(
    notificationId: string,
    userId: string
  ): Promise<INotification | null> {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );
  },

  async deleteNotification(
    notificationId: string,
    userId: string
  ): Promise<boolean> {
    const result = await Notification.deleteOne({
      _id: notificationId,
      user: userId,
    });
    return result.deletedCount > 0;
  },
};

export async function getUnreadNotificationsCount(
  userId: string
): Promise<number> {
  return await Notification.countDocuments({ user: userId, isRead: false });
}
