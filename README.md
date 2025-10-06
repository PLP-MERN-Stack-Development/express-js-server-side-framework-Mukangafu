Week 2 Express.js Assignment
Overview

This project demonstrates a fully functional Express.js API with two main tasks:

Task 1: Hello World Server – A basic Express server that responds with a message at localhost:3000.

Task 2: Products API – A RESTful API with CRUD operations for products, including middleware for logging, authentication, validation, and an HTML page to view and add products directly.

Advanced features include filtering, searching, pagination, and product statistics.

Features
Task 1 – Hello World

Runs on Port 3000.

Logs every request using custom middleware.

Simple "Hello World" response.

Task 2 – Products API

Runs on Port 4000.

RESTful routes:

GET /api/products – List all products with optional filtering, search, and pagination.

GET /api/products/:id – Retrieve a specific product by ID.

POST /api/products – Add a new product (requires API key).

PUT /api/products/:id – Update a product (requires API key).

DELETE /api/products/:id – Delete a product (requires API key).

GET /api/products/stats – Get statistics like total products, in-stock count, and count by category.

Middleware:

Logging middleware logs method, URL, and timestamp.

Authentication middleware using API key 12345.

Validation middleware for product creation and updates.

Global error handler with proper HTTP status codes.

HTML interface:

View products in a table at /products.

Add products directly via an HTML form.

Installation

Clone the repository:

git clone <YOUR_GITHUB_REPO_URL>
cd express-js-server-side-framework-Mukangafu


Install dependencies:

npm install


Create a .env file based on .env.example:

PORT_TASK1=3000
PORT_TASK2=4000
API_KEY=12345

Running the Project
Task 1 – Hello World
npm run task1


Open in browser:

http://localhost:3000

Task 2 – Products API
npm start


Open in browser:

http://localhost:4000/products


You can also test API endpoints via Postman, Insomnia, or curl.

API Endpoints
Method	Endpoint	Description	Requires API Key
GET	/api/products	List all products (supports filter/search/pagination)	No
GET	/api/products/:id	Get a product by ID	No
POST	/api/products	Add a new product	Yes
PUT	/api/products/:id	Update a product	Yes
DELETE	/api/products/:id	Delete a product	Yes
GET	/api/products/stats	Get product statistics	No
Example: Add Product (POST /api/products)

Headers:

Content-Type: application/json
x-api-key: 12345


Body:

{
  "name": "Tablet",
  "description": "Android tablet",
  "price": 15000,
  "category": "Electronics",
  "inStock": true
}

HTML Form

Open in browser: http://localhost:4000/products

View products in a table and add new products directly.

Environment Variables (.env)
PORT_TASK1=3000       # Port for Task 1
PORT_TASK2=4000       # Port for Task 2
API_KEY=12345         # API key for protected routes

Notes

Products data is stored in-memory (reset on server restart).

Error handling is implemented with custom error classes for validation and not found errors.

Middleware handles logging, authentication, and validation.

Advanced features include filtering by category, search by name, pagination, and product statistics.

License

ISC
Author: Daniel Muturi