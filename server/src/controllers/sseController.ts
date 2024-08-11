import { FastifyRequest, FastifyReply } from "fastify";
import { getUnreadNotificationsCount } from "../services/notificationService"; // Import the service

const clients = new Map<string, FastifyReply>();

export const sseController = {
  async subscribeToNotifications(request: FastifyRequest, reply: FastifyReply) {
    console.log("SSE connection attempt");

    // Type assertion for request.query
    const query = request.query as { userId?: string };
    const userId = query.userId;

    if (!userId) {
      reply.code(400).send("Bad Request: userId is required");
      return;
    }

    console.log(userId);

    try {
      reply.raw.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Credentials": "true",
      });

      console.log(`User ${userId} connected to SSE`);
      clients.set(userId, reply);

      // Fetch and send the initial count of unread notifications
      const initialCount = await getUnreadNotificationsCount(userId);
      reply.raw.write(`data: ${JSON.stringify({ count: initialCount })}\n\n`);

      reply.raw.write(
        `data: ${JSON.stringify({ message: "Connected to SSE" })}\n\n`
      );

      request.raw.on("close", () => {
        console.log(`User ${userId} disconnected from SSE`);
        clients.delete(userId);
      });
    } catch (error) {
      console.error("SSE connection error:", error);
      reply.code(500).send("Internal Server Error");
    }
  },

  sendNotificationCount(userId: string, count: number) {
    const client = clients.get(userId);
    console.log("count", count);
    if (client) {
      client.raw.write(`data: ${JSON.stringify({ count })}\n\n`);
    }
  },
};
