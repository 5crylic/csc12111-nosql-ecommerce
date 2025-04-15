# 🛒 CSC12111 NoSQL E-Commerce Demo

This is a demo project built for the **CSC12111 - Modern Database Management** course.  
The system showcases a hybrid database architecture combining **MongoDB**, **Redis**, **Cassandra**, and **Neo4j** to demonstrate how different NoSQL models can optimize for specific use cases in a modern e-commerce system.

## 🧠 Tech Highlights

- **MongoDB** – used for flexible document storage (users, reviews, archived orders)
- **Redis** – used for in-memory cart management and session handling
- **Cassandra** – used for write-heavy operations like order history logs and analytics
- **Neo4j** – used to manage graph relationships like recommendations and user-product interactions
- **Node.js + Express** – for building RESTful API
- **Docker Compose** – for easy setup of all services

---

## 🔧 Core Features

- 👤 User & Review Management (MongoDB)
- 🛒 Temporary Shopping Cart (Redis)
- 🧾 Order History & Logs (Cassandra)
- 🔗 Recommendation & Relations (Neo4j)

---

## 🚀 Quick Start (Backend Only)

```bash
# Clone the repository
git clone https://github.com/5crylic/csc12111-nosql-ecommerce.git

# Navigate to the backend folder
cd csc12111-nosql-ecommerce/ecommerce-backend

# Install backend dependencies
npm install

# Start all databases via Docker
docker-compose up -d

# Run the server
node server.js

> 🐳 **Make sure Docker is running before starting the databases**
