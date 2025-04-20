# 📘 API Contracts

## 🌐 API Thiết Kế Theo Flow

### 1. 🔐 Auth APIs (MongoDB + Redis)

| Method | Endpoint             | Mô tả                                       |
|--------|----------------------|---------------------------------------------|
| POST   | `/api/auth/register` | Đăng ký người dùng mới                      |
| POST   | `/api/auth/login`    | Đăng nhập, trả về token + lưu session Redis |
| GET    | `/api/auth/me`       | Trả về thông tin người dùng qua token       |

---

### 2. 🛍️ Product APIs (MongoDB)

| Method | Endpoint               | Mô tả                         |
|--------|------------------------|-------------------------------|
| GET    | `/api/products`        | Lấy danh sách sản phẩm        |
| GET    | `/api/products/:id`    | Lấy chi tiết 1 sản phẩm       |

---

### 3. 🛒 Cart APIs (Redis)

| Method | Endpoint                  | Mô tả                             |
|--------|---------------------------|-----------------------------------|
| POST   | `/api/cart/add`           | Thêm sản phẩm vào giỏ hàng        |
| GET    | `/api/cart/`              | Xem giỏ hàng hiện tại             |
| DELETE | `/api/cart/remove/:id`    | Xóa sản phẩm khỏi giỏ hàng        |

---

### 4. 📦 Order APIs (Cassandra)

| Method | Endpoint               | Mô tả                                         |
|--------|------------------------|-----------------------------------------------|
| POST   | `/api/order/checkout`  | Tạo đơn hàng từ giỏ hàng (ghi vào Cassandra)  |
| GET    | `/api/order/history`   | Lấy lịch sử đơn hàng theo user                |

---

### 5. ⭐ Review APIs (Neo4j)

| Method | Endpoint                     | Mô tả                                                             |
|--------|------------------------------|-------------------------------------------------------------------|
| POST   | `/api/review/:productId`     | Tạo đánh giá cho sản phẩm                                         |
| GET    | `/api/review/:productId`     | Lấy các đánh giá của sản phẩm                                     |
| GET    | `/api/behavior/:userId`      | Phân tích hành vi người dùng (sản phẩm đã đánh giá/mua...)        |

## 1. Quản Lý Người Dùng (User Management)

### POST /api/auth/register
- **Mô tả**: Đăng ký người dùng mới.
- **Request body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "Nguyễn Văn A",
    "phoneNumber": "0901234567"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "User registered successfully"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "error": "Email already exists"
    }
    ```

### POST /api/auth/login
- **Mô tả**: Đăng nhập người dùng.
- **Request body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "token": "jwt_token_here"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "error": "Invalid email or password"
    }
    ```

### GET /api/auth/me
- **Mô tả**: Lấy thông tin người dùng dựa trên token.
- **Request headers**:
  - **Authorization**: `Bearer <jwt_token>`
- **Response**:
  - **200 OK**:
    ```json
    {
      "userId": "user_id_here",
      "email": "user@example.com",
      "name": "Nguyễn Văn A",
      "phoneNumber": "0901234567",
      "accountStatus": "active",
      "registrationDate": "2023-01-01T12:00:00Z"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "error": "Unauthorized"
    }
    ```

---

## 2. Sản Phẩm (Product Management)

### GET /api/products
- **Mô tả**: Lấy danh sách sản phẩm.
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "_id": "product_id",
        "name": "Áo sơ mi nam",
        "price": 200000,
        "category": "Thời trang",
        "stockQuantity": 50,
        "image": "base64",
        "status": "available"
      }
    ]
    ```

### GET /api/products/:id
- **Mô tả**: Lấy chi tiết một sản phẩm.
- **Response**:
  - **200 OK**:
    ```json
    {
      "productId": "product_id",
      "name": "Áo sơ mi nam",
      "description": "Chất liệu cotton thoáng mát",
      "image": "base64",
      "price": 200000,
      "discountPrice": 180000,
      "category": "Thời trang",
      "variants": [
        { "color": "đỏ", "size": "M" },
        { "color": "xanh", "size": "L" }
      ],
      "stockQuantity": 50,
      "status": "available"
    }
    ```

---

## 3. Giỏ Hàng (Cart Management)

### POST /api/cart/add
- **Mô tả**: Thêm sản phẩm vào giỏ hàng.
- **Request body**:
  ```json
  { 
    "productId": "product_id_here",
    "quantity": 2,
    "variant": {
      "color": "đỏ",
      "size": "M"
    }
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Product added to cart successfully"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "error": "Invalid product or variant"
    }
    ```

### GET /api/cart
- **Mô tả**: Lấy thông tin giỏ hàng của người dùng.
- **Response**:
  - **200 OK**:
    ```json
    {
      "items": [
        {
          "productId": "product_id_here",
          "quantity": 2,
          "variant": {
            "color": "đỏ",
            "size": "M"
          },
          "price": 200000
        }
      ],
      "total": 400000
    }
    ```

### DELETE /api/cart/remove/:id
- **Mô tả**: Xóa sản phẩm khỏi giỏ hàng.
- **Params**: id: ID sản phẩm cần xóa.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Product removed from cart"
    }
    ```

---

## 4. Đặt Hàng (Order Management)

### POST /api/order/checkout
- **Mô tả**: Tạo đơn hàng từ giỏ hàng.
- **Request body**:
  ```json
  {
    "address": "123 Đường ABC, TP.HCM",
    "paymentMethod": "COD"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "orderId": "order_id_here",
      "status": "pending"
    }
    ```

### GET /api/order/history
- **Mô tả**: Lấy lịch sử đơn hàng của người dùng.
- **Headers**: Authorization: Bearer <jwt_token>
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "orderId": "order_id",
        "status": "completed",
        "items": [
          {
            "productId": "product_id",
            "quantity": 2,
            "price": 200000
          }
        ],
        "orderDate": "2025-04-01T10:00:00Z"
      }
    ]
    ```

---

## 5. Đánh Giá Sản Phẩm (Product Reviews)

### POST /api/review/:productId
- **Mô tả**: Tạo đánh giá cho sản phẩm.
- **Params**: productID: ID sản phẩm.
- **Request body**:
  ```json
  {
    "rating": 4,
    "comment": "Sản phẩm rất tốt, chất liệu mềm mại"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Review added successfully"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "error": "Invalid rating or comment"
    }
    ```

### GET /api/review/:productId
- **Mô tả**: Lấy tất cả đánh giá của một sản phẩm.
- **Params**: productID: ID sản phẩm.
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "userId": "user_id_here",
        "rating": 5,
        "comment": "Sản phẩm tuyệt vời!"
      },
      {
        "userId": "user_id_2",
        "rating": 4,
        "comment": "Chất lượng ổn"
      }
    ]
    ```

### GET /api/behavior/:userId
- **Mô tả**: Phân tích hành vi người dùng (sản phẩm đã đánh giá/mua...).
- **Params**: userId: ID người dùng.
- **Response**:
  - **200 OK**:
    ```json
    {
      "userId": "user_id_here",
      "purchasedProducts": [
        {
          "productId": "product_id_here",
          "name": "Áo sơ mi nam",
          "rating": 4
        }
      ]
    }
    ```
