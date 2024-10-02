const express = require("express");
const rootRouter = express.Router();

const users = require("./user/user.route");
const orders = require("./order/orders.route");

rootRouter.use("/", users);
rootRouter.use("/", orders);

module.exports = rootRouter;
