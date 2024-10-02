const UserModel = require("../../modals/user");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const clientId = "LRDFECK0815DHLLSN7KLJ7NU18YCOYMG";
const clientSecret = "mssp9lfiqnj2rtm4jfx331csaeoynmm4";
let storedOtp = null;
let orderId = null;
let phoneNumber = null;

const createUser = async (req, res) => {
  const { userName, userType, userId, phoneNumber } = req.body;

  try {
    let checkUser = await UserModel.findOne({ phoneNumber: phoneNumber });

    if (!checkUser) {
      const token = jwt.sign(
        { user_id: result?._id, phoneNumber },
        process.env.TOKEN_KEY
      );
      result.token = token;

      res.send({
        data: result,
        message: "User created successfully...!!!",
        status: true,
      });
    } else {
      res.status(403).json({ status: false, message: "User already exists" });
    }
  } catch (error) {
    console.log("Error raised", error);
    res.status(403).json({ status: false, error: error });
  }
};

const sendOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    let user = await UserModel.findOne({ phoneNumber });

    if (!user) {
      // Create a new user if not found
      user = new UserModel({ phoneNumber });
      await user.save();
      console.log("New user created with phone number:", phoneNumber);
    }

    const response = await axios.post(
      "https://auth.otpless.app/auth/otp/v1/send",
      {
        phoneNumber,
        otpLength: 4,
        channel: "SMS",
        expiry: 600,
      },
      {
        headers: {
          clientId: clientId,
          clientSecret: clientSecret,
          "Content-Type": "application/json",
        },
      }
    );

    const orderId = response.data.orderId; // Store orderId for verification
    const storedOtp = response.data.otp; // Store OTP temporarily

    res.json({ orderId, success: true });
  } catch (error) {
    console.error(
      "Error sending OTP:",
      error.response ? error.response.data : error.message
    );
    res.status(error.response ? error.response.status : 500).json({
      success: false,
      message: error.response ? error.response.data.message : error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  const { otp } = req.body;

  try {
    const response = await axios.post(
      "https://auth.otpless.app/auth/otp/v1/verify",
      {
        orderId: orderId,
        otp: otp,
        phoneNumber: phoneNumber, // Include phone number
      },
      {
        headers: {
          clientId: clientId,
          clientSecret: clientSecret,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response veife", response.data.isOTPVerified);
    if (response.data.isOTPVerified) {
      let user = await UserModel.findOne({ phoneNumber });

      if (!user) {
        // If the user doesn't exist, create a new one
        user = new UserModel({ phoneNumber });
        await user.save();
      }

      // Generate a JWT token
      const token = jwt.sign(
        { user_id: user._id, phoneNumber: user.phoneNumber },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );

      const userWithoutSensitiveInfo = {
        ...user.toObject(),
        token,
      };
      delete userWithoutSensitiveInfo.password;

      // Clear stored OTP and orderId after successful verification
      storedOtp = null;
      orderId = null;
      console.log(userWithoutSensitiveInfo);
      res.json({ data: userWithoutSensitiveInfo, success: true });
    } else {
      res.status(400).json({ success: false, message: response.data.reason });
    }
  } catch (error) {
    console.error(
      "Error verifying OTP:",
      error.response ? error.response.data : error.message
    );
    res.status(error.response ? error.response.status : 500).json({
      success: false,
      message: error.response ? error.response.data.message : error.message,
    });
  }
};

module.exports = {
  createUser,
  sendOTP,
  verifyOTP,
};
