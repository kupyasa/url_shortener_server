import express from "express";
import { createShortLink,getShortLink,searchShortLink,mostClickedLinks,topLinkCreators } from "../controllers/shortlinks.js";

const router = express.Router();

router.get("/:hashedId",getShortLink);
router.get("/top-link-creators",topLinkCreators)
router.get("/most-clicked-links",mostClickedLinks)
router.get("/search",searchShortLink);
router.post("/", createShortLink);


export default router;
