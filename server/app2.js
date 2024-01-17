import express from "express";
import cors from "cors";
import movieRouter from "./apps/movies.js";
import { dbClient2 } from "./utils/db2.js";
import { MongoError } from "mongodb";

// `cors` เป็น Middlewaport { AggregationCursor } from "mongodb";re ที่ทำให้ Client ใดๆ ตามที่กำหนด
// สามารถสร้าง Request มาหา Server เราได้
// ในโค้ดบรรทัดล่างนี้คือให้ Client ไหนก็ได้สามารถสร้าง Request มาหา Server ได้
const init = async () => {
  try {
    const app = express();
    const port = 4008;
    //connect Database
    await dbClient2.connect();
    console.log(dbClient2);
    app.use(cors());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    //use product Router
    app.use("/movies", movieRouter);

    app.get("/", (req, res) => {
      res.send("Root ,Movie OK");
    });

    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  } catch (error) {
    if (error instanceof MongoError) {
      console.error("เกิดข้อผิดพลาดของ MongoDB:", error.message);
    } else {
      console.error("เกิดข้อผิดพลาด:", error.message);
    }
  }
};
init();
