import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import fastifyIO from "fastify-socket.io";
import connectDB from "./src/config/db";
import auctionRoutes from "./src/routes/auctions";
import bidRoutes from "./src/routes/bids";
import chatRoutes from "./src/routes/chats";
import userRoutes from "./src/routes/users";
import fastifyEnv from "@fastify/env";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { setupWebSocket } from "./src/websocket/socketHandler";
import { Server } from "socket.io";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";

interface EnvConfig {
  PORT: number;
  MONGODB_URI: string;
}

const envSchema = {
  type: "object",
  required: ["PORT", "MONGODB_URI"],
  properties: {
    PORT: {
      type: "number",
      default: 3000,
    },
    MONGODB_URI: {
      type: "string",
    },
  },
};

declare module "fastify" {
  interface FastifyInstance {
    config: EnvConfig;
  }
}

const server: FastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
}

async function buildServer() {
  try {
    await server.register(fastifyEnv, {
      schema: envSchema,
      dotenv: true,
    });

    server.register(cors, {
      origin: ["http://localhost:5173", "http://localhost:3000"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    });

    await server.register(fastifyIO, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    await server.register(multipart, {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    });
    await server.register(fastifyStatic, {
      root: path.join(__dirname, "./src/uploads"),
      prefix: "/uploads/",
      decorateReply: false,
      logLevel: "debug",
    });

    // Set up WebSocket
    server.ready().then(() => {
      if (server.io) {
        setupWebSocket(server.io);
      } else {
        console.error("Socket.IO not initialized");
      }
    });

    server.register(auctionRoutes, { prefix: "/api/auctions" });
    server.register(bidRoutes, { prefix: "/api/bids" });
    server.register(chatRoutes, { prefix: "/api/chat" });
    server.register(userRoutes, { prefix: "/api/users" });

    server.setErrorHandler((error, request, reply) => {
      server.log.error(error);
      reply.status(500).send({ error: "Internal Server Error" });
    });

    return server;
  } catch (err) {
    console.error("Error building server:", err);
    process.exit(1);
  }
}

async function startServer() {
  try {
    const server = await buildServer();
    await connectDB();
    const address = await server.listen({
      port: server.config.PORT,
      host: "0.0.0.0",
    });
    // console.log(`Server listening on ${address}`);

    const signals = ["SIGINT", "SIGTERM"];
    for (const signal of signals) {
      process.on(signal, () => {
        // console.log(`Received ${signal}, closing server...`);
        server
          .close()
          .then(() => {
            // console.log("Server closed successfully");
            process.exit(0);
          })
          .catch((err) => {
            console.error("Error closing server:", err);
            process.exit(1);
          });
      });
    }
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
}

startServer();
