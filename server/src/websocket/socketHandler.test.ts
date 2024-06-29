import { FastifyInstance } from "fastify";
import { Server } from "socket.io";

let io: Server;

export function setupWebSocket(fastify: FastifyInstance) {
  io = new Server(fastify.server);

  io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    socket.on("join auction", (auctionId) => {
      socket.join(auctionId);
    });

    socket.on("leave auction", (auctionId) => {
      socket.leave(auctionId);
    });
  });
}

export const socketHandler = {
  emitBid: (auctionId: string, bidData: any) => {
    io?.to(auctionId).emit("new bid", bidData);
  },
  emitChatMessage: (auctionId: string, messageData: any) => {
    io?.to(auctionId).emit("new message", messageData);
  },
};
