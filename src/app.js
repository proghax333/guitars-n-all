
import express from "express";

import _ from "./configs/env.config.js";

import morgan from "morgan";

import mainRouter from "./routes/main.router.js";
import lessonsRouter from "./routes/lessons.router.js";

import { connectToDatabase, db } from "./models/models.js";
import { patchRender } from "./middlewares/render-patcher.js";

import { ironSession } from "iron-session/express";

const PORT = process.env.PORT || 4000;

const sessionConfig = {
  cookieName: "gth_session",
  password: process.env.SECRET_COOKIE_PASSWORD || "this is just some development cookie password",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

const app = express();


async function main() {
  const session = ironSession(sessionConfig);

  // Set page rendering engine to ejs.
  app.set("view engine", "ejs");
  app.set("views", "./src/views");

  app.use(session);

  // Monkeypatch res.render function
  app.use(patchRender());

  // Setup logger
  app.use(morgan("tiny"));

  // Serve static assets such as css, js, images, etc.
  app.use(express.static("./src/public"));

  // Url encoded form handler
  app.use(express.urlencoded({ extended: true }));

  // Setup routes
  app.use(mainRouter);
  app.use("/lessons", lessonsRouter);

  try {
    const result = await connectToDatabase();
  } catch (error) {
    console.log("Could not connect to database server.");
    console.log(error.message);
    console.log("App exited.");
    
    return;
  }

  // Start the server
  app.listen(PORT, () => {
    console.log(`Started the server on port ${PORT}.`);
  });
}

main();
