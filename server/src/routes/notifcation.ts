import { FastifyInstance } from "fastify";
import { notificationController } from "../controllers/notificationController";
import { sseController } from "../controllers/sseController";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", notificationController.getUnreadNotifications);
  fastify.put("/:id/read", notificationController.markAsRead);
  fastify.post("/", notificationController.createNotification);
  fastify.delete("/:id", notificationController.deleteNotification);
  fastify.get("/sse", sseController.subscribeToNotifications);
}
