import "dotenv/config";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createContext } from "@Alpha/api/context";
import { appRouter } from "@Alpha/api/routers/index";
import cors from "cors";
import express from "express";
import { auth } from "@Alpha/auth";
import { toNodeHandler } from "better-auth/node";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/uploads", express.static("uploads")); // Serve static files from the 'uploads' directory

app.all("/api/auth{/*path}", toNodeHandler(auth));

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
