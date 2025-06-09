import express, { Request, Response } from "express";
import { CredentialsProvider } from "../CredentialsProvider";
import jwt from "jsonwebtoken";

interface IAuthTokenPayload {
    username: string;
}

function generateAuthToken(username: string, jwtSecret: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const payload: IAuthTokenPayload = {
            username
        };
        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: "1d" },
            (error, token) => {
                if (error) reject(error);
                else resolve(token as string);
            }
        );
    });
}


export function registerAuthRoutes(app: express.Application, credentialsProvider : CredentialsProvider) {

    app.use(express.json());
    
    app.post("/auth/register", async (req: Request, res: Response) => {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password){
            res.status(400).send({
                error: "Bad request",
                message: "Missing username or password"
            });
        }else {
            const success = await credentialsProvider.registerUser(username, password);
            if (!success){
                res.status(409).send({
                    error: "UsernameTaken",
                    message: "Username already taken"
                });
            }else{
                res.status(200).send({
                message: "success!"
            });
            }
        }
    });

    app.post("/auth/login", async (req: Request, res: Response) => {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password){
            res.status(400).send({
                error: "Bad request",
                message: "Missing username or password"
            });
        }else {
            const success = await credentialsProvider.verifyPassword(username, password);
            if (success){
                const response = await generateAuthToken(username, app.locals.JWT_SECRET);
                res.status(200).send(response);
            }else{
                res.status(401).send({
                error: "Invalid request",
                message: "bad username or password"
                });
            }
        }
    });
    

}