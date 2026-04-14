# Daycare Waitlist System – Assignment 3

## Group Members
- Mathurangy  
- Sama  
- Hasan  
- Gurpreet  
- Venkata  

---

## Project Description

This project is a **Daycare Waitlist System** developed for COMP 308 Assignment 3.

The purpose of this project is to implement a **secure authentication system** using React, Node.js, GraphQL, and MongoDB Atlas.

The application allows users to:
- Register a new account  
- Login securely  
- Logout  
- View their profile (current user)  
- Access a protected dashboard  

---

## Technologies Used

### Frontend
- React (Create React App)
- Apollo Client
- GraphQL

### Backend
- Node.js
- Express
- Apollo Server
- MongoDB Atlas
- Mongoose
- JWT (jsonwebtoken)
- bcrypt (password hashing)

---

## Authentication Features

- User Registration with hashed passwords  
- User Login with JWT token  
- Logout functionality  
- currentUser GraphQL query  
- Protected dashboard access  
- Token stored in localStorage  
- Automatic logout if token is invalid  

---

## Additional Feature

A **Daycare Waitlist Request Form** is included in the dashboard to reflect the project topic.

The form allows users to enter:
- Parent Name  
- Child Name  
- Child Age  
- Preferred Start Date  
- Preferred Location  


## Application Flow
User registers → account saved in MongoDB
User logs in → JWT token generated
Token stored in localStorage
User accesses dashboard
currentUser query validates session
Logout clears session and redirects user


## Security
Passwords are hashed using bcrypt
JWT is used for authentication
Protected routes prevent unauthorized access
Invalid tokens automatically log out users
Sensitive data stored in .env


## Contribution Breakdown
	
Mathurangy:	Backend setup, GraphQL schema, resolvers, authentication logic
Sama: Frontend integration, authentication flow, protected access
Hasan: Testing, debugging, waitlist form implementation
Gurpreet: Styling and dashboard design
Venkata: Documentation, testing, and support