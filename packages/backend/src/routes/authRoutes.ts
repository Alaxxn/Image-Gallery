import express, { Request, Response } from "express";
import { CredentialsProvider } from "../CredentialsProvider";


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
    

}