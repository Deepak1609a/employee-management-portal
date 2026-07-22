# Employee Management Portal

A full-stack employee management application built with Spring Boot, React, TypeScript, and MySQL. It provides a responsive interface for creating, viewing, updating, and deleting employee records.

## Features

- Create employee records
- View all employees
- Update employee information
- Delete employees with confirmation
- Validate employee information
- Prevent duplicate email addresses
- Display structured API error responses
- Persist employee data in MySQL
- Responsive React interface
- CORS configuration for frontend-backend communication

## Technology Stack

### Backend

- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Hibernate
- Jakarta Validation
- Lombok
- Maven
- Embedded Tomcat

### Frontend

- React
- TypeScript
- Vite
- HTML5
- CSS3
- Fetch API
- ESLint

### Database

- MySQL 8

## Project Structure

```text
Java-Portfolio/
├── employee-management-backend/
│   ├── src/main/java/com/deepak/employeemanagement/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── entity/
│   │   ├── exception/
│   │   ├── repository/
│   │   └── service/
│   └── pom.xml
│
├── employee-management-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── models/
│   │   └── services/
│   └── package.json
│
├── .gitignore
└── README.md
```

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/employees` | Create an employee |
| GET | `/api/employees` | Retrieve all employees |
| GET | `/api/employees/{id}` | Retrieve an employee by ID |
| PUT | `/api/employees/{id}` | Update an employee |
| DELETE | `/api/employees/{id}` | Delete an employee |

## Prerequisites

Install the following tools:

- Java 17
- Node.js 20 or later
- MySQL 8
- Git
- IntelliJ IDEA or another IDE

## Database Setup

Create the MySQL database:

```sql
CREATE DATABASE employee_management_db;
```

The backend connects using:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/employee_management_db
spring.datasource.username=root
spring.datasource.password=${DB_PASSWORD}
```

Set the `DB_PASSWORD` environment variable to your local MySQL password. Do not store database passwords in the source code.

## Running the Backend

Open a terminal inside `employee-management-backend`.

Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs at:

```text
http://localhost:8080
```

## Running the Frontend

Open a terminal inside `employee-management-frontend`:

```powershell
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## Build Verification

Backend:

```powershell
.\mvnw.cmd clean package
```

Frontend:

```powershell
npm run lint
npm run build
```

## Application Flow

```text
React Frontend
      ↓ REST API
Spring Boot Controller
      ↓
Service Layer
      ↓
Spring Data JPA Repository
      ↓
MySQL Database
```

## Future Enhancements

- Spring Security with JWT authentication
- Role-based access control
- Search, sorting, and pagination
- Automated unit and integration tests
- Docker containerization
- Cloud deployment
- CI/CD pipeline

## Author

Deepak Alikatte