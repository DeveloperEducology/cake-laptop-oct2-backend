const UserModel = require("../../modals/user");
const Order = require("../../modals/order");
const mongoose = require("mongoose");

const fileUpload = async (req, res) => {
  if (!req?.file) {
    res.status(403).json({ status: false, error: "please upload a file" });
    return;
  }
  let data = {};
  if (!!req?.file) {
    data = {
      url: req.file.location,
      type: req.file.mimetype,
    };
  }
  try {
    res.send({
      data: data,
    });

    console.log("fileupload in user api", data);
  } catch (error) {
    res.status(403).json({ status: false, error: error });
  }
};

const createOrder = async (req, res) => {
  const {
    userId,
    orderId,
    source,
    senderName,
    senderPhoneNumber,
    receiverName,
    receiverPhoneNumber,
    cakeName,
    cakeType,
    flavor,
    weight,
    messageOnCard,
    specialInstructions,
    date,
    time,
    shippingAddress,
    deliveryDate, // If this field is still relevant
    status,
    quantity,
    shippingInfo,
    paymentMethod,
    order_date,
    agentName,
    advance_payment,
    balance_payment,
    agentId,
    deliveryBoyId,
    image,
    dispatchImage,
  } = req.body;

  // Generate the postedDate in DD-MM-YY format
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1
  const year = currentDate.getFullYear().toString().slice(-2); // Get last 2 digits of the year

  // const postedDate = `${day}-${month}-${year}`;

  try {
    const newOrder = new Order({
      userId,
      orderId,
      source,
      senderName,
      senderPhoneNumber,
      receiverName,
      receiverPhoneNumber,
      shippingAddress,
      cakeName,
      cakeType,
      flavor,
      weight,
      messageOnCard,
      specialInstructions,
      time,
      quantity,
      deliveryDate, // Include if this is still relevant
      status,
      shippingInfo,
      paymentMethod,
      order_date,
      agentName,
      advance_payment,
      balance_payment,
      agentId,
      deliveryBoyId,
      image,
      dispatchImage,
    });
    const savedOrder = await newOrder.save();
    console.log("savedOrder", savedOrder);
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const updatedOrder = req.body;

  try {
    // Assuming you are using MongoDB
    const result = await Order.findByIdAndUpdate(orderId, updatedOrder, {
      new: true,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error });
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder)
      return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const orderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders1 = async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find();

    // Count the number of orders in different statuses
    const pendingCount = orders.filter(
      (order) => order.status === "pending"
    ).length;
    const processingCount = orders.filter(
      (order) => order.status === "processing"
    ).length;
    const deliveredCount = orders.filter(
      (order) => order.status === "delivered"
    ).length;

    // Send the orders and the counts
    res.json({
      orders,
      statusCounts: {
        pending: pendingCount,
        processing: processingCount,
        delivered: deliveredCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchByDate = async (req, res) => {
  const { postedDate } = req.params;

  try {
    // Find orders with the specified postedDate
    const orders = await Order.find({ postedDate: postedDate });

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for the specified date" });
    }

    res.status(200).json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const byDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.params;

    // Parse the dates from the URL in DD-MM-YY format
    const [startDay, startMonth, startYear] = startDate.split("-");
    const [endDay, endMonth, endYear] = endDate.split("-");

    // Convert to Date objects
    const start = new Date(`20${startYear}-${startMonth}-${startDay}`);
    const end = new Date(`20${endYear}-${endMonth}-${endDay}`);

    // Find orders between the given dates
    const orders = await Order.find({
      postedDate: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    console.log(startDate, endDate);

    res.json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const countOrdersByStatusForAgents = async (req, res) => {
  try {
    // Fetch all agents from the UserModel
    const agents = await UserModel.find({
      userType: { $in: ["agent", "admin"] },
    }).select("_id name");

    // Create an array of agent IDs (user IDs)
    const agentIds = agents.map((agent) => agent._id);

    // Fetch the count of orders grouped by status for each agent
    const ordersCount = await Order.aggregate([
      {
        $match: {
          userId: { $in: agentIds }, // Only include orders linked to these agents
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId", // Group by userId (agent's ID)
            status: "$status", // Group by order status
          },
          totalOrders: { $sum: 1 }, // Count the number of orders per agent per status
        },
      },
      {
        $group: {
          _id: "$_id.userId", // Group by agent ID
          orders: {
            $push: {
              status: "$_id.status",
              totalOrders: "$totalOrders",
            },
          },
        },
      },
    ]);

    // Join the order count data with the agent data
    const result = agents.map((agent) => {
      const agentOrderCount = ordersCount.find((order) =>
        order._id.equals(agent._id)
      );
      const ordersByStatus = {
        pending: 0,
        delivered: 0,
        processing: 0,
      };

      if (agentOrderCount) {
        agentOrderCount.orders.forEach((order) => {
          ordersByStatus[order.status] = order.totalOrders;
        });
      }

      return {
        agentId: agent._id,
        agentName: agent.name,
        ...ordersByStatus,
      };
    });

    // Send the response
    res.send({
      data: result,
      status: true,
    });
  } catch (error) {
    // Handle any errors
    res.status(403).json({ status: false, error: error.message });
  }
};

// Fetch orders assigned to a delivery boy
const getDeliveries = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Delivery Boy ID is required" });
    }

    console.log("Delivery Boy ID:", id);

    // Find orders assigned to the specific delivery boy
    const orders = await Order.find({ deliveryBoyId: id, status: 'processing' });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this delivery boy" });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  fileUpload,
  createOrder,
  countOrdersByStatusForAgents,
  updateOrder,
  getAllOrders,
  getOrderByUserId,
  deleteOrder,
  orderById,
  searchByDate,
  byDateRange,
  getDeliveries,
};
