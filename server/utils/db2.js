// Set up db connection here
const MongoDB_URL =
  "mongodb+srv://devrleang:4321@cluster0.6hdh41z.mongodb.net/";

import { MongoClient } from "mongodb";

const connectionString = MongoDB_URL;

export const dbClient2 = new MongoClient(connectionString, {});

export const db2 = dbClient2.db("sample_mflix");
