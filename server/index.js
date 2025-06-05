const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const eventRoutes = require("./routes/routes_event");
const subscribeRoutes = require("./routes/subscribe");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true })); 
app.use(express.json());

// Routes
app.use("/getAllEvents", eventRoutes);      
app.use("/subscribeUser", subscribeRoutes); 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => {
  console.error("MongoDB connection failed:", err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// to run - npx nodemon index.js 