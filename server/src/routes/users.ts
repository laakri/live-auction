import { FastifyInstance } from "fastify";
import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../controllers/userController";
import { authenticate } from "../middleware/auth";

export default async function (fastify: FastifyInstance) {
  fastify.post("/register", register);
  fastify.post("/login", login);
  fastify.get("/profile", { preHandler: authenticate }, getProfile);
  fastify.put("/profile", { preHandler: authenticate }, updateProfile);
}
