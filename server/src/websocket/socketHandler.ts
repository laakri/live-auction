import { Server } from "socket.io";

let io: Server;

export function setupWebSocket(socketIo: Server) {
  io = socketIo;
  io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    socket.on("join auction", (auctionId: string) => {
      socket.join(auctionId);
    });

    socket.on("leave auction", (auctionId: string) => {
      socket.leave(auctionId);
    });
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
};
