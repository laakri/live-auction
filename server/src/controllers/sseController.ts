import { FastifyRequest, FastifyReply } from "fastify";

const clients = new Map<string, FastifyReply>();

export const sseController = {
  async subscribeToNotifications(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;

    reply.raw.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    clients.set(userId, reply);

    request.raw.on("close", () => {
      clients.delete(userId);
    });
  },

  sendNotification(userId: string, notification: any) {
    const client = clients.get(userId);
    if (client) {
      client.raw.write(`data: ${JSON.stringify(notification)}\n\n`);
    }
  },
};
