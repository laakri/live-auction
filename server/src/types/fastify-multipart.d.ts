import { MultipartFile } from "@fastify/multipart";
import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    parts(): AsyncIterableIterator<MultipartFile>;
  }
}
