import { Router } from "express";
import ObjectId from "mongodb";
import { db } from "../utils/db.js";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const collection = db.collection("products");
  const products = await collection.find({}).limit(10).toArray();

  return res.json({
    data: products,
  });
});

productRouter.get("/:id", async (req, res) => {
  const productId = new ObjectId(req.params.id);

  const collection = db.collection("products");
  const post = await collection.find({ _id: productId }).toArray();

  return res.json({
    data: post[0],
  });
});

productRouter.post("/", async (req, res) => {
  const hasPublished = req.body.status === "published";

  const newPost = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: hasPublished ? new Date() : null,
  };

  const collection = db.collection("products");
  await collection.insertOne(newPost);

  return res.json({
    message: "Product has been created.",
  });
});

productRouter.put("/:id", async (req, res) => {
  const hasPublished = req.body.status === "published";

  const updatedPost = {
    ...req.body,
    updated_at: new Date(),
    published_at: hasPublished ? new Date() : null,
  };

  const productId = new ObjectId(req.params.id);
  const collection = db.collection("products");

  await collection.updateOne(
    { _id: productId },
    {
      $set: updatedPost,
    }
  );

  return res.json({
    message: `Post ${postId} has been updated.`,
  });
});

productRouter.delete("/:productId", async (req, res) => {
  const productId = ObjectId(req.params.ProductId);

  if (!productId) {
    return res.json({
      message: "Please specify product id in order to delete",
    });
  }

  try {
    const collection = db.collection("products");
    const result = await collection.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      return res.json({
        message: `Product ${productId} not found.`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error deleting data from MongoDB",
      error: error.message, // Add more details if needed
    });
  }

  return res.json({
    message: `Product ${productId} has been deleted.`,
  });
});

export default productRouter;
