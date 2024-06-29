import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/auth";
import * as auctionController from "../controllers/auctionController";

export default async function auctionRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/",
    { preHandler: authenticate },
    auctionController.createAuction
  );
  fastify.get("/:id", auctionController.getAuction);
}
