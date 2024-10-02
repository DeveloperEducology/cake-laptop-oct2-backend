const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const order_controller = require("./order.controller");
const adminCheck = require("../../middleware/adminCheck");

const uploadMiddleWare = require("../../middleware/fileUpload");

router.post(
  "/fileUpload",
  uploadMiddleWare.single("file"),
  order_controller.fileUpload
);

router.post("/create-order", auth, order_controller.createOrder);
router.put("/orders/:orderId", order_controller.updateOrder);
router.delete("/delete-order/:id", order_controller.deleteOrder);
router.get("/order/:id", auth, order_controller.orderById);
router.get("/orders/:userId", auth, order_controller.getOrderByUserId);
router.get("/orders", order_controller.getAllOrders);
router.get("/order-stats", order_controller.countOrdersByStatusForAgents);

router.get("/orders/by-date/:postedDate", order_controller.searchByDate);
router.get(
  "/orders/by-date-range/:startDate/:endDate",
  order_controller.byDateRange
);

router.get("/delivery-orders/:id", order_controller.getDeliveries);

module.exports = router; // Corrected from `module. Exports` to `module.exports`

// http://localhost:3001/orders/by-date-range?startDate=25-8-24&endDate=27-8-24
