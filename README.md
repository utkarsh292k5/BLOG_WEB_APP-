# Blog Web Application

A comprehensive full-stack blog platform with role-based access control featuring Readers, Authors, and Admins. Built with modern technologies and following industry best practices.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[🚀 Quick Start](./QUICK_START.md)** | One-page setup guide - Get running in 10 minutes |
| **[📖 Setup Guide](./SETUP_GUIDE.md)** | Complete installation with troubleshooting |
| **[🗄️ Database Schema](./DATABASE_SCHEMA.md)** | Tables, relationships, and SQL queries |
| **[📑 Documentation Index](./DOCUMENTATION.md)** | Navigate all documentation |

**New to the project?** Start with [QUICK_START.md](./QUICK_START.md)

---

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Ant Design
- **Backend**: Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA
- **Database**: MySQL 8.0
- **Authentication**: JWT-based with role-based access control
- **Architecture**: Layered design (Controller → Service → Repository → Entity)

## 📁 Project Structure

```
BLOG/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/blog/blogbackend/
│   │   ├── entity/            # JPA entities
│   │   ├── repository/        # Data access layer
│   │   ├── service/          # Business logic layer
│   │   ├── controller/       # REST API controllers
│   │   ├── config/          # Configuration classes
│   │   ├── dto/              # Data transfer objects
│   │   └── security/         # Security configuration
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── database-setup.sql
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── contexts/         # React contexts
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## ✨ Features

### User Roles & Permissions

- **Reader**: Browse and read blogs, rate/review (requires login)
- **Author**: Create and edit blogs (requires admin approval)
- **Admin**: Manage users, approve blogs and author requests

### Core Functionality

- 🔐 JWT authentication and authorization
- 📝 Blog creation, editing, and approval workflow
- ⭐ Review and rating system
- 👥 Admin dashboard for user and content management
- 📱 Responsive UI with modern design
- 🔄 Real-time status updates
- 📊 Analytics and statistics

## 🛠️ Getting Started

> **📖 For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**
> 
> The setup guide includes:
> - Complete installation steps
> - Database configuration
> - Table setup (automatic via Hibernate)
> - Troubleshooting common issues
> - Production deployment guide

### Quick Start

### Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Database Setup

1. Install MySQL and create a database:

```sql
CREATE DATABASE blog_db;
```

2. Update database credentials in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user info

### Blogs

- `GET /api/blogs` - Get all published blogs (paginated)
- `GET /api/blogs/{id}` - Get blog by ID
- `POST /api/blogs` - Create new blog (Author/Admin only)
- `PUT /api/blogs/{id}` - Update blog (Author/Admin only)
- `DELETE /api/blogs/{id}` - Delete blog (Author/Admin only)
- `GET /api/blogs/my-blogs` - Get current user's blogs
- `GET /api/blogs/author/{authorId}` - Get blogs by author

### Reviews

- `POST /api/reviews/blogs/{blogId}` - Add review to blog
- `PUT /api/reviews/{reviewId}` - Update review
- `DELETE /api/reviews/{reviewId}` - Delete review
- `GET /api/reviews/blogs/{blogId}` - Get reviews for blog
- `GET /api/reviews/my-reviews` - Get current user's reviews

### Admin

- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/pending-author-requests` - Get pending author requests
- `PUT /api/admin/users/{userId}/role` - Update user role
- `PUT /api/admin/users/{userId}/approve-author` - Approve author request
- `PUT /api/admin/users/{userId}/reject-author` - Reject author request
- `DELETE /api/admin/users/{userId}` - Delete user
- `GET /api/admin/blogs/pending` - Get pending blogs
- `PUT /api/admin/blogs/{blogId}/approve` - Approve blog
- `PUT /api/admin/blogs/{blogId}/reject` - Reject blog

## 🎯 User Flows

### Reader Flow

1. Visit home page → Browse published blogs
2. Click on blog → View full content
3. Login/Register → Add reviews and ratings
4. Option to request author access during registration

### Author Flow

1. Register with "Request Author Access" checked
2. Admin approves → Author can access dashboard
3. Create/edit blogs → Submit for approval
4. Admin approves → Blog appears publicly

### Admin Flow

1. Access admin dashboard → View statistics
2. Manage author requests → Approve/reject
3. Moderate blog content → Approve/reject blogs
4. Manage users → Change roles, delete accounts

## 🔧 Configuration

### Backend Configuration

Key configuration in `application.properties`:

- Database connection settings
- JWT secret and expiration
- CORS configuration
- Server port (default: 8080)

### Frontend Configuration

- API base URL: `http://localhost:8080/api`
- TailwindCSS for styling
- Ant Design for UI components

## 🚀 Deployment

### Backend Deployment

1. Build the JAR file:

```bash
mvn clean package
```

2. Run the JAR:

```bash
java -jar target/blog-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment

1. Build for production:

```bash
npm run build
```

2. Serve the `build` folder with a web server

## 🧪 Testing

### Backend Testing

```bash
mvn test
```

### Frontend Testing

```bash
npm test
```

## 📝 Development Notes

- The application uses Hibernate for automatic table creation
- JWT tokens expire after 24 hours (configurable)
- Passwords are hashed using BCrypt
- CORS is configured to allow frontend access
- All API responses follow RESTful conventions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
