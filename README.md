# 🧭 API for Travel Records

A simple practice project built while learning API development from **Sayar Ei Maung's API Book**.  
This project demonstrates how to build RESTful APIs using **Express**, **MongoDB**, and **JWT authentication**.

---

## 🚀 Features

### 🔹 Travel Records (`/api/v1/records`)
- `GET` — Fetch all travel records  
- `POST` — Add a new record  
- `PUT` — Replace an existing record  
- `PATCH` — Update specific fields of a record  
- `DELETE` — Remove a record  

> 🛡️ Only **admin users** can perform `PUT`, `PATCH`, and `DELETE` actions.

### 🔹 User Accounts
- `POST /api/v1/register` — Register a new user  
- `POST /api/v1/login` — Log in and get a JWT access token  

---

## 🧱 Tech Stack

- **Node.js** – Runtime environment  
- **Express.js** – Web framework  
- **MongoDB** – NoSQL database  
- **JWT (JSON Web Token)** – Authentication and authorization  

---

## 📂 Folder Structure

The project structure is organized to separate concerns, making it scalable and easy to maintain.

api-for-travel-records/
├── index.js              # Main application entry point
├── middlewares/          # Custom middleware 
├── routes/               # API endpoint 
├── .env                  # Private environment 
└── .env.example          # Template for required environment variables

## 📘 API Endpoints
### Travel Records Management
This module handles the core CRUD operations for travel data.

| Module      | Method   | Endpoint              | Description                   | Access                 |
| :---------- | :------- | :-------------------- | :---------------------------- | :--------------------- |
| **Records** | `GET`    | `/api/v1/records`     | Get all travel records        | Authenticated |
| **Records** | `POST`   | `/api/v1/records`     | Create a new record           | Authenticated          |
| **Records** | `PUT`    | `/api/v1/records/:id` | Replace an existing record    | Admin only             |
| **Records** | `PATCH`  | `/api/v1/records/:id` | Update specific record fields | Admin only             |
| **Records** | `DELETE` | `/api/v1/records/:id` | Delete a record               | Admin only             |

### User Authentication

This handles user registration and login, providing JWTs for secure access.

| Module      | Method   | Endpoint              | Description                   | Access                 |
| :---------- | :------- | :-------------------- | :---------------------------- | :--------------------- |
| **Users**   | `POST`   | `/api/v1/register`    | Register a new user           | Public                 |
| **Users**   | `POST`   | `/api/v1/login`       | Log in and receive JWT token  | Public                 |

---

## 🛠️ Installation and Setup

### Prerequisites

You need to have **Node.js** and an accessible **MongoDB** instance (local or cloud) installed.

### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/nainglynnag/api-for-travel-records.git
    cd api-for-travel-records
    ```

2.  **Install project dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a file named **`.env`** in the project's root directory. Copy the structure from **`.env.example`** and fill in your specific values.

4.  **Start the Server:**
    ```bash
    npm start
    # or for development with automatic restarts:
    # npm run dev
    ```

The API will be running on the configured port (e.g., `http://localhost:8000`).