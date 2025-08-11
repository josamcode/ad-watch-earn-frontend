# EarnWatch - Video Earnings Platform

A comprehensive platform where users can earn money by watching videos and completing tasks. Built with Node.js, React, and MongoDB.

## 🚀 Features

### User Features

- **User Registration & Login** - Email/username and password authentication
- **Video Watching System** - Earn money by watching videos completely
- **Task-based Progression** - Complete tasks in order to unlock new ones
- **Withdrawal System** - Request withdrawals to bank accounts
- **Real-time Balance Tracking** - Monitor earnings and balance
- **Mobile-responsive Design** - Works seamlessly on mobile and desktop
- **Notification System** - Get notified about earnings, withdrawals, and task updates
- **Profile Management** - Update personal information

### Admin Features

- **Admin Dashboard** - Comprehensive overview of platform statistics
- **User Management** - View, edit, and manage user accounts
- **Video Management** - Add, edit, and organize videos by tasks
- **Withdrawal Processing** - Review and approve/reject withdrawal requests
- **Task Control** - Lock/unlock tasks for individual users
- **Platform Settings** - Configure minimum withdrawals, daily limits, etc.
- **Analytics** - Track video views, earnings, and user engagement

### Technical Features

- **Secure Authentication** - JWT-based authentication system
- **Input Validation** - Comprehensive form validation and sanitization
- **File Upload Support** - For screenshots and task submissions
- **Rate Limiting** - Prevent abuse and ensure fair usage
- **Dark Mode Support** - Toggle between light and dark themes
- **Responsive Design** - Mobile-first design approach
- **RESTful API** - Clean and well-documented API endpoints

## 🛠 Tech Stack

### Backend

- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

### Frontend

- **React 18** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **React Player** - Video player component

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (v4.4 or higher)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/video-earnings-platform.git
cd video-earnings-platform
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit the .env file with your configuration
nano .env
```

#### Backend Environment Variables

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/video-earnings

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit the .env file
nano .env
```

#### Frontend Environment Variables

```env
# API Base URL
REACT_APP_API_URL=http://localhost:5000/api

# App Configuration
REACT_APP_NAME=EarnWatch
REACT_APP_VERSION=1.0.0
```

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows, start MongoDB service from Services.msc
```

### 5. Running the Application

#### Start Backend Server

```bash
# From backend directory
npm run dev

# Or for production
npm start
```

The backend server will start on `http://localhost:5000`

#### Start Frontend Development Server

```bash
# From frontend directory
npm start
```

The frontend will start on `http://localhost:3000`

## 🗂 Project Structure

```
video-earnings-platform/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── tasks.js
│   │   ├── videos.js
│   │   ├── withdrawals.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── .env.example
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Layout/
    │   │   └── UI/
    │   ├── contexts/
    │   │   ├── AuthContext.js
    │   │   └── ThemeContext.js
    │   ├── pages/
    │   │   ├── Auth/
    │   │   ├── Dashboard/
    │   │   ├── Tasks/
    │   │   ├── Withdrawal/
    │   │   ├── Profile/
    │   │   └── Admin/
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    ├── .env.example
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

## 🔧 Configuration

### Database Configuration

The application uses MongoDB. You can use either a local MongoDB instance or MongoDB Atlas (cloud).

#### Local MongoDB

```env
MONGODB_URI=mongodb://localhost:27017/video-earnings
```

#### MongoDB Atlas

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/video-earnings
```

### Admin User Setup

To create an admin user, you need to manually update a user's `userType` in the database:

```bash
# Connect to MongoDB
mongo video-earnings

# Find your user
db.users.find({email: "admin@example.com"})

# Update user type to admin
db.users.updateOne(
  {email: "admin@example.com"},
  {$set: {userType: "admin"}}
)
```

## 📱 Platform Usage

### For Users

1. **Registration**: Sign up with name, email, username, password, and phone number
2. **Task Completion**: Start with Task 1 - watch all videos completely
3. **Earning Money**: Receive Iraqi Dinars for each completed video
4. **Withdrawals**: Request withdrawals when balance meets minimum requirement
5. **Task Progression**: Complete Task 1 and make a withdrawal to unlock Task 2

### For Admins

