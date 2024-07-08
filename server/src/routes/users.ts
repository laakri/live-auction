import { FastifyInstance } from "fastify";
import userController from "../controllers/userController";

import { authenticate } from "../middleware/auth";

export default function userRoutes(
  fastify: FastifyInstance,
  options: any,
  done: () => void
) {
  fastify.post("/register", userController.register);
  fastify.post("/login", userController.login);
  fastify.get(
    "/profile",
    { preHandler: [authenticate] },
    userController.getProfile
  );
  fastify.put(
    "/profile",
    { preHandler: [authenticate] },
    userController.updateProfile
  );
  fastify.put(
    "/customization",
    { preHandler: [authenticate] },
    userController.updateCustomization
  );
  fastify.get(
    "/achievements",
    { preHandler: [authenticate] },
    userController.getAchievements
  );
  fastify.get(
    "/referral",
    { preHandler: [authenticate] },
    userController.getReferralInfo
  );

  done();
}
