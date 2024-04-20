import "dotenv/config";
import express from "express";
import connectDB from "./db/conn.js";
import cors from "cors";

connectDB();
const app = express();
app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//importing routes---------------------------
import { homeController } from "./controllers/home.controller.js";
import api from "./routes/api.routes.js";

//routes--------------------------------------
app.use("/api", api);

//home route----------------------------------
app.get("/", homeController);

//wildcard route ----------------------------------------------
app.get("*", (req, res) => {
    try {
        const obj = {
            status: false,
            error: "route doesn't exists",
        };
        res.status(404).json(obj);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, error: "Internal Server Error" });
    }
});

//listening on port 3000 --------------------------------------
const port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("app listening on port : " + port);
});

export default app;
