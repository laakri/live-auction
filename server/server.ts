import Fastify, { FastifyInstance } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import connectDB from "./src/config/db";
import { auctionRoutes } from "./src/routes/auctions";
// import { userRoutes } from "./src/routes/users";
// import { bidRoutes } from "./src/routes/bids";

const server: FastifyInstance = Fastify({});

server.register(cors, {
  origin: true,
});

server.register(websocket);

server.register(auctionRoutes, { prefix: "/api/auctions" });
// server.register(userRoutes, { prefix: "/api/users" });
// server.register(bidRoutes, { prefix: "/api/bids" });

const start = async () => {
  try {
    await connectDB();
    await server.listen({ port: 3000 });
    console.log(`Server listening on 3000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
