
import express from "express";

import _ from "./configs/env.config.js";

import morgan from "morgan";

import mainRouter from "./routes/main.router.js";
import lessonsRouter from "./routes/lessons.router.js";

import { connectToDatabase } from "./models/models.js";

const PORT = process.env.PORT || 4000;
const app = express();

async function main() {
  // Set page rendering engine to ejs.
  app.set("view engine", "ejs");
  app.set("views", "./src/views");

  // Setup logger
  app.use(morgan("tiny"));

  // Serve static assets such as css, js, images, etc.
  app.use(express.static("./src/public"));

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
