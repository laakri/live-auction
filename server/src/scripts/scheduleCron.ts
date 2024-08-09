import cron from "node-cron";
import Auction from "../models/auctions.model";
import { notificationService } from "../services/notificationService";

export const scheduleAuctionEndingNotifications = () => {
  cron.schedule("*/5 * * * *", async () => {
    // Run every 5 minutes
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    const auctions = await Auction.find({
      endTime: { $gt: new Date(), $lte: oneHourFromNow },
      endingNotificationSent: { $ne: true },
    }).populate("seller", "_id");

    for (const auction of auctions) {
      await notificationService.createNotification(
        auction.seller._id.toString(),
        "auction_ending_soon",
        `Your auction "${auction.title}" is ending in less than an hour!`,
        auction._id.toString()
      );
      (auction as any).endingNotificationSent = true;
      await auction.save();
    }
  });
};
