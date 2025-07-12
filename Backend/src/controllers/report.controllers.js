import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { UnRegisteredUser } from "../models/unRegisteredUser.model.js";
import { generateJWTToken_username } from "../utils/generateJWTToken.js";
import { Request } from "../models/request.model.js";
import { Chat } from "../models/chat.model.js";
import { Report } from "../models/report.model.js";
import { sendMail } from "../utils/SendMail.js";

export const createReport = asyncHandler(async (req, res, next) => {
  console.log("\n******** Inside createReport Controller function ********");
  const { username, reportedUsername, issue, issueDescription } = req.body;

  if (!username || !reportedUsername || !issue || !issueDescription) {
    return next(new ApiError(400, "Please fill all the details"));
  }

  const reporter = await User.findOne({ username: username });
  const reported = await User.findOne({ username: reportedUsername });

  if (!reporter || !reported) {
    return next(new ApiError(400, "User not found"));
  }

  const chat = await Chat.findOne({
    users: {
      $all: [reported._id, reporter._id],
    },
  });

  if (!chat) {
    return next(new ApiError(400, "User never interacted with the reported user so cannot report"));
  }

  const report = await Report.create({
    reporter: reporter._id,
    reported: reported._id,
    nature: issue,
    description: issueDescription,
  });

  // Send email notification to admin
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const emailSubject = "New User Report - SkillSwap";
    const emailMessage = `
      <h2>New User Report Submitted</h2>
      <p><strong>Reporter:</strong> ${reporter.name} (${reporter.username})</p>
      <p><strong>Reported User:</strong> ${reported.name} (${reported.username})</p>
      <p><strong>Issue Type:</strong> ${issue}</p>
      <p><strong>Description:</strong> ${issueDescription}</p>
      <p><strong>Report Date:</strong> ${new Date().toLocaleString()}</p>
      <hr>
      <p>Please review this report and take appropriate action.</p>
    `;

    try {
      await sendMail(adminEmail, emailSubject, emailMessage);
      console.log("Report notification sent to admin");
    } catch (error) {
      console.log("Error sending report notification:", error);
    }
  }

  res.status(201).json(new ApiResponse(201, report, "User Reported successfully"));
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  console.log("\n******** Inside deleteUser Controller function ********");
  const { username } = req.params;
  const { currentUser } = req;

  // Check if current user is admin
  if (currentUser.role !== "admin") {
    return next(new ApiError(403, "Only admins can delete users"));
  }

  const userToDelete = await User.findOne({ username: username });
  if (!userToDelete) {
    return next(new ApiError(404, "User not found"));
  }

  // Delete user's reports
  await Report.deleteMany({
    $or: [{ reporter: userToDelete._id }, { reported: userToDelete._id }],
  });

  // Delete user's chats
  await Chat.deleteMany({
    users: userToDelete._id,
  });

  // Delete user's requests
  await Request.deleteMany({
    $or: [{ sender: userToDelete._id }, { receiver: userToDelete._id }],
  });

  // Delete the user
  await User.findByIdAndDelete(userToDelete._id);

  // Send email notification to admin about the deletion
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const emailSubject = "User Deleted - SkillSwap";
    const emailMessage = `
      <h2>User Account Deleted</h2>
      <p><strong>Deleted User:</strong> ${userToDelete.name} (${userToDelete.username})</p>
      <p><strong>Deleted By Admin:</strong> ${currentUser.name} (${currentUser.username})</p>
      <p><strong>Deletion Date:</strong> ${new Date().toLocaleString()}</p>
      <hr>
      <p>All associated data (reports, chats, requests) has been removed.</p>
    `;

    try {
      await sendMail(adminEmail, emailSubject, emailMessage);
      console.log("Deletion notification sent to admin");
    } catch (error) {
      console.log("Error sending deletion notification:", error);
    }
  }

  res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});
