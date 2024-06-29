import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/auth";
import * as bidController from "../controllers/bidController";

export default async function bidRoutes(fastify: FastifyInstance) {
  fastify.post("/", { preHandler: authenticate }, bidController.placeBid);
}
