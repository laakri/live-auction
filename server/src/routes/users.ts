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
  fastify.post("/followUser", userController.follow);
  fastify.post("/unfollowUser", userController.unfollow);
  fastify.post("/checkFollowUser", userController.checkFollow);




  fastify.get(
    "/profile",
    { preHandler: [authenticate] },
    userController.getProfile
  );
  fastify.put(
    "/VerifyProfile",
    { preHandler: [authenticate] },
    userController.VerifyProfile
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
