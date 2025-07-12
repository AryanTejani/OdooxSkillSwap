# Admin Setup Guide

## Environment Variables

Add the following to your `.env` file in the Backend directory:

```env
# Email Configuration (for sending report notifications)
EMAIL_ID=your-email@gmail.com
APP_PASSWORD=your-gmail-app-password

# Admin Email (where report notifications will be sent)
ADMIN_EMAIL=admin@yourdomain.com

# Database
MONGODB_URI=your-mongodb-connection-string
```

## Setting up Admin User

1. **Create Admin User:**

   ```bash
   cd Backend
   node src/scripts/createAdmin.js
   ```

2. **Manual Admin Creation (Alternative):**
   - Register a normal user through the frontend
   - Update the user's role to "admin" in your database:
   ```javascript
   // In MongoDB shell or your database tool
   db.users.updateOne({ username: "your-username" }, { $set: { role: "admin" } });
   ```

## Features Implemented

### 1. Report System with Email Notifications

- When a user reports another user, an email is sent to the admin
- Email includes:
  - Reporter details
  - Reported user details
  - Issue type and description
  - Timestamp

### 2. Admin Delete User Functionality

- Only users with `role: "admin"` can see the delete button
- Delete button appears on other users' profiles (not on admin's own profile)
- When deleting a user:
  - All associated data is removed (reports, chats, requests)
  - Email notification is sent to admin about the deletion
  - User is permanently removed from the system

### 3. Security Features

- Admin role verification on backend
- Confirmation dialog before deletion
- Proper error handling and user feedback

## Usage

1. **As Admin:**

   - Log in with admin credentials
   - Visit any user's profile
   - You'll see a red "Delete User 🗑️" button
   - Click to delete the user (with confirmation)

2. **As Regular User:**
   - Report other users through the report form
   - Admin will receive email notifications
   - No delete button will be visible

## Email Setup

For Gmail:

1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in your `.env` file

For other email providers, update the SMTP configuration in `src/utils/SendMail.js`.

## Notes

- The admin user created by the script has basic credentials
- Change the admin email and credentials in production
- The delete functionality is irreversible
- All report emails are sent to the `ADMIN_EMAIL` address
