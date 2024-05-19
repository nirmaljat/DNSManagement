import mongoose from "mongoose";

export const connectDB = () => {
    mongoose
      .connect(process.env.MONGO_URI, {
        dbName: "DNS",
      })
      .then((c) => console.log(`Database Connected  `))
      .catch((e) => console.error("Connection error:", e));
  };