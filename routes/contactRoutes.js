const express = require("express");

const {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact
} = require("../controllers/contactController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createContact);
router.get("/", getContacts);
router.get("/:id", getContactById);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

module.exports = router;