import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

// Load env
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

// Start Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});