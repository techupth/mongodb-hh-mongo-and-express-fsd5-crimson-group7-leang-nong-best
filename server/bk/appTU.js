import express from "express";
import { client } from "../utils/db.js";

async function init() {
  // เรียกใช้ Function `connect` จาก `client`
  // อย่าลืม `await` เนื่องจาก `connect`เป็น async
  await client.connect();
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const PORT = process.env.PORT || 4001;
  app.listen(PORT, () => {
    console.log(`running on http://localhost:${PORT}`);
  });
}

init();
