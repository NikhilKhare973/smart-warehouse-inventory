# 📦 Smart Warehouse Inventory Management System

A **full-stack Smart Warehouse Inventory Management System (Mini ERP)** built to help businesses efficiently manage inventory, track stock movement in real time, automate low-stock alerts, process purchase requests, and maintain a secure audit trail of every inventory transaction.

> **Digital Brain for a Physical Warehouse**
![Dashboard](/screenshots/1.png)
---

## 🚀 Elevator Pitch

This project is a **Mini ERP** focused on warehouse and inventory management.

It enables businesses to:

- 📊 Monitor inventory levels in real time
- ⚠️ Automatically detect low stock
- 🛒 Create and manage purchase requests
- 📝 Maintain immutable audit logs for every stock movement
- 🔐 Secure all sensitive operations with authentication and authorization

### Real-World Example

When an Amazon warehouse employee scans a product before shipping, the inventory is automatically updated, the action is recorded, and if the stock falls below a safe threshold, the system alerts the manager to reorder the item.

This project simulates that workflow.
![Dashboard](/screenshots/2.png)
---

# ✨ Features

- 🔐 Secure JWT Authentication
- 👤 Role-Based Authorization (Admin/User)
- 📦 Product & Inventory Management
- 🏷️ Product Categories
- 📉 Automatic Low Stock Detection
- 🛒 Purchase Request Workflow
- 📝 Complete Audit Logging
- 📊 Interactive Dashboard with Charts
- 🔍 Product Search & Filtering
- 📱 Responsive UI

![Dashboard](/screenshots/3.png)
---

# 🛠️ Tech Stack

## Frontend

- React.js
- Tailwind CSS
- Axios
- Recharts

## Backend

- Node.js
- Express.js
- REST API

## Database

- PostgreSQL
- Prisma ORM

## Authentication & Security

- JWT (JSON Web Tokens)
- Bcrypt Password Hashing

## Deployment

- Render (Frontend & Backend)
- Neon PostgreSQL
![Dashboard](/screenshots/4.png)
![Dashboard](/screenshots/5.png)
---

# 🏗️ System Architecture

```text
                User
                  │
                  ▼
        React.js Frontend
                  │
          Axios HTTP Requests
                  │
                  ▼
        Express.js REST API
                  │
        JWT Authentication
                  │
                  ▼
           Prisma ORM
                  │
                  ▼
        PostgreSQL Database
```
![Dashboard](/screenshots/6.png)

---

# 📂 Project Structure

```text
smart-warehouse/
│
├── client/                 # React Frontend
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── server/                 # Express Backend
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── prisma/
│   └── utils/
│
└── README.md
```
![Dashboard](/screenshots/7.png)
---

# 🔄 Application Workflow

1. User logs into the system.
2. JWT token is generated after successful authentication.
3. User performs inventory operations.
4. Frontend sends API requests using Axios.
5. Backend validates JWT and user permissions.
6. Prisma updates the PostgreSQL database.
7. Audit logs are automatically created.
8. Updated information is returned to the frontend.

---

# 📊 Dashboard

The dashboard provides real-time warehouse insights, including:

- Total Products
- Available Inventory
- Low Stock Products
- Recent Inventory Activity
- Purchase Requests
- Interactive Charts
![Dashboard](/screenshots/8.png)
---

# 🔒 Security Features

- JWT Authentication
- Password Hashing using Bcrypt
- Protected API Routes
- Role-Based Access Control
- Secure Environment Variables
- UUID-based Database IDs

---

# 🗄️ Database Design

The application uses a relational PostgreSQL database.

### Main Entities

- Users
- Products
- Categories
- Inventory
- Purchase Requests
- Audit Logs

### Relationships

- One Category → Many Products
- One Product → Many Audit Logs
- One User → Many Purchase Requests

---

# 📸 Screenshots

## Dashboard

> **Add Screenshot Here**

```
[Dashboard](/screenshots/8.png)
```

![Dashboard](/screenshots/8.png)

---

## Inventory Management

> **Add Screenshot Here**


![Dashboard](/screenshots/9.png)


---

## Product Management

> **Add Screenshot Here**


![Dashboard](/screenshots/10.png)


---

## Purchase Requests

> **Add Screenshot Here**


![Dashboard](/screenshots/11.png)


---

## Audit Logs

> **Add Screenshot Here**


![Dashboard](/screenshots/12.png)


---

# ⚙️ Installation

## Clone the Repository

```bash
git clone https://github.com/your-username/smart-warehouse.git
```

```bash
cd smart-warehouse
```

## Install Dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd server
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the server directory.

```env
DATABASE_URL=your_database_url

JWT_SECRET=your_secret_key

PORT=5000
```

---

# ▶️ Run the Project

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm start
```

---

# 🚀 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Render |
| Backend | Render |
| Database | Neon PostgreSQL |

---

# 📚 Concepts Demonstrated

- REST API Development
- Authentication & Authorization
- CRUD Operations
- Relational Database Design
- Prisma ORM
- JWT Authentication
- Password Hashing
- API Security
- Dashboard Analytics
- Enterprise Inventory Workflow
- Cloud Deployment
- Environment Variable Management

---

# 💡 Key Learnings

Through this project, I gained practical experience in:

- Designing relational databases using Prisma ORM
- Building secure REST APIs with Express.js
- Implementing JWT authentication and role-based authorization
- Managing inventory workflows in a real-world business scenario
- Creating interactive dashboards using Recharts
- Deploying full-stack applications on Render
- Connecting cloud applications with Neon PostgreSQL
- Debugging cloud deployment issues, environment variables, and database cold-start delays

---

# 🔮 Future Improvements

- Barcode Scanner Integration
- QR Code Support
- Email Notifications
- Multi-Warehouse Support
- Supplier Management
- Export Reports (PDF/Excel)
- Real-Time Notifications
- Dark Mode
- Inventory Forecasting
- Mobile Responsive PWA

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to fork the repository and submit a Pull Request.

---

# 📄 License

This project is licensed under the MIT License.

---

# 📸 How to add your screenshots
Create an assets folder in your repository:
```text
smart-warehouse/
│
├── assets/
│   ├── dashboard.png
│   ├── inventory.png
│   ├── products.png
│   ├── purchase-requests.png
│   └── audit-logs.png
│
└── README.md
```
Then replace the placeholder code blocks with Markdown image links, for example:
## Dashboard

![Dashboard](assets/dashboard.png)

---

# 👨‍💻 Author

**Your Name**

GitHub: [https://github.com/Nikhil-Khare](https://github.com/NikhilKhare973?tab=repositories)

LinkedIn: [https://linkedin.com/Nikhil Khare](https://www.linkedin.com/in/nikhilkhare973/)

---

⭐ If you found this project helpful, don't forget to **Star** the repository!


<!-- <img src="/screenshots/1.png"/>
<img src="/screenshots/2.png"/>
<img src="/screenshots/3.png"/>
<img src="/screenshots/4.png"/> -->
