import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import connectDB from "./src/config/db";
import auctionRoutes from "./src/routes/auctions";
import bidRoutes from "./src/routes/bids";
import chatRoutes from "./src/routes/chats";
import fastifyEnv from "@fastify/env";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

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

async function buildServer() {
  try {
    await server.register(fastifyEnv, {
      schema: envSchema,
      dotenv: true,
    });

    server.register(cors, {
      origin: true,
    });

    server.register(websocket);

    server.register(auctionRoutes, { prefix: "/api/auctions" });
    server.register(bidRoutes, { prefix: "/api/bids" });
    server.register(chatRoutes, { prefix: "/api/chat" });

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
    await connectDB(server.config.MONGODB_URI);
    const address = await server.listen({
      port: server.config.PORT,
      host: "0.0.0.0",
    });
    console.log(`Server listening on ${address}`);

    const signals = ["SIGINT", "SIGTERM"];
    for (const signal of signals) {
      process.on(signal, () => {
        console.log(`Received ${signal}, closing server...`);
        server
          .close()
          .then(() => {
            console.log("Server closed successfully");
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
