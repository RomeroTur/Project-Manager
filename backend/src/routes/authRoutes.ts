import express from "express";
import { Router } from "express";
import { logout, login, register } from "#controllers";

const authRouter = Router();

authRouter.use(express.json());

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

export { authRouter };
