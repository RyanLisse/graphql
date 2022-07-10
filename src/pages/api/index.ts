import { createServer } from "@graphql-yoga/node";
import { join } from "path";
import { readFileSync } from "fs";
import { Resolvers } from "types";
import type { PrismaClient } from "@prisma/client";
import prisma from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export type GraphQLContext = {
  prisma: PrismaClient;
};
export async function createContext(): Promise<GraphQLContext> {
  return {
    prisma,
  };
}
const typeDefs = readFileSync(join(process.cwd(), "schema.graphql"), {
  encoding: "utf-8",
});

const resolvers: Resolvers = {
  Query: {
    cart: (_, { id }, { prisma }) => {
      return {
        id,
        totalItems: 0,
      };
    },
  },
};
const server = createServer<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  endpoint: "/api",
  schema: {
    typeDefs,
    resolvers,
  },
  context: createContext(),
});

export default server.requestListener;
