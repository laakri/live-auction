import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify";
import jwt from "jsonwebtoken";
import { IUser } from "../models/users.model";

declare module "fastify" {
  interface FastifyRequest {
    user?: IUser;
  }
}

export const authenticate = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) => {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) {
    return reply.status(401).send({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    request.user = { _id: decoded.id } as IUser;
    done();
  } catch (error) {
    reply.status(401).send({ error: "Invalid token" });
  }
};
