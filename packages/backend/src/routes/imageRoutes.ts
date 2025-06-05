import express, { Request, Response } from "express";
import { ImageProvider } from "../ImageProvider";

export function registerImageRoutes(app: express.Application, imageProvider: ImageProvider) {

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

    app.get("/api/images/search", async (req: Request, res: Response) => {
        const name = req.query.name as string | undefined;
        try {
            await waitDuration(1000);
            const images = await imageProvider.getAllImages(name);
            res.json(images);
        } catch (err) {
            console.error("Error fetching images", err);
            res.status(500).send("Internal Server Error");
        }
    });

}