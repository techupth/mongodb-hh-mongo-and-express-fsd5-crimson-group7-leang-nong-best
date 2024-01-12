import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

//Exercise #3
productRouter.get("/", async (req, res) => {
  const collection = db.collection("products");
  const products = await collection.find({ category: "it" }).toArray();

  return res.json({ data: products });
});

productRouter.get("/:id", (req, res) => {});

//Exercise #2
productRouter.post("/", async (req, res) => {
  const collection = db.collection("products");
  const productData = { ...req.body };
  const products = await collection.insertOne(productData);

  return res.json({
    message: `Product (${products.insertedId}) has been created successfully`,
  });
});

//Exercise #4
productRouter.put("/:id", async (req, res) => {
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
});

//Exercise #5
productRouter.delete("/:id", async (req, res) => {
  const collection = db.collection("products");
  const id = new ObjectId(req.params.id);

  await collection.deleteOne({
    _id: id,
  });

  return res.json({
    message: `Product ${id} has been deleted successfully`,
  });
});

export default productRouter;
