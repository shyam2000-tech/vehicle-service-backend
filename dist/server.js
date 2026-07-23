import app from "./app.js";
import { pool } from "./config/database.js";
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        // Check Database Connection
        const client = await pool.connect();
        console.log("✅ DataBase connected successfully!");
        client.release();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
