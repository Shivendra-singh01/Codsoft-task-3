Contact Management System — API Documentation

Base URL:

http://localhost:3000

Authentication

Protected endpoints require a JWT token in the request header:

Authorization: Bearer <JWT_TOKEN>

1. Health Check

GET /

Checks whether the API server is running.

Request

GET /

Response

{
  "success": true,
  "message": "Contact Management System API is running"
}

2. Authentication APIs

POST /auth/register

Registers a new user.

Authentication

Not required.

Request

POST /auth/register
Content-Type: application/json

Body

{
  "name": "Shivendra",
  "email": "shivendra@gmail.com",
  "password": "mypassword123"
}

Success Response — 201

{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Shivendra",
    "email": "shivendra@gmail.com"
  }
}

Possible Errors

400 - Name, email and password are required
409 - Email already registered
500 - Internal server error

POST /auth/login

Authenticates an existing user and returns a JWT token.

Authentication

Not required.

Request

POST /auth/login
Content-Type: application/json

Body

{
  "email": "shivendra@gmail.com",
  "password": "mypassword123"
}

Success Response — 200

{
  "success": true,
  "message": "Login successful",
  "token": "<JWT_TOKEN>"
}

Possible Errors

400 - Email and password are required
401 - Invalid email or password
500 - Internal server error

3. Contact APIs

All contact endpoints require JWT authentication.

POST /contacts

Creates a new contact for the authenticated user.

Authentication

Required.

Request

POST /contacts
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Body

{
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "phone": "9876543210",
  "address": "Lucknow, Uttar Pradesh",
  "company": "ABC Technologies"
}

Success Response — 201

{
  "success": true,
  "message": "Contact created successfully",
  "contact": {
    "id": 1,
    "userId": 1,
    "name": "Rahul Sharma",
    "email": "rahul@gmail.com",
    "phone": "9876543210",
    "address": "Lucknow, Uttar Pradesh",
    "company": "ABC Technologies"
  }
}

Possible Errors

400 - Name and phone are required
401 - Invalid or expired token
409 - Contact with this email or phone already exists
500 - Internal server error

GET /contacts

Returns contacts belonging to the authenticated user.

Authentication

Required.

Request

GET /contacts
Authorization: Bearer <JWT_TOKEN>

Success Response — 200

{
  "success": true,
  "totalContacts": 2,
  "currentPage": 1,
  "totalPages": 1,
  "contacts": [
    {
      "id": 1,
      "userId": 1,
      "name": "Rahul Sharma",
      "email": "rahul@gmail.com",
      "phone": "9876543210",
      "address": "Lucknow, Uttar Pradesh",
      "company": "ABC Technologies"
    }
  ]
}

4. Search Contacts

Searches contacts by name, email, or phone.

Request

GET /contacts?search=rahul
Authorization: Bearer <JWT_TOKEN>

Example

GET /contacts?search=gmail

The search is applied to:

name
email
phone

5. Pagination

Pagination is supported through query parameters.

Request

GET /contacts?page=1&limit=10
Authorization: Bearer <JWT_TOKEN>

Parameters

Parameter

Description

Default

page

Page number

1

limit

Number of contacts per page

10

Maximum limit is 100.

6. Sorting

Contacts can be sorted using:

GET /contacts?sortBy=name&order=ASC
Authorization: Bearer <JWT_TOKEN>

Supported sort fields

name
email
phone
company
createdAt

Supported order

ASC
DESC

Example

GET /contacts?sortBy=company&order=DESC

7. Search + Pagination + Sorting

All supported query options can be combined.

Request

GET /contacts?search=rahul&page=1&limit=5&sortBy=name&order=ASC
Authorization: Bearer <JWT_TOKEN>

8. Get Contact by ID

Returns a specific contact belonging to the authenticated user.

Request

GET /contacts/1
Authorization: Bearer <JWT_TOKEN>

Success Response — 200

{
  "success": true,
  "contact": {
    "id": 1,
    "userId": 1,
    "name": "Rahul Sharma",
    "email": "rahul@gmail.com",
    "phone": "9876543210",
    "address": "Lucknow, Uttar Pradesh",
    "company": "ABC Technologies"
  }
}

Possible Errors

401 - Invalid or expired token
404 - Contact not found
500 - Internal server error

9. Update Contact

Updates an existing contact belonging to the authenticated user.

Request

PUT /contacts/1
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Body

{
  "name": "Rahul Sharma Updated",
  "phone": "9876501234",
  "company": "XYZ Technologies"
}

Success Response — 200

{
  "success": true,
  "message": "Contact updated successfully",
  "contact": {
    "id": 1,
    "userId": 1,
    "name": "Rahul Sharma Updated",
    "email": "rahul@gmail.com",
    "phone": "9876501234",
    "address": "Lucknow, Uttar Pradesh",
    "company": "XYZ Technologies"
  }
}

Possible Errors

401 - Invalid or expired token
404 - Contact not found
409 - Another contact already uses this email or phone
500 - Internal server error

10. Delete Contact

Deletes a contact belonging to the authenticated user.

Request

DELETE /contacts/1
Authorization: Bearer <JWT_TOKEN>

Success Response — 200

{
  "success": true,
  "message": "Contact deleted successfully"
}

Possible Errors

401 - Invalid or expired token
404 - Contact not found
500 - Internal server error

Complete Endpoint Summary

Method

Endpoint

Authentication

Purpose

GET

/

No

Health check

POST

/auth/register

No

Register user

POST

/auth/login

No

Login user

POST

/contacts

JWT

Create contact

GET

/contacts

JWT

Get contacts

GET

/contacts/:id

JWT

Get contact

PUT

/contacts/:id

JWT

Update contact

DELETE

/contacts/:id

JWT

Delete contact

Contact Query Parameters

search
page
limit
sortBy
order

Example:

GET /contacts?search=rahul&page=1&limit=5&sortBy=name&order=ASC

HTTP Status Codes

200 - Successful request
201 - Resource created
400 - Bad request
401 - Unauthorized
404 - Resource not found
409 - Conflict
500 - Internal server error

Database Relationship

User
  │
  ├── Contact
  ├── Contact
  └── Contact

Each contact contains a userId that associates it with its owner.

Security

Passwords are hashed using bcryptjs.

JWT is used for authentication.

Contact routes are protected by authentication middleware.

Users can only access their own contacts.

Database credentials and JWT secrets are stored in .env.