const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Contact Management System API is running"
    });
});

sequelize.authenticate()
    .then(() => {
        console.log("MySQL database connected");
    })
    .then(() => {
        console.log("Database tables synchronized");
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});