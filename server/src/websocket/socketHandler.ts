import { FastifyInstance } from "fastify";
import { Server } from "socket.io";

export default function setupWebSocket(fastify: FastifyInstance) {
  const io = new Server(fastify.server);

  io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    socket.on("join auction", (auctionId) => {
      socket.join(auctionId);
    });

    socket.on("leave auction", (auctionId) => {
      socket.leave(auctionId);
    });
  });

  return {
    emitBid: (auctionId: string, bidData: any) => {
      io.to(auctionId).emit("new bid", bidData);
    },
    emitChatMessage: (auctionId: string, messageData: any) => {
      io.to(auctionId).emit("new message", messageData);
    },
  };
}
