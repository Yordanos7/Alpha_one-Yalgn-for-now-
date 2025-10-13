import "dotenv/config";
import "dotenv/config";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createContext } from "@Alpha/api/context";
import { appRouter } from "@Alpha/api/routers/index";
import cors from "cors";
import express from "express";
import { auth } from "@Alpha/auth";
import { toNodeHandler } from "better-auth/node";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Ensure the uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.use("/uploads", express.static("uploads")); // Serve static files from the 'uploads' directory

// Dedicated endpoint for profile image uploads
app.post(
  "/api/upload-profile-image",
  upload.single("profileImage"),
  (req, res) => {
    console.log("Received request to /api/upload-profile-image");
    if (!req.file) {
      console.error("No file uploaded in the request.");
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log("File received:", req.file);
    const filePath = `/uploads/${req.file.filename}`;
    console.log("Generated filePath:", filePath);
    res.status(200).json({ message: "File uploaded successfully", filePath });
  }
);

app.all("/api/auth{/*path}", toNodeHandler(auth)); // Use toNodeHandler set by better-auth, the main purpose is to handle auth routes this route should be before trpc middleware and it is important to use app.all to handle all methods

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
