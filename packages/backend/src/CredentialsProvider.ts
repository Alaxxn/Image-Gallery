import { Collection, MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";

interface ICredentialsDocument {
    username: string;
    password: string;
}

export class CredentialsProvider {
    private readonly collection: Collection<ICredentialsDocument>;

    constructor(mongoClient: MongoClient) {
        const COLLECTION_NAME = process.env.CREDS_COLLECTION_NAME;
        if (!COLLECTION_NAME) {
            throw new Error("Missing CREDS_COLLECTION_NAME from env file");
        }
        this.collection = mongoClient.db().collection<ICredentialsDocument>(COLLECTION_NAME);
    }
    
    // register user
    async registerUser(username: string, plaintextPassword: string): Promise<boolean> {

        const existingUser = await this.collection.findOne({ username : username });
        if (existingUser) {
            return false;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plaintextPassword, salt);

        await this.collection.insertOne({
            username: username,
            password: hashedPassword,
        });

        return true;
    }

    async verifyPassword(username: string, plaintextPassword: string): Promise<boolean> {
        const user = await this.collection.findOne({ username: username });
        
        if (!user) {
            return false; // User not found
        }

        const hashedPassword = user.password;
        const isMatch = await bcrypt.compare(plaintextPassword, hashedPassword);

        return isMatch;
    }
    
}
