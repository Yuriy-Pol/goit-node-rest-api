import { v4 as uuId } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";
import sendMail from "../helpers/MailSender.js";

import User from "../models/user.js";

export const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user !== null) throw HttpError(409, "Email in use");

    const passwordHash = await bcrypt.hash(password, 10);
    const verifyToken = uuId();

    const avatarUrl = gravatar.url(email, { protocol: "http", size: "250" });

    const addUser = await User.create({
      email,
      password: passwordHash,
      avatarURL: avatarUrl,
      verificationToken: verifyToken,
    });

    await sendMail(email, verifyToken);

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

    if (!user) throw HttpError(401, "Email or password is wrong");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw HttpError(401, "Email or password is wrong");

    if (!user.verify)
      res.status(401).send({ message: "Please verify your email" });

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
      avatarURL: req.user.avatarURL,
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

export const verifyUser = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOneAndUpdate(
      { verificationToken },
      { verify: true, verificationToken: null },
      { new: true }
    );

    if (!user) throw HttpError(404, "User not found");

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const verifyCheck = async (req, res, next) => {
  try {
    const { email } = req.body;
    const verifyToken = uuId();

    const user = await User.findOneAndUpdate(
      { email, verify: false },
      { verificationToken: verifyToken },
      { new: true }
    );

    if (!user) {
      throw HttpError(400, "Verification has already been passed");
    }

    await sendMail(email, verifyToken);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
