import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contact.js";

export const getAllContacts = async (_, res, next) => {
  try {
    const allContacts = await Contact.find();
    res.status(200).send(allContacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactToFind = await Contact.findById(contactId);

    if (!contactToFind) throw HttpError(404);

    res.status(200).send(contactToFind);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactToDelete = await Contact.findByIdAndDelete(contactId);

    if (!contactToDelete) throw HttpError(404);

    res.status(200).send(contactToDelete);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const addedContact = await Contact.create(
      req.body.name,
      req.body.email,
      req.body.phone
    );
    res.json(addedContact).status(201);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedContact = await Contact.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });

    if (!updatedContact) {
      throw HttpError(404);
    }

    res.json(updatedContact).status(200);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite: req.body.favorite },
      { new: true }
    );

    if (!updatedContact) {
      throw HttpError(404);
    }

    res.json(updatedContact).status(200);
  } catch (error) {
    next(error);
  }
};
