const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://admin:surya777@hospital-db.4l9mmm2.mongodb.net/?retryWrites=true&w=majority&appName=hospital-db";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB connection successful!");
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.close();
  }
}

run();
