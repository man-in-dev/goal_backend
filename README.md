# Backend API

A robust Node.js backend built with Express.js, TypeScript, and MongoDB.

## Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with role-based access control
- 🛡️ **Security**: Helmet, CORS, rate limiting, XSS protection, and input sanitization
- 📝 **Validation**: Request validation and sanitization
- 🚨 **Error Handling**: Comprehensive error handling with custom error classes
- 🗄️ **Database**: MongoDB with Mongoose ODM
- 🔄 **TypeScript**: Full TypeScript support with strict type checking
- 📊 **Logging**: Request logging and error tracking
- 🏗️ **Architecture**: Clean architecture with separation of concerns

## Project Structure

```
src/
├── config/          # Configuration files
│   ├── db.ts       # Database connection
│   └── envConfig.ts # Environment variables
├── controllers/     # Route controllers
│   └── authController.ts
├── middleware/      # Custom middleware
│   ├── auth.ts     # Authentication middleware
│   ├── errorHandler.ts # Error handling
│   └── validation.ts # Request validation
├── models/         # Database models
│   └── User.ts
├── routes/         # API routes
│   ├── auth.ts     # Authentication routes
│   └── index.ts    # Main routes
├── services/       # Business logic
└── server.ts       # Main server file
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Configure environment variables in `.env`:
```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/your_database_name
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

5. Build the project:
```bash
npm run build
```

6. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`

#### Logout
- **POST** `/api/auth/logout`
- **Headers:** `Authorization: Bearer <token>`

### Health Check
- **GET** `/api/health`

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 10 minutes per IP
- **XSS Protection**: Prevents cross-site scripting attacks
- **Input Sanitization**: MongoDB query injection protection
- **HTTP Parameter Pollution**: Prevents parameter pollution attacks

## Error Handling

The API uses a centralized error handling system with custom error classes:

- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

## Development

### Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build the project
- `npm start`: Start production server

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `CORS_ORIGIN` | CORS allowed origin | `http://localhost:3000` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC 