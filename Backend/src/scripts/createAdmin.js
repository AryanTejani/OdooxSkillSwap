import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.username);
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      username: "admin",
      name: "Admin User",
      email: "admin@skillswap.com",
      role: "admin",
      visibility: "public",
      bio: "System Administrator",
      skillsProficientAt: ["Administration"],
      skillsToLearn: [],
      skillsKnown: ["Administration"],
      skillsWantToLearn: [],
      availability: "everyday",
    });

    console.log("Admin user created successfully:", adminUser.username);
    console.log("You can now log in with username: admin");
    console.log("Remember to change the password and email in production!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

createAdminUser();
