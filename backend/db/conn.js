import mongoose from "mongoose";
import { DB_NAME } from "../constants/constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`,
        );
        console.log(
            `MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`,
        );
    } catch (error) {
        console.log("MONGODB connection error ", error);
        // res.status(500).json({ status: false, error: "Internal Server Error" });
    }
};

export default connectDB;
