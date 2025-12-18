# 📚 Library Management System API (LMS)

A robust, enterprise-ready RESTful API for modern library operations. This system handles the complete lifecycle of book inventory, member eligibility, and transaction security using a **State Machine** approach.

## 🚀 System Overview

This project is built to handle high-integrity library operations where data consistency is paramount. It enforces strict rules regarding borrowing limits, overdue penalties, and automated account suspensions.

### 🏗 Core Tech Stack

* **Runtime**: Node.js v20 (Debian Slim for binary compatibility)
* **Framework**: Express.js (Layered Architecture)
* **Database**: PostgreSQL 15
* **ORM**: Prisma v5 (with automated migrations)
* **Containerization**: Docker Compose
* **Validation & Logic**: `date-fns` for precise ISO-8601 temporal calculations

---

## 🛠️ Business Logic & Rules Engine

The system's core value lies in its **Service Layer**, which acts as a gatekeeper for the following library policies:

### 1. Borrowing Constraints

* **Quota Enforcement**: Members are restricted to a maximum of **3 active loans**. Any attempt to borrow a 4th book results in a `403 Forbidden` response.
* **Inventory Locking**: Real-time checks on `available_copies`. If a book is out of stock, its state transitions to `borrowed` and requests are denied.
* **Eligibility Check**: Members with any **unpaid fines** are immediately blocked from new transactions until the balance is cleared.

### 2. Fine & Suspension Logic

* **Loan Window**: All books have a standardized 14-day loan period.
* **Penalty Calculation**: Late returns trigger a penalty of **$0.50 per day**.
* **Automated Suspension**: A background check (via the `/overdue` report) identifies members with **3 or more overdue items** and transitions their account status to `suspended`.

---

## 🔄 State Machine Specification

The LMS manages data through defined states to ensure an audit trail and system stability.

| Entity | Action | State Change | Trigger Condition |
| --- | --- | --- | --- |
| **Book** | Borrow | `available` → `borrowed` | `available_copies == 0` |
| **Book** | Return | `borrowed` → `available` | `available_copies > 0` |
| **Member** | Overdue | `active` → `suspended` | `overdue_count >= 3` |
| **Member** | Payment | `blocked` → `active` | All `Fine.paid_at` are non-null |
| **Transaction** | Close | `active` → `returned` | Book checked in via Controller |

---

## 📦 Installation & Deployment

### 1. Prerequisites

* Docker Desktop
* Node.js (for local Prisma CLI access)

### 2. Launching the Environment

Clone the repository and run:

```bash
# Spin up PostgreSQL and the Express API
docker-compose up --build -d

# Apply database migrations
npx prisma migrate dev --name init

# Populate database with professional seed data
npx prisma db seed

```

---

## 🧪 API Documentation & Testing

### Key Endpoints

| Endpoint | Method | Description |
| --- | --- | --- |
| `/books` | `POST` | Register new inventory with unique ISBN |
| `/books/available` | `GET` | View currently in-stock titles |
| `/transactions/borrow` | `POST` | Process a loan (Validates quota/fines/stock) |
| `/transactions/:id/return` | `POST` | Close a loan and calculate overdue fines |
| `/transactions/overdue` | `GET` | Generate system-wide delinquency report |

### Postman Integration

A pre-configured test suite is located in the root: `Library_System_Testing.postman_collection.json`.

1. Import the collection.
2. The collection includes tests for **Positive Paths** (Borrow/Return) and **Negative Paths** (Exceeding 3-book limit).

---

## 📂 Project Structure

```text
├── prisma/
│   ├── schema.prisma      # ERD & Model Definitions
│   ├── seed.js            # Automated Test Data
│   └── migrations/        # Database Version Control
├── src/
│   ├── controllers/       # Request Orchestration
│   ├── services/          # Business Logic Engine
│   ├── routes/            # API URI Definitions
│   └── app.js             # Application Entry Point
├── Dockerfile             # Production-grade Build
└── docker-compose.yml     # Multi-service Orchestration

```

---

### 🛡️ Implementation Security & Integrity

* **No Deletions**: To maintain a complete historical audit of library usage and financial records, the system uses status-based management instead of `DELETE` operations.
* **Error Handling**: A global middleware catches Prisma and Business Logic errors, returning standardized JSON responses to the client.
