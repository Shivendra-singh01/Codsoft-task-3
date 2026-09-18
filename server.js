const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const sequelize = require("./config/database");
const User = require("./models/User");
const Contact = require("./models/Contact");

// relationship description
User.hasMany(Contact, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

Contact.belongsTo(User, {
    foreignKey: "userId"
});

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth",authRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Contact Management System API is running"
    });
});

sequelize.authenticate()
    .then(() => {
        console.log("MySQL database connected");
        return sequelize.sync();
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