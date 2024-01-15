import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 5;
    const skip = (page - 1) * pageSize;
    const name = req.query.keywords;
    const category = req.query.category;
    const query = {};

    if (name) {
      query.name = new RegExp(name, "i");
    }

    if (category) {
      query.category = new RegExp(category, "i");
    }

    const collection = db.collection("products");
    const allProducts = await collection
      .find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    return res.json({ data: allProducts });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

productRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);

    const productById = await collection.findOne({ _id: productId });

    return res.json({ data: productById });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productData = { ...req.body, created_at: new Date() };
    const newProductData = await collection.insertOne(productData);
    return res.json({
      message: `Product Id ${newProductData.insertedId} has been created successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

productRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const newProductData = { ...req.body, modified_at: new Date() };
    const productId = new ObjectId(req.params.id);

    await collection.updateOne(
      {
        _id: productId,
      },
      {
        $set: newProductData,
      }
    );
    return res.json({
      message: `Movie record ${productId} has been updated successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

productRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);

    await collection.deleteOne({ _id: productId });

    return res.json({
      message: `Movie record ${productId} has been deleted successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

export default productRouter;
