import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { ValidRoutes } from "./shared/ValidRoutes";
import { fetchDataFromServer } from "./shared/ApiImageData";
import {connectMongo} from "./connectMongo";
import { ImageProvider } from "./ImageProvider";


dotenv.config();
const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";
const resolvedStaticDir = path.resolve(process.cwd(), STATIC_DIR);
const mongoClient = connectMongo();
const imageProvider = new ImageProvider(mongoClient);
const app = express();



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

function waitDuration(numMs: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, numMs));
}

app.get("/api/images", async (req: Request, res: Response) => {
  try {
    await waitDuration(1000);
    const images = await imageProvider.getAllImages();
    res.json(images);
  } catch (err) {
    console.error("Error fetching images", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
