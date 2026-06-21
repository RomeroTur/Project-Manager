import { Router } from "express";
import { authMiddleware } from "#middleware";
import { aiChatController } from "#controllers";

const aiRouter = Router();

aiRouter.post("/chat", authMiddleware, aiChatController);

export { aiRouter };
