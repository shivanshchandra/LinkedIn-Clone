import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js";  
import userRoutes from "./routes/user.routes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
app.use(express.static('uploads'));



const start = async () => {

    const connectDB = await mongoose.connect("mongodb+srv://shivanshchandra96:yOm8XU54OxyJxZxq@linkedin.f77cjh0.mongodb.net/?retryWrites=true&w=majority&appName=linkedIn")

    app.listen(9080, () => {
        console.log("Server is running on port 9080");
    })
}

start();


// mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log("Connected to MongoDB");
// }).catch((err) => {
//     console.error("MongoDB connection error:", err);
// });