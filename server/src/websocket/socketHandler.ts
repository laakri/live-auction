import { Server, Socket } from "socket.io";
import Auction from "../models/auctions.model";

let io: Server;
const auctionViewers: Map<string, Set<string>> = new Map();

export function setupWebSocket(socketIo: Server) {
  io = socketIo;
  io.on("connection", (socket: Socket) => {
    console.log("New WebSocket connection");

    socket.on("join auction", (auctionId: string) => {
      socket.join(auctionId);
      joinAuction(socket.id, auctionId);
    });

    socket.on("leave auction", (auctionId: string) => {
      socket.leave(auctionId);
      leaveAuction(socket.id, auctionId);
    });

    socket.on("disconnect", () => {
      handleDisconnect(socket.id);
    });
  });
}

async function joinAuction(socketId: string, auctionId: string) {
  if (!auctionViewers.has(auctionId)) {
    auctionViewers.set(auctionId, new Set());
  }
  auctionViewers.get(auctionId)!.add(socketId);
  await updateViewerCount(auctionId);
}

async function leaveAuction(socketId: string, auctionId: string) {
  const viewers = auctionViewers.get(auctionId);
  if (viewers) {
    viewers.delete(socketId);
    await updateViewerCount(auctionId);
  }
}

async function handleDisconnect(socketId: string) {
  for (const [auctionId, viewers] of auctionViewers.entries()) {
    if (viewers.has(socketId)) {
      viewers.delete(socketId);
      await updateViewerCount(auctionId);
    }
  }
}

async function updateViewerCount(auctionId: string) {
  const count = auctionViewers.get(auctionId)?.size || 0;
  io.to(auctionId).emit("viewer count update", count);

  // Update the database
  await Auction.findByIdAndUpdate(auctionId, {
    $set: { currentViewers: count },
    $max: { totalUniqueViewers: count },
  });
}

export const socketHandler = {
  emitBid: (auctionId: string, bidData: any) => {
    io?.to(auctionId).emit("new bid", bidData);
    io?.to(auctionId).emit("price update", bidData.amount);
  },
  emitChatMessage: (auctionId: string, messageData: any) => {
    io?.to(auctionId).emit("new message", messageData);
  },
  emitOwnerControlsUpdate: (auctionId: string, controlsData: any) => {
    io?.to(auctionId).emit("owner controls update", controlsData);
  },
  emitAuctionEnded: (auctionId: string) => {
    io?.to(auctionId).emit("auction ended");
  },
  // New method to manually update viewer count (if needed)
  updateViewerCount: (auctionId: string) => {
    updateViewerCount(auctionId);
  },
  emitInvitedUsersUpdate: (auctionId: string, invitedUsers: any[]) => {
    io?.to(auctionId).emit("invited users update", invitedUsers);
  },
};
