exports.checkout = async (req, res) => {
    // TODO: Tạo đơn hàng mới trong Cassandra từ giỏ hàng Redis
  };
  
  exports.getOrderHistory = async (req, res) => {
    const userId = req.user.id; // lấy từ middleware verifyToken
    // TODO: Truy xuất đơn hàng theo userId từ Cassandra
  };
  