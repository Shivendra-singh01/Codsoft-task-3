const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");

const User = require("./models/User");
const Contact = require("./models/Contact");

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");


// =============================
// DATABASE RELATIONSHIPS
// =============================

User.hasMany(Contact, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

Contact.belongsTo(User, {
    foreignKey: "userId"
});


// =============================
// EXPRESS APP
// =============================

const app = express();

app.use(cors());
app.use(express.json());


// =============================
// ROUTES
// =============================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Contact Management System API is running"
    });
});

app.use("/auth", authRoutes);
app.use("/contacts", contactRoutes);


// =============================
// ERROR HANDLING
// =============================

app.use(errorMiddleware);


// =============================
// DATABASE + SERVER
// =============================

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
        console.log("MySQL database connected");
        return sequelize.sync();
    })
    .then(() => {
        console.log("Database tables synchronized");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database error:", error);
    });