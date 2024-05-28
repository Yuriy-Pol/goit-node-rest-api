import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "node:path";

import connect from "./db.js";
import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";

const PORT = process.env.PORT;
const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/avatars", express.static(path.resolve("public", "avatars")));
app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, _, res, __) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

connect()
  .then(
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    })
  )
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
