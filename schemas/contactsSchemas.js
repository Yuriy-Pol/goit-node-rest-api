import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(
      new RegExp(`^[+]?[(]?[0-9]{1,3}[)]?[- ]?[0-9]{1,3}[- ]?[0-9]{1,6}$`)
    )
    .required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  phone: Joi.string().pattern(
    new RegExp(`^[+]?[(]?[0-9]{1,3}[)]?[- ]?[0-9]{1,3}[- ]?[0-9]{1,6}$`)
  ),
})
  .min(1)
  .message("Body must have at least one field");

export const updateStatusContactSchema = Joi.object({
  favorite: Joi.boolean(),
});
