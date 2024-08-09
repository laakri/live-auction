import { FastifyInstance } from "fastify";
import { notificationController } from "../controllers/notificationController";
import { sseController } from "../controllers/sseController";
import { authenticate } from "../middleware/auth"; // Import the authentication middleware

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/",
    { preHandler: authenticate },
    notificationController.getUnreadNotifications
  );
  fastify.put(
    "/:id/read",
    { preHandler: authenticate },
    notificationController.markAsRead
  );
  fastify.post(
    "/",
    { preHandler: authenticate },
    notificationController.createNotification
  );
  fastify.delete(
    "/:id",
    { preHandler: authenticate },
    notificationController.deleteNotification
  );
  fastify.get(
    "/sse",
    { preHandler: authenticate },
    sseController.subscribeToNotifications
  );
}
