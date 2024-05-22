import jwt from "jsonwebtoken";

import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

const auth = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) throw HttpError(401);

    const [bearer, token] = authorizationHeader.split(" ", 2);

    if (bearer !== "Bearer") throw HttpError(401);

    await jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) throw HttpError(401);

      const user = await User.findById(decode.id);

      if (user === null) throw HttpError(401);

      if (user.token !== token) throw HttpError(401);

      req.user = {
        id: user._id,
        email: user.email,
      };

      next();
    });
  } catch (error) {
    next(error);
  }
};

export default auth;
