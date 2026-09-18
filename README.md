# Contact Management System

A secure backend REST API for managing personal and professional contacts.

The application allows authenticated users to create, view, update, delete, search, sort, and paginate their contacts while keeping each user's data isolated.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected contact APIs
- User-specific contact management
- Create, read, update, and delete contacts
- Search contacts by name, email, or phone
- Pagination
- Sorting
- Duplicate contact prevention
- Input validation
- Centralized error handling
- MySQL database integration using Sequelize ORM
- Environment variable configuration

## Tech Stack

- Node.js
- Express.js
- MySQL
- Sequelize
- JWT
- bcryptjs
- Postman

## Project Structure

```text
contact-management-system/
│
├── config/
│   └── database.js
│
├── controllers/
│   ├── authController.js
│   └── contactController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
│
├── models/
│   ├── User.js
│   └── Contact.js
│
├── routes/
│   ├── authRoutes.js
│   └── contactRoutes.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md