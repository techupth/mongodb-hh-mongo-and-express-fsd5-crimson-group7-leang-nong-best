// โค้ดนี้อยู่ใน Server ที่ไฟล์ index.js
//กำหนดให้ โค้ดของ API การดึงข้อมูล Blog post หลายๆ อันมีโค้ดแบบนี้
import { db } from "../server/index.js";
//Ex2,Ex3
import { ObjectId } from "mongodb";
import { db } from "../utils/db.js";


app.get("/posts", async (req, res) => {
  const collection = db.collection("posts");
  const posts = await collection.find({}).limit(10).toArray();

  return res.json({
    data: posts,
  });
});


//Ex#2 กำหนดให้โค้ด API ของการดึงข้อมูล Blog post ด้วย Id มีโค้ดแบบนี้
app.get("/posts/:id", async (req, res) => {
  const postId = new ObjectId(req.params.id);

  const collection = db.collection("posts");
  const post = await collection.find({ _id: postId }).toArray();

  return res.json({
    data: post[0],
  });
});

//Ex#3 กำหนดให้โค้ด API ของการ สร้าง Blog post มีโค้ดแบบนี้
app.post("/posts", async (req, res) => {
  const hasPublished = req.body.status === "published";

  const newPost = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: hasPublished ? new Date() : null,
  };

  const collection = db.collection("posts");
  await collection.insertOne(newPost);

  return res.json({
    message: "Post has been created.",
  });
});

//Ex4 กำหนดให้โค้ด API ของการ Update ตัว Blog post มีโค้ดแบบนี้
app.put("/posts/:id", async (req, res) => {
  const hasPublished = req.body.status === "published";

  const updatedPost = {
    ...req.body,
    updated_at: new Date(),
    published_at: hasPublished ? new Date() : null,
  };

  const postId = new ObjectId(req.params.id);
  const collection = db.collection("posts");

  await collection.updateOne(
    { _id: postId },
    {
      $set: updatedPost,
    }
  );

  return res.json({
    message: `Post ${postId} has been updated.`,
  });
});

//Ex5 กำหนดให้โค้ด API ของการ Delete ตัว Blog post ด้วย Id มีโค้ดแบบนี้
app.delete("/posts/:id", async (req, res) => {
  const postId = new ObjectId(req.params.id);

  if (!postId) {
    return res.json({
      message: "Please specified post id in order to delete",
    });
  }

  try {
    const collection = db.collection("posts");
    await collection.deleteOne({ _id: postId });
  } catch {
    return res.json({
      message: `เกิดข้อผิดพลาดในการลบข้อมูลจาก MongoDB`,
    });
  }

  return res.json({
    message: `Post ${postId} has been deleted.`,
  });
});

