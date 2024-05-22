import express from "express";
import {
  createUser,
  currentUser,
  loginUser,
  logoutUser,
  subscriptionUpdate,
} from "../controllers/usersControllers.js";
import {
  createUserSchema,
  loginUserSchema,
  updateUserSubscriptionSchema,
} from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";
import authMiddleware from "../middleware/auth.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(createUserSchema), createUser);
usersRouter.post("/login", validateBody(loginUserSchema), loginUser);
usersRouter.post("/logout", authMiddleware, logoutUser);
usersRouter.get("/current", authMiddleware, currentUser);
usersRouter.patch(
  "/",
  authMiddleware,
  validateBody(updateUserSubscriptionSchema),
  subscriptionUpdate
);

export default usersRouter;
