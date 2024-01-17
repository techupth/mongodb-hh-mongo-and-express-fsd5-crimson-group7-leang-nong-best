import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";
//import { loggerMiddleware } from "./products.middleware.js";

const productRouter = Router();
//productRouter.use(loggerMiddleware);

productRouter.get("/", async (req, res) => {
  try {
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
    // ตรวจสอบว่ามี Sorting Parameter ที่ถูกส่งมาหรือไม่
    const sortBy = req.query.sortBy || "created_at";
    const sortOrder = req.query.sortOrder || "desc";

    // ทำ Sorting ตาม Parameter
    const sortQuery = {};
    sortQuery[sortBy] = sortOrder === "desc" ? -1 : 1;
    const products = await collection.find().sort(sortQuery).toArray();
    //old
    // const allProducts = await collection.find(query).limit(10).toArray();
    return res.json(products);
    // return res.json({ data: allProducts });
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
    const { name, image, price, description, category } = req.body;
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
    // นำข้อมูลที่ส่งมาใน Request Body ทั้งหมด Assign ใส่ลงไปใน Variable ที่ชื่อว่า `newProductData`
    const newProductData = { ...req.body, modified_at: new Date() };

    //Update ข้อมูลใน Database โดยใช้ `collection.updateOne(query)` โดยการ
    // นำ productId จาก Endpoint parameter มา Assign ลงใน Variable `productId`
    // โดยที่ใช้ ObjectId ที่ Import มาจากด้านบน ในการ Convert Type ด้วย
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
      message: `Product record ${productId} has been deleted successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});
// productRouter.delete("/:id", async (req, res) => {
//   try {
//     const collection = db.collection("products");

//     // Validate if the provided ID is a valid ObjectId
//     const productId = new ObjectId(req.params.id);

//     // Perform delete operation
//     const result = await collection.deleteOne({ _id: productId });

//     if (result.deletedCount === 1) {
//       return res.json({
//         message: `Movie record ${movieId} has been deleted successfully`,
//       });
//     } else {
//       return res.status(404).json({
//         message: `Movie record with ID ${movieId} not found`,
//       });
//     }
//   } catch (error) {
//     console.error("Error during movie deletion:", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// });
// productRouter.use(express.json());

// productRouter.use((error, req, res, next) => {
//   if (error instanceof SyntaxError) {
//     return res.status(400).json({ error: "Invalid JSON syntax" });
//   }
//   next();
// });

export default productRouter;
