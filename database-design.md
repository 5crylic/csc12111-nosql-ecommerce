# Database Design

## 1. MongoDB

### **users**
- **Mô tả**: Lưu thông tin người dùng trong hệ thống.
- **Trường**:
  - `_id` (ObjectId): ID người dùng.
  - `email` (String): Địa chỉ email người dùng (unique).
  - `passwordHash` (String): Mã hóa mật khẩu người dùng.
  - `name` (String): Tên người dùng.
  - `phoneNumber` (String): Số điện thoại người dùng.
  - `accountStatus` (String): Trạng thái tài khoản (active/inactive).
  - `registrationDate` (ISODate): Ngày đăng ký tài khoản.
  - `linkedAccounts` (Object): Các tài khoản liên kết (Facebook, Google, v.v.).

### **products**
- **Mô tả**: Lưu thông tin về các sản phẩm trong cửa hàng.
- **Trường**:
  - `_id` (ObjectId): ID sản phẩm.
  - `name` (String): Tên sản phẩm.
  - `description` (String): Mô tả sản phẩm.
  - `images` (Array[String]): Danh sách các hình ảnh sản phẩm.
  - `price` (Number): Giá sản phẩm.
  - `discountPrice` (Number): Giá khuyến mãi (nếu có).
  - `category` (String): Danh mục sản phẩm (e.g., thời trang, điện tử).
  - `variants` (Array[Object]): Các biến thể của sản phẩm (màu sắc, kích thước, v.v.).
  - `stockQuantity` (Number): Số lượng còn lại trong kho.
  - `status` (String): Trạng thái sản phẩm (available, out of stock).

### **carts**
- **Mô tả**: Lưu thông tin giỏ hàng của người dùng.
- **Trường**:
  - `userId` (ObjectId): ID người dùng.
  - `items` (Array[Object]): Danh sách các sản phẩm trong giỏ hàng, mỗi sản phẩm bao gồm:
    - `productId` (ObjectId): ID sản phẩm.
    - `quantity` (Number): Số lượng sản phẩm.
    - `variant` (String): Biến thể sản phẩm (màu sắc, kích thước).
  - `updatedAt` (ISODate): Thời gian cập nhật giỏ hàng gần nhất.

---

## 2. Redis

### **session:<session_id>**
- **Mô tả**: Lưu trữ thông tin phiên làm việc của người dùng.
- **Trường**:
  - `user_id` (String): ID người dùng, dùng để xác thực các yêu cầu từ người dùng.

### **cart:<user_id>**
- **Mô tả**: Lưu trữ giỏ hàng tạm thời của người dùng trong Redis.
- **Trường**:
  - `product_id` (ObjectId): ID sản phẩm trong giỏ.
  - `quantity` (Number): Số lượng của sản phẩm.
  - `variant` (String): Biến thể của sản phẩm (màu sắc, kích thước).

---

## 3. Cassandra

### **orders**
- **Mô tả**: Lưu trữ thông tin đơn hàng của người dùng.
- **Trường**:
  - `orderId` (UUID): ID đơn hàng.
  - `userId` (ObjectId): ID người dùng đã tạo đơn hàng.
  - `items` (List[Object]): Danh sách các sản phẩm trong đơn hàng, mỗi sản phẩm bao gồm:
    - `productId` (ObjectId): ID sản phẩm.
    - `quantity` (Number): Số lượng sản phẩm.
    - `price` (Number): Giá sản phẩm.
  - `status` (String): Trạng thái đơn hàng (pending, completed, canceled).

---

## 4. Neo4j

### **User**
- **Mô tả**: Lưu trữ thông tin người dùng trong hệ thống.
- **Trường**:
  - `userId` (ObjectId): ID người dùng.

### **Product**
- **Mô tả**: Lưu trữ thông tin về các sản phẩm.
- **Trường**:
  - `productId` (ObjectId): ID sản phẩm.

### **Review**
- **Mô tả**: Lưu trữ các đánh giá sản phẩm của người dùng.
- **Trường**:
  - `userId` (ObjectId): ID người dùng đã đánh giá.
  - `productId` (ObjectId): ID sản phẩm được đánh giá.
  - `rating` (Number): Đánh giá của người dùng (1-5).
  - `comment` (String): Bình luận của người dùng về sản phẩm.


