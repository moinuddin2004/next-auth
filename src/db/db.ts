import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL!+"auth");
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Mongo DB Connection Successfull");
    });
    connection.on("error", (error) => {
      console.log("Mongo DB Connection Failed ", error);
      process.exit(1);
    });
  } catch (error) {
    console.log("Something went wrong in connecting DB ", error);
  }
};
