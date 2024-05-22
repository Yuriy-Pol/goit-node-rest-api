import Joi from "joi";

export const createUserSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string()
    .pattern(
      new RegExp(
        `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{4,}$`
      )
    )
    .required(),
}).error((errors) => {
  return new Error("Error");
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().lowercase().trim(),
  password: Joi.string().pattern(
    new RegExp(
      `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{4,}$`
    )
  ),
})
  .min(1)
  .error((errors) => {
    return new Error("Error");
  });

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string()
    .pattern(
      new RegExp(
        `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{4,}$`
      )
    )
    .required(),
}).error((errors) => {
  return new Error("Error");
});

export const updateUserSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business"),
}).error((errors) => {
  return new Error("Error");
});
