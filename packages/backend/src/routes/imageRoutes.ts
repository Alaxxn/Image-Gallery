import express, { Request, Response } from "express";
import { ImageProvider } from "../ImageProvider";

export function registerImageRoutes(app: express.Application, imageProvider: ImageProvider) {

    app.get("/api/images", async (req: Request, res: Response) => {
        
        function waitDuration(numMs: number): Promise<void> {
            return new Promise(resolve => setTimeout(resolve, numMs));
        }
        try {
            await waitDuration(1000);
            const images = await imageProvider.getAllImages();
            res.json(images);
        } catch (err) {
            console.error("Error fetching images", err);
            res.status(500).send("Internal Server Error");
        }
    });

}