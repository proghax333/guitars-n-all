
import express from "express";
import static_videos from "../lessons.json" assert { type: "json" };

const lessonsRouter = express.Router();

const static_lessons = [
  {
    slug: "fretboard",
    name: "Fretboard",
    description: "Understand the guitar notes."
  },
  {
    slug: "technique",
    name: "Technique",
    description: "Take control of the guitar."
  },
  {
    slug: "musicianship",
    name: "Musicianship",
    description: "Build basic musical skills."
  },
  {
    slug: "theory",
    name: "Theory",
    description: "Understand how music works."
  },
  {
    slug: "reading",
    name: "Reading",
    description: "Read real sheet music."
  },
  {
    slug: "advice",
    name: "Advice",
    description: "Get tips and help."
  },
  {
    slug: "repertoire",
    name: "Repertoire",
    description: "Play real music."
  },
  {
    slug: "recommended",
    name: "Recommended",
    description: "Recommended products."
  },
  {
    slug: "exercises",
    name: "Exercises",
    description: "Build your chops."
  },
];

lessonsRouter.get("/", async (req, res, next) => {
  return res.render("pages/lessons/index", {
    lessons: static_lessons,
  });
});

const MAX_DESCRIPTION_LENGTH = 110;

lessonsRouter.get("/:type", async (req, res, next) => {
  const { type } = req.params;
  const { v: videoId } = req.query;

  const videos = static_videos[type];
  let loadedVideo = videos ? videos.find(video => video.contentDetails.videoId === videoId) : null;

  return res.render("pages/lessons/lesson-view", {
    MAX_DESCRIPTION_LENGTH,
    videos,
    loadedVideo,
    videoId,
    type,
  });
});

export default lessonsRouter;
