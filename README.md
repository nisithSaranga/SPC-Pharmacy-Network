# 💊 PharmacyApp — Pharmacy Management System

A full-stack pharmacy management system for handling drugs, orders, pharmacies and suppliers.
Built with a **React (Vite)** frontend and an **ASP.NET Core 8** REST API backed by **SQL Server** via **Entity Framework Core**.

> Academic project. Branding and logo are placeholders and are not affiliated with or endorsed by any real organisation.

---

## 🛠️ Tech stack

| Layer | Tech |
|---|---|
| **Frontend** | React 19 · Vite 7 · React Router 7 · Lucide icons · plain CSS per page |
| **Backend** | C# · ASP.NET Core 8 Web API |
| **Data** | Entity Framework Core 8 (code-first migrations) · SQL Server |
| **API docs** | Swagger / OpenAPI (Swashbuckle) |

---

## ✨ Features

**Admin**
- Dashboard with quick access to suppliers, inventory, orders and the pharmacy network
- Inventory management — add drugs, view stock in a table, multi-select delete
- Pharmacy network — register pharmacies, update details, mark integration status
- Supplier registration
- Order placement with automatic stock deduction

**User**
- Separate user dashboard with role-based routing

---

## 📡 API endpoints

### Auth — `api/auth`
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Validates credentials, returns token, username and role |

### Drugs — `api/drugs`
| Method | Route | Description |
|---|---|---|
| GET | `/api/drugs` | List all drugs |
| GET | `/api/drugs/{id}` | Get a drug by id |
| POST | `/api/drugs` | Create a drug |
| PUT | `/api/drugs/{id}` | Update name, quantity and price |
| DELETE | `/api/drugs/{id}` | Delete a drug |

### Orders — `api/orders`
| Method | Route | Description |
|---|---|---|
| GET | `/api/orders` | List all orders |
| POST | `/api/orders` | Place an order — checks stock, decrements drug quantity, stamps the order date |

### Pharmacies — `api/pharmacies`
| Method | Route | Description |
|---|---|---|
| GET | `/api/pharmacies` | List all pharmacies |
| GET | `/api/pharmacies/{id}` | Get a pharmacy by id |
| POST | `/api/pharmacies` | Create a pharmacy |
| PUT | `/api/pharmacies/{id}` | Update all fields |
| DELETE | `/api/pharmacies/{id}` | Delete a pharmacy |
| PATCH | `/api/pharmacies/{id}/connect` | Set integration status to `Connected` |

### Suppliers — `api/suppliers`
| Method | Route | Description |
|---|---|---|
| GET | `/api/suppliers` | List all suppliers |
| GET | `/api/suppliers/{id}` | Get a supplier by id |
| POST | `/api/suppliers` | Register a supplier |
| PUT | `/api/suppliers/{id}` | Update supplier details |
| DELETE | `/api/suppliers/{id}` | Delete a supplier |

All endpoints are browsable through Swagger UI when the API runs in Development.

---

## 🗂️ Data model

| Entity | Fields |
|---|---|
| **Drug** | `Id`, `Name`, `Quantity`, `Price` |
| **Order** | `Id`, `DrugId`, `Drug`, `Quantity`, `PharmacyName`, `OrderDate`, `Status` |
| **Pharmacy** | `Id`, `Name`, `Type`, `Address`, `Phone`, `Email`, `Manager`, `Status`, `MonthlyOrders`, `Revenue`, `IntegrationStatus` |
| **Supplier** | `Id`, `Name`, `Address`, `Email`, `Phone`, `ContactPerson` |
| **User** | `Id`, `Username`, `Password`, `Role` |

Six EF Core migrations are committed under `pharmacyapp.server/Migrations/`.

---

## 🚀 Getting started

**Prerequisites:** .NET 8 SDK · Node.js 18+ · SQL Server (Express or LocalDB)

```bash
git clone https://github.com/nisithSaranga/PharmacyApp.git
cd PharmacyApp
```

### 1. Backend

```bash
cd pharmacyapp.server
```

Set the connection string in `appsettings.json` to point at your SQL Server instance. The committed default uses Windows Authentication against a local SQL Server Express instance:

```json
"DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=PharmacyDB;Trusted_Connection=True;TrustServerCertificate=True;"
```

For LocalDB, use `Server=(localdb)\\MSSQLLocalDB;` instead.

Create the database from the migrations and run the API:

```bash
dotnet tool install --global dotnet-ef   # once, if not already installed
dotnet ef database update
dotnet run
```

The API runs at `https://localhost:7216` (Swagger UI at `/swagger`).

### 2. Frontend

```bash
cd ../pharmacyapp.client
npm install
npm run dev
```

The client runs at `https://localhost:5173` and expects the API at `https://localhost:7216`.

> The Vite dev server is configured for HTTPS and looks for `localhost.pem` and `localhost-key.pem` in the client folder. These are not committed — generate your own with [mkcert](https://github.com/FiloSottile/mkcert): `mkcert localhost`.

### Demo accounts

Two accounts are seeded automatically on first run if the `Users` table is empty:

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | admin |
| `nisith` | `nisith123` | user |

These are local development credentials only.

---

## 📁 Project structure

```
PharmacyApp/
├── pharmacyapp.client/        React + Vite frontend
│   └── src/
│       ├── pages/             Dashboard, Inventory, Login, Orders, Suppliers, Pharmacies
│       └── components/
└── pharmacyapp.server/        ASP.NET Core Web API
    ├── Controllers/
    ├── Models/
    ├── Data/
    └── Migrations/
```

---

Built by **Nisith Saranga**