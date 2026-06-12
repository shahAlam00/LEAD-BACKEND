import express from "express";
import Lead from "../models/Lead.js";
import { getAllLeads } from "../controllers/facebookWebhookController.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const leads = await Lead.find().sort({
    createdAt: -1,
  });

  res.json(leads);
});

router.get("/get-leads", getAllLeads);

export default router; 