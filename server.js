import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import leadRoutes from './routes/leadRoutes.js'
import connectDB from "./config/db.js";
import adminRoutes from './routes/adminRoutes.js'
import authRoute from './routes/authRoute.js'
import facebookWebhookRoutes from "./routes/facebookWebhookRoutes.js";
// import {createAdmin} from "./utils/createAdmin.js";
dotenv.config();

connectDB();

const app = express();
app.use(express.urlencoded({ extended: true }))


// Sabse pehle middleware lagayein
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
 

app.use(express.json({ limit: '50mb' }));
app.use(
  "/api/facebook",
  facebookWebhookRoutes
);
// createAdmin()
app.use("/api/auth",authRoute) 
app.use(
  "/api/leads",
  leadRoutes
);


app.use("/api/admin",adminRoutes)
app.use('/api', leadRoutes);
app.get("/", (req, res) => {
  res.send("CRM Backend Running");
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server Running On Port ${process.env.PORT}`
  );
});