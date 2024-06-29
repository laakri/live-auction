import { FastifyInstance } from "fastify";
import {
  getAllAuctions,
  createAuction,
} from "../controllers/auctionController";

export async function auctionRoutes(fastify: FastifyInstance) {
  fastify.get("/", getAllAuctions);
  fastify.post("/", createAuction);
}
