import express from "express";
import {
  updateAvatar,
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
import uploadMiddleware from "../middleware/upload.js";

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
usersRouter.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  updateAvatar
);

export default usersRouter;
