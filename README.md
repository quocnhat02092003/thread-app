# Thread Clone

A full-stack social network application inspired by Threads, built with modern technologies.

## 🚀 Tech Stack

### Frontend (thread_ui)

- **React 19** with TypeScript
- **Redux Toolkit** for state management
- **React Router DOM** for routing
- **Material UI (MUI)** for UI components
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **SignalR** for real-time features
- **FontAwesome** for icons
- **Notistack** for notifications
- **Swiper** for carousels

### Backend (thread_server)

- **ASP.NET Core** Web API
- **Entity Framework Core** for ORM
- **MySQL** database
- **SignalR** for real-time communication
- **JWT** for authentication

## 📁 Project Structure

```
thread_app/
├── thread_ui/          # React TypeScript Frontend
│   ├── src/
│   │   ├── app/        # Redux store configuration
│   │   ├── components/ # Reusable UI components
│   │   ├── features/   # Redux slices
│   │   ├── hook/       # Custom React hooks
│   │   ├── layouts/    # Page layouts
│   │   ├── pages/      # Page components
│   │   ├── routers/    # Route configuration
│   │   ├── selectors/  # Redux selectors
│   │   ├── services/   # API services
│   │   └── types/      # TypeScript types
│   └── public/
│
└── thread_server/      # ASP.NET Core Backend
    ├── Controllers/    # API endpoints
    ├── Data/           # Database context
    ├── Hubs/           # SignalR hubs
    ├── Models/         # Entity models
    └── Services/       # Business logic
```

## ✨ Features

- 🔐 **Authentication** - Register, Login, JWT token refresh
- 👤 **User Profile** - View and edit profile, avatar upload
- 📝 **Posts** - Create, view, like posts with images
- 💬 **Comments** - Real-time comments on posts
- 👥 **Follow System** - Follow/unfollow users
- 🔔 **Notifications** - Real-time notifications via SignalR
- 🔍 **Search** - Search for users
- 📱 **Responsive Design** - Mobile-friendly UI

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- .NET 8 SDK
- MySQL Server

### Frontend Setup (thread_ui)

```bash
cd thread_ui

# Install dependencies
npm install

# Create .env file
# Add your API URL: REACT_APP_API_URL=http://localhost:5000

# Start development server
npm start
```

### Backend Setup (thread_server)

```bash
cd thread_server

# Restore packages
dotnet restore

# Update database
dotnet ef database update

# Run the server
dotnet run
```

## 📜 Available Scripts

### Frontend

| Script      | Description              |
| ----------- | ------------------------ |
| `npm start` | Start development server |
| `npm build` | Build for production     |
| `npm test`  | Run tests                |

### Backend

| Script                            | Description          |
| --------------------------------- | -------------------- |
| `dotnet run`                      | Start the API server |
| `dotnet ef migrations add <name>` | Create migration     |
| `dotnet ef database update`       | Apply migrations     |

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh JWT token

### Features

- `GET /api/feature/profile/{username}` - Get user profile
- `GET /api/feature/all-posts` - Get all posts (paginated)
- `GET /api/feature/post/{postId}` - Get post by ID
- `POST /api/feature/follow/{userId}` - Follow/unfollow user

### Posts

- `POST /api/post/create` - Create new post
- `POST /api/post/like/{postId}` - Like/unlike post
- `POST /api/post/comment/{postId}` - Comment on post

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes.

---

Made with ❤️ by [quocnhat02092003](https://github.com/quocnhat02092003)
