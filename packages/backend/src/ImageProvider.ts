import { MongoClient , ObjectId, Collection } from "mongodb";

interface IImageDocument {
  _id: ObjectId;
  src: string;
  name: string;
  authorId: ObjectId;
  author: {
    _id: string;
    username: string;
    email: string;
    // other author fields
  };
}

export class ImageProvider {
    private collection: Collection<IImageDocument>

    constructor(private readonly mongoClient: MongoClient) {
        const collectionName = process.env.IMAGES_COLLECTION_NAME;
        if (!collectionName) {
            throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
        }
        this.collection = this.mongoClient.db().collection(collectionName);
    }


    async updateImageName(imageId: string, newName: string): Promise<number> {

      if (!ObjectId.isValid(imageId)) {
        throw new Error("Invalid image ID format.");
      }

      const result = await this.collection.updateOne(
        { _id: new ObjectId(imageId) },   // Filter: match by ObjectId
        { $set: { name: newName } }       // Update: set new name
      );

      return result.modifiedCount;
    }


    async getAllImages(name?: string) {
      const pipeline: any[] = [];

      if (name) {
        pipeline.push({
          $match: {
            name: { $regex: name, $options: "i" } // case-insensitive partial match
          }
        });
      }
      pipeline.push(
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author"
          }
        },
        {
          $unwind: "$author"
        },
        {
          $project: {
            id: { $toString: "$_id" },
            src: 1,
            name: 1,
            author: {
              id: { $toString: "$author._id" },
              username: "$author.username"
            }
          }
        }
      );
      return this.collection.aggregate(pipeline).toArray();
    }
}