import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { ValidRoutes } from "./shared/ValidRoutes";
import {connectMongo} from "./connectMongo";
import { ImageProvider } from "./ImageProvider";
import { CredentialsProvider } from "./CredentialsProvider";
import { registerImageRoutes } from "./routes/imageRoutes";
import { registerAuthRoutes } from "./routes/authRoutes";
import { verifyAuthToken } from "./shared/verifyAuthToken";

dotenv.config();
const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";
const resolvedStaticDir = path.resolve(process.cwd(), STATIC_DIR);
const mongoClient = connectMongo();
const imageProvider = new ImageProvider(mongoClient);
const credentialsProvider = new CredentialsProvider(mongoClient);
const app = express();
app.locals.JWT_SECRET = process.env.JWT_SECRET



app.use(express.static(resolvedStaticDir));

app.get("/api/hello", (req: Request, res: Response) => {
    console.log("helloworld");
    res.send("Hello, World");
});

Object.values(ValidRoutes).forEach((route) => {
  app.get(route, (req, res, next) => {
    res.sendFile(path.join(resolvedStaticDir, "index.html"), (err) => {
      if (err) {
        next(err);
      } else {
        console.log(`Served index.html for ${route}`);
      }
    });
  });
});

app.use("/api/*", verifyAuthToken);
registerImageRoutes(app, imageProvider);
registerAuthRoutes(app, credentialsProvider);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
