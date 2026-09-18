const { Op } = require("sequelize");
const Contact = require("../models/Contact");


// CREATE CONTACT
const createContact = async (req, res, next) => {
    try {
        const {
            name,
            email,
            phone,
            address,
            company
        } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: "Name and phone are required"
            });
        }

        // Prevent duplicate email or phone for same user
        const existingContact = await Contact.findOne({
            where: {
                userId: req.user.id,
                [Op.or]: [
                    ...(email ? [{ email }] : []),
                    { phone }
                ]
            }
        });

        if (existingContact) {
            return res.status(409).json({
                success: false,
                message: "Contact with this email or phone already exists"
            });
        }

        const contact = await Contact.create({
            userId: req.user.id,
            name,
            email,
            phone,
            address,
            company
        });

        res.status(201).json({
            success: true,
            message: "Contact created successfully",
            contact
        });

    } catch (error) {
        next(error);
    }
};


// GET ALL CONTACTS
const getContacts = async (req, res, next) => {
    try {
        const {
            search,
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            order = "DESC"
        } = req.query;

        const pageNumber = Math.max(parseInt(page) || 1, 1);
        const limitNumber = Math.min(
            Math.max(parseInt(limit) || 10, 1),
            100
        );

        const offset = (pageNumber - 1) * limitNumber;

        const allowedSortFields = [
            "name",
            "email",
            "phone",
            "company",
            "createdAt"
        ];

        const safeSortBy = allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";

        const safeOrder =
            order.toUpperCase() === "ASC"
                ? "ASC"
                : "DESC";

        const where = {
            userId: req.user.id
        };

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Contact.findAndCountAll({
            where,
            limit: limitNumber,
            offset,
            order: [[safeSortBy, safeOrder]]
        });

        res.status(200).json({
            success: true,
            totalContacts: count,
            currentPage: pageNumber,
            totalPages: Math.ceil(count / limitNumber),
            contacts: rows
        });

    } catch (error) {
        next(error);
    }
};


// GET CONTACT BY ID
const getContactById = async (req, res, next) => {
    try {
        const contact = await Contact.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        res.status(200).json({
            success: true,
            contact
        });

    } catch (error) {
        next(error);
    }
};


// UPDATE CONTACT
const updateContact = async (req, res, next) => {
    try {
        const contact = await Contact.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        const {
            name,
            email,
            phone,
            address,
            company
        } = req.body;

        if (email || phone) {
            const duplicate = await Contact.findOne({
                where: {
                    userId: req.user.id,
                    id: { [Op.ne]: contact.id },
                    [Op.or]: [
                        ...(email ? [{ email }] : []),
                        ...(phone ? [{ phone }] : [])
                    ]
                }
            });

            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message: "Another contact already uses this email or phone"
                });
            }
        }

        await contact.update({
            name: name ?? contact.name,
            email: email ?? contact.email,
            phone: phone ?? contact.phone,
            address: address ?? contact.address,
            company: company ?? contact.company
        });

        res.status(200).json({
            success: true,
            message: "Contact updated successfully",
            contact
        });

    } catch (error) {
        next(error);
    }
};


// DELETE CONTACT
const deleteContact = async (req, res, next) => {
    try {
        const contact = await Contact.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        await contact.destroy();

        res.status(200).json({
            success: true,
            message: "Contact deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact
};