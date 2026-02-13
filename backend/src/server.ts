import express from "express";
import cors from "cors";
import { loadEnv } from "./env";
import { askStructured } from "./ask-core";

loadEnv();
const app = express();

app.use(cors(
    {
        origin: "http://localhost:3000",
        methods: ["POST", "GET", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: false,
    }
));
app.use(express.json());

app.post("/ask", async (req, res) => {
    try {
        const { query } = req.body ?? {};
        if (!query || typeof query !== "string" || query.trim().length === 0) {
            return res.status(400).json({ error: "Query is required" });
        }
        const result = await askStructured(query);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in /ask endpoint:", error);
        return res.status(500).json({ error: "Failed to process request" });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});