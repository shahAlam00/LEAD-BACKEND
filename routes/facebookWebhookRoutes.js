import express from "express";

import {
  verifyWebhook,
  receiveLead,
} from "../controllers/facebookWebhookController.js";

const router = express.Router();

router.get("/webhook", verifyWebhook);

router.post("/webhook", receiveLead);

export default router;