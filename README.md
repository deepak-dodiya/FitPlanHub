# FitPlanHub

**FitPlanHub** is a full-stack web application connecting fitness enthusiasts with professional trainers. Users can follow trainers, browse their feed, and purchase specialized fitness plans. Trainers can publish and manage their plans via a dedicated dashboard.

![FitPlanHub](https://via.placeholder.com/800x400?text=FitPlanHub+Preview)

##  Features

-   **Role-Based Authentication**: Secure Signup/Login for **Users** and **Trainers** (JWT-based).
-   **Dynamic User Feed**: 
    -   Follow your favorite trainers.
    -   See a personalized feed of plans from trainers you follow.
-   **Marketplace & Discovery**:
    -   Browse all available plans on the Landing Page.
    -   Discover "Our Expert Trainers" with public profiles.
-   **Purchased Library ("My Plans")**: Dedicated section for users to access plans they have subscribed to.
-   **Trainer Dashboard**: 
    -   Create new fitness plans (Title, Description, Price, Duration).
    -   Manage existing plans.
-   **Premium UI**: Modern Dark Mode with Glassmorphism aesthetics and responsive design.
-   **Currency Support**: Native support for Indian Rupee (₹).

##  Tech Stack

### Backend
-   **Java 17**
-   **Spring Boot 3.2**: Web, Security, JDBC.
-   **MySQL**: Relational Database.
-   **Spring Security + JWT**: Stateless authentication.
-   **Lombok**: Boilerplate reduction.

### Frontend
-   **React 18**: Component-based UI.
-   **Vite**: Fast build tool and dev server.
-   **React Router v6**: Client-side routing.
-   **Context API**: State management for Authentication.
-   **CSS3**: Custom Glassmorphism styles (no external UI libraries).

---

##  Prerequisites

Ensure you have the following installed:
1.  **Java JDK 17** or higher.
2.  **Node.js** (v16+) and **npm**.
3.  **MySQL Server**.

---

##  Getting Started

### 1. Database Setup
1.  Open your MySQL client (Workbench, CLI, etc.).
2.  Create a new database named `fitplanhub`:
    ```sql
    CREATE DATABASE fitplanhub;
    ```
    *(Note: Tables will be automatically created by the application on first run via `schema.sql`)*.

### 2. Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Open `src/main/resources/application.properties` and update your MySQL credentials if they differ from `root` / `root`:
    ```properties
    spring.datasource.username=YOUR_USERNAME
    spring.datasource.password=YOUR_PASSWORD
    ```
3.  Run the application:
    -   **VS Code / IDE**: Run `FitPlanHubApplication.java`.
    -   **Terminal**:
        ```bash
        ./mvnw spring-boot:run
        ```
    *The backend will start on `http://localhost:8080`.*

### 3. Frontend Setup
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *The frontend will start on `http://localhost:5173`.*

---

## Usage Guide

### For Users
1.  **Sign Up** as a "User".
2.  **Browse** trainers on the Landing Page or explore the Feed.
3.  **Follow** trainers to see their content in your "Feed".
4.  **Subscribe** to a plan to unlock full access.
5.  View your purchased plans in **"My Plans"**.

### For Trainers
1.  **Sign Up** as a "Trainer".
2.  Access the **"Dashboard"** from the Navbar.
3.  **Create Plan**: Fill in details and publish.
4.  Your plans will immediately appear on the Landing Page and in the feeds of your followers.
