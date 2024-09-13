import { z } from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createGoal } from "../services/create-goal";

export const createGoalRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/goals",
    {
      schema: {
        body: z.object({
          title: z.string(),
          desiredWeeklyFrequency: z.number(),
        }),
      },
    },
    async (request) => {
      const { desiredWeeklyFrequency, title } = request.body;

      await createGoal({ title, desiredWeeklyFrequency });
    }
  );
};
