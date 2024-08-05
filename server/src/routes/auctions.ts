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
  fastify.get(
    "/:id",
    { preHandler: authenticate },
    auctionController.getAuction
  );
  fastify.get("/discovery", auctionController.getDiscoveryAuctions);

  fastify.put(
    "/:auctionId/owner-controls",
    { preHandler: authenticate },
    auctionController.updateOwnerControls
  );
  fastify.post(
    "/:auctionId/end-early",
    { preHandler: authenticate },
    auctionController.endAuctionEarly
  );
  fastify.post(
    "/auctions/:id/invite",
    { preHandler: authenticate },
    auctionController.inviteUsers
  );
  fastify.delete(
    "/auctions/:id/invite/:userId",
    { preHandler: authenticate },
    auctionController.removeInvitedUser
  );
}
