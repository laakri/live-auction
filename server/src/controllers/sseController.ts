import { FastifyRequest, FastifyReply } from "fastify";

const clients = new Map<string, FastifyReply>();

export const sseController = {
  async subscribeToNotifications(request: FastifyRequest, reply: FastifyReply) {
    console.log("SSE connection attempt");

    const userId = request.user?._id;

    if (!userId) {
      reply.code(401).send("Unauthorized: User not authenticated");
      return;
    }

    try {
      reply.raw.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      console.log(`User ${userId} connected to SSE`);
      clients.set(userId.toString(), reply);

      reply.raw.write(
        `data: ${JSON.stringify({ message: "Connected to SSE" })}\n\n`
      );

      request.raw.on("close", () => {
        console.log(`User ${userId} disconnected from SSE`);
        clients.delete(userId.toString());
      });
    } catch (error) {
      console.error("SSE connection error:", error);
      reply.code(500).send("Internal Server Error");
    }
  },

  sendNotification(userId: string, notification: any) {
    const client = clients.get(userId);
    if (client) {
      client.raw.write(`data: ${JSON.stringify(notification)}\n\n`);
    }
  },
};
