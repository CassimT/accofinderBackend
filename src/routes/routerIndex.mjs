import { Router } from "express";
import listingRouter from "./listings.mjs";
import paymentsRouter from "./payments.mjs";
import userRouter from "./users.mjs";
import authRouter from "./auth.mjs";
const routerIndex = Router();

routerIndex.use(listingRouter);
routerIndex.use(paymentsRouter);
routerIndex.use(userRouter);
routerIndex.use(authRouter);

export default routerIndex;
