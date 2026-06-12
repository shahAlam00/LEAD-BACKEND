import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import leadRoutes from './routes/leadRoutes.js'
import connectDB from "./config/db.js";


import facebookWebhookRoutes from "./routes/facebookWebhookRoutes.js";

dotenv.config();

connectDB();

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(express.json());


app.use(express.json({ limit: '50mb' }));
app.use(
  "/api/facebook",
  facebookWebhookRoutes
);

app.use(
  "/api/leads",
  leadRoutes
);
app.use('/api', leadRoutes);
app.get("/", (req, res) => {
  res.send("CRM Backend Running");
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server Running On Port ${process.env.PORT}`
  );
});