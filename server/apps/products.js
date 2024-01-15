import { Router, query } from "express";
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
    return res.status(404).json({
      message: `${error}`,
      status: 404,
    });
  }
});

productRouter.get("/:id", (req, res) => {});

productRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productData = {
      ...req.body,
      created_at: new Date().toLocaleString(),
    };
    const products = await collection.insertOne(productData);

    return res.json({
      message: `Product (${products.insertedId}) has been created successfully`,
    });
  } catch (error) {
    return res.status(404).json({
      message: `${error}`,
      status: 404,
    });
  }
});

productRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");

    const id = new ObjectId(req.params.id);
    const newProductData = { ...req.body };

    await collection.updateOne(
      {
        _id: id,
      },
      {
        $set: newProductData,
      }
    );

    res.json({
      message: `Product (${id}) has been updated successfully`,
    });
  } catch {
    return res.status(404).json({
      message: `${error}`,
      status: 404,
    });
  }
});

productRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const id = new ObjectId(req.params.id);

    await collection.deleteOne({
      _id: id,
    });

    return res.json({
      message: `Product ${id} has been deleted successfully`,
    });
  } catch {
    return res.status(404).json({
      message: `${error}`,
      status: 404,
    });
  }
});

export default productRouter;
