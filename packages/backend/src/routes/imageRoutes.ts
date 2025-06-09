import express, { Request, Response } from "express";
import { ImageProvider } from "../ImageProvider";


export function registerImageRoutes(app: express.Application, imageProvider: ImageProvider) {

    function waitDuration(numMs: number): Promise<void> {
        console.log(numMs)
        return new Promise(resolve => setTimeout(resolve, Math.random() * 5000));
    }

    app.use(express.json());
    
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

    app.patch("/api/images/:id/name", async (req: Request, res: Response) => {
        const imageId = req.params.id;
        const newName = req.body.name;
        const MAX_NAME_LENGTH = 100;
        const username = req.user?.username;

        if (!newName || typeof newName !== "string") {
            res.status(400).send({
                error: "Bad Request",
                message: "Name must be a string"
            });
        } else if (newName.length > MAX_NAME_LENGTH) {
            res.status(422).send({
                error: "Unprocessable Entity",
                message: `Image name exceeds ${MAX_NAME_LENGTH} characters`
            });
        }  
        try {
            const image = await imageProvider.getImageById(imageId);

            if (!image) {
                res.status(404).send({
                    error: "Not Found",
                    message: "Image does not exist"
                });
            } else if (image.author.username !== username) {
                res.status(403).send({
                    error: "Forbidden",
                    message: "You do not own this image"
                });
            }else{
                const changed = await imageProvider.updateImageName(imageId, newName);
                if (changed === 1) {
                    res.status(200).send();
                } else {
                    res.status(500).send({ error: "Unexpected error updating image." });
                }
            }
        } catch (err) {
            console.error("Failed to update image name:", err);
            res.status(500).json({ error: "Internal server error." });
        }
    });

    /*
    app.patch("/api/images/:id/name", async (req: Request, res: Response) => {
        const imageId = req.params.id;
        const newName = req.body.name;
        const MAX_NAME_LENGTH = 100;
        console.log("changing name");
        // input validation
        if (!newName || typeof newName !== "string") {
            res.status(400).send({
                error: "Bad Request",
                message: "Name must be a string"
            });
        }
        else if (newName.length > MAX_NAME_LENGTH){
            res.status(422).send({
                error: "Unprocessable Entity",
                message: `Image name exceeds ${MAX_NAME_LENGTH} characters`
            });
        }
        else{
        try {
            const changed = await imageProvider.updateImageName(imageId, newName);

            if (changed === 1) {
                console.log("name changed");
                res.status(200).send();
            } else {
                res.status(404).send({
                    error: "Not Found",
                    message: "Image does not exist"
                });
            }
        } catch (err) {
            console.error("Failed to update image name:", err);
            res.status(500).json({ error: "Internal server error." });
        }
        }
    });
    */

    

}