// products.js

const express = require('express');
const app = express();
const PORT = 4000;

// ---------------------
// Middleware
// ---------------------

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// JSON and form data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication middleware
const API_KEY = "12345"; // Example key
function authenticate(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== API_KEY) {
    return res.status(401).json({ message: "Unauthorized: Invalid API key" });
  }
  next();
}

// Validation middleware for products
function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || price === undefined || !category || inStock === undefined) {
    return next(new ValidationError("All fields are required"));
  }
  if (typeof price !== 'number') {
    return next(new ValidationError("Price must be a number"));
  }
  next();
}

// Async error wrapper
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ---------------------
// Custom Error Classes
// ---------------------

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

// ---------------------
// In-memory products data
// ---------------------

let products = [
  { id: 1, name: "Laptop", description: "Powerful laptop", price: 45000, category: "Electronics", inStock: true },
  { id: 2, name: "Shoes", description: "Running shoes", price: 4500, category: "Fashion", inStock: false },
  { id: 3, name: "Smartphone", description: "Android phone", price: 30000, category: "Electronics", inStock: true },
  { id: 4, name: "T-Shirt", description: "Cotton T-shirt", price: 1200, category: "Fashion", inStock: true }
];

// ---------------------
// RESTful API Routes
// ---------------------

// GET all products with filtering, search, pagination
app.get('/api/products', (req, res) => {
  let result = [...products];

  // Filter by category
  if (req.query.category) {
    result = result.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
  }

  // Search by name
  if (req.query.search) {
    result = result.filter(p => p.name.toLowerCase().includes(req.query.search.toLowerCase()));
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedResult = result.slice(startIndex, endIndex);

  res.json({
    total: result.length,
    page,
    limit,
    products: paginatedResult
  });
});

// GET product by ID
app.get('/api/products/:id', asyncHandler(async (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) throw new NotFoundError("Product not found");
  res.json(product);
}));

// POST create new product (protected & validated)
app.post('/api/products', authenticate, validateProduct, asyncHandler(async (req, res) => {
  const newProduct = { id: products.length + 1, ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
}));

// PUT update product (protected & validated)
app.put('/api/products/:id', authenticate, validateProduct, asyncHandler(async (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) throw new NotFoundError("Product not found");

  Object.assign(product, req.body);
  res.json(product);
}));

// DELETE product (protected)
app.delete('/api/products/:id', authenticate, asyncHandler(async (req, res) => {
  const index = products.findIndex(p => p.id == req.params.id);
  if (index === -1) throw new NotFoundError("Product not found");

  products.splice(index, 1);
  res.json({ message: "Product deleted successfully" });
}));

// ---------------------
// Product Statistics
// ---------------------

app.get('/api/products/stats', (req, res) => {
  const stats = products.reduce((acc, p) => {
    acc.totalProducts = (acc.totalProducts || 0) + 1;
    acc.categories[p.category] = (acc.categories[p.category] || 0) + 1;
    acc.inStock = (acc.inStock || 0) + (p.inStock ? 1 : 0);
    return acc;
  }, { categories: {} });

  res.json(stats);
});

// ---------------------
// HTML page with products table and add-product form
// ---------------------

app.get('/products', (req, res) => {
  let html = `
    <html>
      <head>
        <title>Products List</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 80%; border-collapse: collapse; margin: auto; margin-bottom: 30px; }
          th, td { border: 1px solid #ccc; padding: 10px; text-align: center; }
          th { background: #f4f4f4; }
          h1, h2 { text-align: center; }
          form { width: 50%; margin: auto; display: flex; flex-direction: column; gap: 10px; }
          input, select { padding: 8px; font-size: 1rem; }
          button { padding: 10px; font-size: 1rem; cursor: pointer; }
        </style>
      </head>
      <body>
        <h1>Available Products</h1>
        <table id="products-table">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price (Ksh)</th>
            <th>Category</th>
            <th>In Stock</th>
          </tr>
          ${products.map(p => `
            <tr>
              <td>${p.id}</td>
              <td>${p.name}</td>
              <td>${p.description}</td>
              <td>${p.price.toLocaleString()}</td>
              <td>${p.category}</td>
              <td>${p.inStock ? "✅ Yes" : "❌ No"}</td>
            </tr>
          `).join('')}
        </table>

        <h2>Add New Product</h2>
        <form id="add-product-form">
          <input type="text" name="name" placeholder="Name" required />
          <input type="text" name="description" placeholder="Description" required />
          <input type="number" name="price" placeholder="Price" required />
          <input type="text" name="category" placeholder="Category" required />
          <select name="inStock" required>
            <option value="">In Stock?</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <button type="submit">Add Product</button>
        </form>

        <script>
          const form = document.getElementById('add-product-form');
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = {
              name: formData.get('name'),
              description: formData.get('description'),
              price: parseFloat(formData.get('price')),
              category: formData.get('category'),
              inStock: formData.get('inStock') === 'true'
            };

            try {
              const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-api-key': '12345'
                },
                body: JSON.stringify(data)
              });

              if (!response.ok) throw new Error('Failed to add product');

              const newProduct = await response.json();
              const table = document.getElementById('products-table');
              const row = table.insertRow(-1);
              row.innerHTML = \`
                <td>\${newProduct.id}</td>
                <td>\${newProduct.name}</td>
                <td>\${newProduct.description}</td>
                <td>\${newProduct.price.toLocaleString()}</td>
                <td>\${newProduct.category}</td>
                <td>\${newProduct.inStock ? "✅ Yes" : "❌ No"}</td>
              \`;
              form.reset();
            } catch (err) {
              alert(err.message);
            }
          });
        </script>
      </body>
    </html>
  `;
  res.send(html);
});

// ---------------------
// Global Error Handler
// ---------------------

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.name || "InternalServerError",
    message: err.message || "Something went wrong"
  });
});

// ---------------------
// Start Server
// ---------------------

app.listen(PORT, () => {
  console.log(`🚀 Products API running at http://localhost:${PORT}`);
});
