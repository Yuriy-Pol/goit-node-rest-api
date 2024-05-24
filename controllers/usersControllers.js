import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";

import User from "../models/user.js";

export const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user !== null) {
      throw HttpError(409, "Email in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const avatarUrl = gravatar.profile_url(email, {
      protocol: "http",
      format: "png",
    });

    const addUser = await User.create({
      email,
      password: passwordHash,
      avatarURL: avatarUrl,
    });

    res.status(201).json({
      user: {
        email: addUser.email,
        subscription: addUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );
    const addUserToken = await User.findByIdAndUpdate(
      user._id,
      { token },
      { new: true }
    );

    res.status(200).json({
      token: addUserToken.token,
      user: {
        email: addUserToken.email,
        subscription: addUserToken.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const currentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      email: req.user.email,
      subscription: req.user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const subscriptionUpdate = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });

    res.status(200).json({
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const extname = path.extname(req.file.path);
    const basename = path.basename(req.file.path, extname);
    const newAvatarName = `${basename}-250x250${extname}`;
    const avatarResize = await Jimp.read(req.file.path);

    await avatarResize.resize(256, 256).writeAsync(req.file.path);

    await fs.rename(
      req.file.path,
      path.resolve("public", "avatars", newAvatarName)
    );

    const avatarURL = `/avatars/${newAvatarName}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarURL: avatarURL },
      {
        new: true,
      }
    );

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};
