const User = require("../models/User");
const WaitlistRequest = require("../models/WaitlistRequest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  Query: {
    currentUser: async (_, __, { user }) => {
      if (!user) return null;
      return await User.findById(user.id);
    },

    myRequests: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");

      return await WaitlistRequest.find({ user: user.id }).sort({ createdAt: -1 });
    },
  },

  Mutation: {
    register: async (_, { username, email, password }) => {
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email already registered");
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashed,
      });

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return { token, user };
    },

    logout: () => {
      return "Logout successful";
    },

    addRequest: async (_, args, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const request = await WaitlistRequest.create({
        ...args,
        user: user.id,
      });

      return request;
    },

    updateRequest: async (_, { id, ...updates }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const existingRequest = await WaitlistRequest.findById(id);

      if (!existingRequest) {
        throw new Error("Request not found");
      }

      if (existingRequest.user.toString() !== user.id) {
        throw new Error("Not authorized");
      }

      const updatedRequest = await WaitlistRequest.findByIdAndUpdate(
        id,
        updates,
        { new: true }
      );

      return updatedRequest;
    },

    deleteRequest: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const existingRequest = await WaitlistRequest.findById(id);

      if (!existingRequest) {
        throw new Error("Request not found");
      }

      if (existingRequest.user.toString() !== user.id) {
        throw new Error("Not authorized");
      }

      await WaitlistRequest.findByIdAndDelete(id);

      return "Request deleted successfully";
    },
  },
};