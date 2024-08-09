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
    }).populate("seller bids");

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

    // Check for auctions that have ended
    const endedAuctions = await Auction.find({
      endTime: { $lte: new Date() },
      status: "active",
    }).populate("bids");

    for (const auction of endedAuctions) {
      auction.status = "ended";
      await auction.save();
      // Notify winner and losers
      const highestBid = auction.bids.sort(
        (a, b) => (b as any).amount - (a as any).amount
      )[0];
      if (highestBid) {
        await notificationService.createNotification(
          (highestBid as any).bidder.toString(),
          "auction_won",
          `Congratulations! You have won the auction "${auction.title}".`,
          auction._id.toString()
        );
        const losingBidders = auction.bids
          .filter((bid) => bid.toString() !== highestBid.toString())
          .map((bid) => bid.toString());

        for (const loserId of losingBidders) {
          await notificationService.createNotification(
            loserId,
            "auction_lost",
            `You have lost the auction "${auction.title}". Better luck next time!`,
            auction._id.toString()
          );
        }
      }
    }
  });
};
