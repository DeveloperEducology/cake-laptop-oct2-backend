const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./src/modals/userModel'); // Adjust the path as needed

const app = express();
app.use(express.json());

const SECRET_KEY = 'fsdafsdfsadfsadfdfsadfsfdsfsadfdsfdsf'; // Store this securely (e.g., in environment variables)

// MongoDB URI
const MONGO_URI = "mongodb+srv://vijaymarka:admin123@cluster0.ivjiolu.mongodb.net/JuneTutor?retryWrites=true&w=majority"; // Replace with your actual MongoDB connection string

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      id: user._id,
      email: user.email,
      userType: user.userType,
    };

    // Sign token
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    // Return token and user details
    res.json({ 
      token,
      user: {
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to get authenticated user
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Example route to get the logged-in user
app.get('/me', authMiddleware, (req, res) => {
  res.json(req.user); // req.user is populated by the authMiddleware
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
