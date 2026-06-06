import mongoose from "mongoose";

const pool = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);

        console.log("MongoDB Connected");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export default pool;