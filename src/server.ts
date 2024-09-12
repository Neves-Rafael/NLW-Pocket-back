import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { createGoal } from "./services/create-goal";
import { z } from "zod";
import { getWeekPendingGoals } from "./services/get-week-pending-goals";
import { createGoalCompletion } from "./services/create-goal-completion";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

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

app.get("/pending-goals", async () => {
  const { pendingGoals } = await getWeekPendingGoals();

  return { pendingGoals };
});

app.post(
  "/completions",
  {
    schema: {
      body: z.object({
        goalId: z.string(),
      }),
    },
  },
  async (request) => {
    const { goalId } = request.body;

    await createGoalCompletion({ goalId });
  }
);

app
  .listen({
    host: "0.0.0.0",
    port: 3333,
  })
  .then(() => {
    return console.log("HTTP Server Running! 🔥🔥🔥");
  });