1. **Dashboard**: Monitor platform statistics and recent activity
2. **User Management**: View user details, edit balances, manage task access
3. **Video Management**: Add new videos, organize by tasks, set earnings
4. **Withdrawal Processing**: Review and approve/reject withdrawal requests
5. **Settings**: Configure platform settings like minimum withdrawals

## 🔐 Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive input validation and sanitization
- **Rate Limiting**: Protection against spam and abuse
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Security Headers**: Helmet.js for security headers
- **Environment Variables**: Sensitive data stored in environment variables

## 🎯 Key Features Deep Dive

### Video Watching System

- **Anti-Skip Protection**: Users cannot skip or seek through videos
- **Completion Validation**: Must watch at least 95% to earn money
- **One-Time Viewing**: Each video can only be watched once for earnings
- **Progress Tracking**: Real-time tracking of video progress

### Task System

- **Progressive Unlocking**: Tasks unlock in sequence
- **Flexible Control**: Admins can manually unlock/lock tasks for users
- **Completion Tracking**: Track which videos users have completed
- **Earning Attribution**: Each task can have different earning amounts

### Withdrawal System

- **Bank Integration Ready**: Supports Iraqi banking details
- **Admin Approval**: All withdrawals require admin approval
- **Status Tracking**: Users can track withdrawal status
- **History Management**: Complete withdrawal history
- **Minimum Thresholds**: Configurable minimum withdrawal amounts

## 🚀 Deployment

### Production Environment Variables

Update your `.env` files for production:

```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-super-secret-production-key
FRONTEND_URL=https://yourdomain.com
```

### Build Frontend

```bash
cd frontend
npm run build
```

### Deploy Backend

1. **Server Setup**: Use services like DigitalOcean, AWS, or Heroku
2. **Database**: Use MongoDB Atlas for cloud database
3. **Environment Variables**: Set all required environment variables
4. **Process Manager**: Use PM2 for process management
5. **Reverse Proxy**: Configure Nginx for production

### Example PM2 Configuration

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "video-earnings-api"

# Save PM2 configuration
pm2 save
pm2 startup
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 API Documentation

### Authentication Endpoints

```
POST /api/auth/register - Register new user
POST /api/auth/login - User login
GET /api/auth/verify - Verify JWT token
GET /api/auth/settings - Get platform settings
```

### User Endpoints

```
GET /api/users/profile - Get user profile
PUT /api/users/profile - Update user profile
GET /api/users/stats - Get user statistics
GET /api/users/notifications - Get user notifications
```

### Task Endpoints

```
GET /api/tasks - Get available tasks
GET /api/tasks/:taskNumber - Get specific task
POST /api/tasks/watch-video - Submit video completion
GET /api/tasks/watch-history - Get watch history
```

### Withdrawal Endpoints

```
POST /api/withdrawals/request - Submit withdrawal request
GET /api/withdrawals/history - Get withdrawal history
GET /api/withdrawals/:id - Get specific withdrawal
POST /api/withdrawals/:id/cancel - Cancel pending withdrawal
```

### Admin Endpoints

```
GET /api/admin/dashboard/stats - Get dashboard statistics
GET /api/admin/users - Get all users
PUT /api/admin/users/:id - Update user
POST /api/admin/users/:id/task/:taskNumber/toggle - Toggle task access
GET /api/admin/videos - Get all videos
POST /api/admin/videos - Create new video
PUT /api/admin/videos/:id - Update video
DELETE /api/admin/videos/:id - Delete video
GET /api/admin/withdrawals - Get all withdrawals
POST /api/admin/withdrawals/:id/process - Process withdrawal
GET /api/admin/settings - Get platform settings
PUT /api/admin/settings - Update platform settings
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify database permissions

2. **Frontend Not Loading**

   - Check if backend is running on correct port
   - Verify `REACT_APP_API_URL` in frontend `.env`
   - Clear browser cache

3. **JWT Token Issues**

   - Ensure `JWT_SECRET` is set in backend `.env`
   - Check token expiration (default 30 days)
   - Clear localStorage in browser

4. **Video Player Issues**
   - Ensure video URLs are accessible
   - Check CORS settings for video sources
   - Verify ReactPlayer configuration

## 🎉 Acknowledgments

- React team for the amazing frontend framework
- Express.js for the robust backend framework
- MongoDB for the flexible database solution
- Tailwind CSS for the utility-first CSS framework
- All open source contributors who made this project possible

---

**Happy Earning! 💰**
