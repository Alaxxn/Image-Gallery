import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import {ValidRoutes} from "./shared/ValidRoutes";



dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";
const resolvedStaticDir = path.resolve(process.cwd(), STATIC_DIR);

const app = express();
app.use(express.static(resolvedStaticDir));


app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

Object.values(ValidRoutes).forEach((route) => {
  app.get(route, (req, res, next) => {
    res.sendFile(path.resolve(STATIC_DIR, 'index.html'), (err) => {
      if (err) {
        next(err);
      } else {
        console.log(`Served index.html for ${route}`);
      }
    });
  });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
