import express from "express";
import {
  updateAvatar,
  createUser,
  currentUser,
  loginUser,
  logoutUser,
  subscriptionUpdate,
  verifyUser,
  verifyCheck,
} from "../controllers/usersControllers.js";
import {
  createUserSchema,
  loginUserSchema,
  updateUserSubscriptionSchema,
  verifyCheckSchema,
} from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";
import authMiddleware from "../middleware/auth.js";
import uploadMiddleware from "../middleware/upload.js";

const usersRouter = express.Router();

usersRouter.get("/current", authMiddleware, currentUser);
usersRouter.get("/verify/:verificationToken", verifyUser);
usersRouter.post("/verify", validateBody(verifyCheckSchema), verifyCheck);
usersRouter.post("/register", validateBody(createUserSchema), createUser);
usersRouter.post("/login", validateBody(loginUserSchema), loginUser);
usersRouter.post("/logout", authMiddleware, logoutUser);
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
