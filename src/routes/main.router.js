
import express from "express";

const mainRouter = express.Router();

mainRouter.get("/", async (req, res, next) => {
  return res.render("pages/index");
});

export default mainRouter;
