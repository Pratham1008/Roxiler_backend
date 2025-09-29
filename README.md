# Store Rating Application - NestJS Backend

This repository contains the backend for the Store Rating application, a robust and scalable server-side solution built with NestJS. It provides a complete RESTful API for handling user authentication, data management, and business logic, all while following best practices for security and modular design.

## ✨ Core Functionality
- **Modular Architecture**: The application is organized into distinct modules (Auth, Users, Stores, Ratings) for a clean separation of concerns and improved maintainability.  
- **Secure Authentication**: Implements a secure authentication system using JSON Web Tokens (JWT) with the Passport.js library, including password hashing via bcrypt.  
- **Role-Based Access Control (RBAC)**: A powerful guard system restricts access to specific endpoints based on user roles (ADMIN, OWNER, USER), ensuring that users can only perform authorized actions.  
- **Database Integration**: Utilizes TypeORM to seamlessly interact with a PostgreSQL database, managing all data through well-defined entities.  
- **Data Validation**: Leverages `class-validator` and `class-transformer` to ensure all incoming data through DTOs (Data Transfer Objects) is valid and properly formatted.  
- **Configuration Management**: Securely manages sensitive information like database credentials and JWT secrets using environment variables via NestJS's ConfigModule.  

## 🚀 Technology Stack
- **Framework**: NestJS  
- **Language**: TypeScript  
- **Database ORM**: TypeORM  
- **Authentication**: Passport.js (`passport-jwt`)  
- **Password Hashing**: bcrypt  
- **Data Validation**: class-validator, class-transformer  
- **Environment Variables**: @nestjs/config  

## 🏗️ Architectural Overview
The backend is structured into four primary modules, each responsible for a specific domain of the application's functionality:

- **AuthModule**: Handles all aspects of user authentication, including user registration (signup), login, and secure password changes. It is responsible for generating and validating JWTs.  
- **UsersModule**: Manages all user-related data (CRUD operations). It is protected to ensure that only authorized administrators can access and modify user information.  
- **StoresModule**: Responsible for the creation, retrieval, updating, and deletion of store data. Access is controlled by user roles.  
- **RatingsModule**: Manages the logic for submitting and retrieving ratings. It interacts with both the UsersModule and StoresModule to link ratings to users and stores, and it handles the real-time calculation of average store ratings.  

## ↔️ API Endpoints & Routes

### Auth Controller (`/auth`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST   | /auth/signup | Public | Registers a new user with the USER role. |
| POST   | /auth/login | Public | Authenticates a user and returns a JWT. |
| PATCH  | /auth/change-password | Authenticated | Allows a logged-in user to change their password. |

### Users Controller (`/users`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST   | /users | Admin | Creates a new user (can assign any role). |
| GET    | /users | Admin | Retrieves a list of all users with optional filtering. |
| GET    | /users/:id | Admin | Retrieves a single user by their ID. |
| PATCH  | /users/:id | Admin | Updates a user's details. |
| DELETE | /users/:id | Admin | Deletes a user from the database. |

### Stores Controller (`/stores`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST   | /stores | Admin | Creates a new store and can assign an owner. |
| GET    | /stores | Authenticated | Retrieves a list of all stores, with search/filter capabilities. |
| GET    | /stores/:id | Authenticated | Retrieves a single store by its ID. |
| PATCH  | /stores/:id | Admin | Updates a store's details. |
| DELETE | /stores/:id | Admin | Deletes a store from the database. |

### Ratings Controller (`/ratings`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST   | /ratings/:userId | Authenticated | Submits or updates a rating for a specific store. |
| GET    | /ratings/store/:id | Admin / Owner | Retrieves all ratings submitted for a specific store. |
| GET    | /ratings/user/:id | Admin | Retrieves all ratings submitted by a specific user. |

## 📋 Getting Started

### Prerequisites
- Node.js (v16 or later)  
- npm or yarn  
- A running instance of PostgreSQL  

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
    ````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend root directory. Copy the contents of `.env.example` and fill in your database credentials and a secure JWT secret.

4. Run the application:

   ```bash
   npm run start:dev
   ```

The backend server will start in watch mode on [http://localhost:3000](http://localhost:3000).

