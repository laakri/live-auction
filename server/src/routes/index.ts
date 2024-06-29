import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/auth";
import * as auctionController from "../controllers/auctionController";
import * as bidController from "../controllers/bidController";
import * as chatController from "../controllers/chatController";

export default async function routes(fastify: FastifyInstance) {
  // Auction routes
  fastify.post(
    "/auctions",
    { preHandler: authenticate },
    auctionController.createAuction
  );
  fastify.get("/auctions/:id", auctionController.getAuction);

  // Bid routes
  fastify.post("/bids", { preHandler: authenticate }, bidController.placeBid);

  // Chat routes
  fastify.post(
    "/chat",
    { preHandler: authenticate },
    chatController.sendMessage
  );
  fastify.get(
    "/chat/:auctionId",
    { preHandler: authenticate },
    chatController.getMessages
  );
}
