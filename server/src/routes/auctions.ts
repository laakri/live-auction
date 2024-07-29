import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/auth";
import * as auctionController from "../controllers/auctionController";

export default async function auctionRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/",
    { preHandler: authenticate },
    auctionController.createAuction
  );
  fastify.put(
    "/:id",
    { preHandler: authenticate },
    auctionController.updateAuction
  );

  fastify.delete(
    "/:id",
    { preHandler: authenticate },
    auctionController.deleteAuction
  );
  fastify.get("/:id", auctionController.getAuction);
  fastify.get("/discovery", auctionController.getDiscoveryAuctions);

  fastify.get("/search", auctionController.searchAuctions);
}
