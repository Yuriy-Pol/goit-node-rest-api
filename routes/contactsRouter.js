import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from "../schemas/contactsSchemas.js";
import authMiddleware from "../middleware/auth.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authMiddleware, getAllContacts);

contactsRouter.get("/:contactId", authMiddleware, getOneContact);

contactsRouter.delete("/:contactId", authMiddleware, deleteContact);

contactsRouter.post(
  "/",
  authMiddleware,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:contactId",
  authMiddleware,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:contactId/favorite",
  validateBody(updateStatusContactSchema),
  authMiddleware,
  updateContact
);

export default contactsRouter;
