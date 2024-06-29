import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/auth";
import * as chatController from "../controllers/chatController";

export default async function chatRoutes(fastify: FastifyInstance) {
  fastify.post("/", { preHandler: authenticate }, chatController.sendMessage);
  fastify.get(
    "/:auctionId",
    { preHandler: authenticate },
    chatController.getMessages
  );
}
