const express = require("express");
const router = express.Router();
const user_controller = require("./user.controller");
const auth = require("../../middleware/auth");

router.post("/signup", user_controller.createUser);
router.post("/login", user_controller.loginUser);
router.post("/otp-less", user_controller.sendOTP);

router.post("/verifyOTP-less", user_controller.verifyOTP);
router.post("/agents", user_controller.createAgent);
router.get("/deliveryboys", user_controller.fetchDeliveryBoys);
router.get("/allboys", user_controller.fetchBoys);

router.delete("/delete-agent/:id", user_controller.deleteAgent);

module.exports = router;
