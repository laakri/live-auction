import { FastifyRequest, FastifyReply } from "fastify";
import Auction from "../models/auctions.model";

export const getAllAuctions = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const auctions = await Auction.find();
    reply.send(auctions);
  } catch (error) {
    reply.status(500).send({ error: "Internal Server Error" });
  }
};

export const createAuction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const auction = new Auction(request.body);
    await auction.save();
    reply.status(201).send(auction);
  } catch (error) {
    reply.status(400).send({ error: "Bad Request" });
  }
};
