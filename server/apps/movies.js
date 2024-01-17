import { Router } from "express";
import { db2 } from "../utils/db2.js";
import { ObjectId } from "mongodb";

const movieRouter = Router();

movieRouter.get("/", async (req, res) => {
  try {
    const title = req.query.keywords;
    const genres = req.query.genres;
    let limit = parseInt(req.query.limit) || 20;
    limit = Math.min(limit, 20);

    const query = {};
    if (title) {
      query.title = new RegExp(title, "i");
    }
    if (genres) {
      query.genres = new RegExp(genres, "i");
    }
    const collection = db2.collection("movies");
    const projection = { title: 1, poster: 1, imdb: 1, released: 1 };
    const allMovies = await collection
      .find(query)
      .limit(limit)
      .project(projection)
      .toArray();
    return res.json({ data: allMovies });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

movieRouter.get("/:id", async (req, res) => {
  try {
    const collection = db2.collection("movies");
    const movieId = new ObjectId(req.params.id);

    const movieById = await collection.findOne({ _id: movieId });

    return res.json({ data: movieById });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

movieRouter.post("/", async (req, res) => {
  try {
    const collection = db2.collection("movies");
    const movieData = { ...req.body, created_at: new Date() };
    const newMovieData = await collection.insertOne(movieData);
    return res.json({
      message: `Movie Id ${newMovieData.insertedId} has been created successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

movieRouter.put("/:id", async (req, res) => {
  try {
    const collection = db2.collection("movies");
    // นำข้อมูลที่ส่งมาใน Request Body ทั้งหมด Assign ใส่ลงไปใน Variable ที่ชื่อว่า `newProductData`
    const newMovieData = { ...req.body, modified_at: new Date() };

    //Update ข้อมูลใน Database โดยใช้ `collection.updateOne(query)` โดยการ
    // นำ productId จาก Endpoint parameter มา Assign ลงใน Variable `productId`
    // โดยที่ใช้ ObjectId ที่ Import มาจากด้านบน ในการ Convert Type ด้วย
    const movieId = new ObjectId(req.params.id);

    await collection.updateOne(
      {
        _id: movieId,
      },
      {
        $set: newMovieData,
      }
    );
    return res.json({
      message: `Movie record ${movieId} has been updated successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

movieRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db2.collection("movies");

    // Validate if the provided ID is a valid ObjectId
    const movieId = new ObjectId(req.params.id);

    // Perform delete operation
    const result = await collection.deleteOne({ _id: movieId });

    if (result.deletedCount === 1) {
      return res.json({
        message: `Movie record ${movieId} has been deleted successfully`,
      });
    } else {
      return res.status(404).json({
        message: `Movie record with ID ${movieId} not found`,
      });
    }
  } catch (error) {
    console.error("Error during movie deletion:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

export default movieRouter;
