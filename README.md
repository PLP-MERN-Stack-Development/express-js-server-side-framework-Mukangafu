# Week 2 Express.js Assignment

## Author
**Daniel Muturi**

---

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Frontend Access](#frontend-access)
- [Features](#features)
- [Testing](#testing)
- [License](#license)

---

## Project Overview

This project is a demonstration of an Express.js API implementing RESTful routes, middleware, validation, authentication, error handling, and advanced features such as filtering, search, and pagination.  

The assignment includes:  

1. **Task 1 - Hello World API** (`index.js`)
2. **Task 2 - Products API** (`products.js`)  
   - CRUD operations on products  
   - Authentication using API key  
   - Validation middleware  
   - Logging middleware  
   - Global error handling  
   - HTML frontend for viewing and adding products  

---

## Technologies Used
- Node.js (v18 or higher recommended)
- Express.js (v5.x)
- Body-parser
- UUID
- Nodemon (for development)
- Git & GitHub

---

## Setup Instructions

1. Clone your repository:
   ```bash
   git clone https://github.com/PLP-MERN-Stack-Development/express-js-server-side-framework-Mukangafu.git
   cd express-js-server-side-framework-Mukangafu

2. Install dependencies:

npm install


3. Start the APIs:

Task 1 (Hello World):

npm run task1


Runs on port 3000 (default in index.js)

Test in browser: http://localhost:3000

Task 2 (Products API):

npm start


Runs on port 4000 (default in products.js)

Test in browser: http://localhost:4000/products

Environment Variables

Create a .env file based on .env.example:

PORT_INDEX=3000
PORT_PRODUCTS=4000
API_KEY=12345

API Endpoints
Products API (products.js)

All routes (except the HTML view) require JSON request bodies for POST/PUT, and some require API key in headers.

Public Routes

GET /api/products – List all products with optional filtering, search, and pagination:

Query Parameters:
  category: string (optional)
  search: string (optional)
  page: number (optional)
  limit: number (optional)


GET /api/products/:id – Get a product by ID

Protected Routes (require header x-api-key: 12345)

POST /api/products – Add a new product

PUT /api/products/:id – Update an existing product

DELETE /api/products/:id – Delete a product

Extra Routes

GET /api/products/stats – Get statistics about products by category and stock

GET /products – HTML frontend to view products and add new products directly

Frontend Access

Open in your browser:
http://localhost:4000/products

View all products in a table

Add new products via the form (requires API key 12345 internally)

Features

Middleware

Logging requests with method, URL, and timestamp

Authentication using API key

Validation for product creation and update

JSON body parsing

Error Handling

Custom error classes (NotFoundError, ValidationError)

Global error handler with proper HTTP status codes

Advanced Features

Filtering products by category

Pagination support

Search products by name

Product statistics by category and stock availability

Frontend

Simple HTML table for displaying products

Form to add products without using Postman

Testing

You can test the API using:

Browser (for /products HTML view)

Postman / Insomnia / cURL for API endpoints

Example with Postman:

GET all products: GET http://localhost:4000/api/products

Add product: POST http://localhost:4000/api/products
Headers: x-api-key: 12345
Body (JSON):

{
  "name": "Tablet",
  "description": "Android tablet",
  "price": 15000,
  "category": "Electronics",
  "inStock": true
}

License

This project is licensed under ISC.