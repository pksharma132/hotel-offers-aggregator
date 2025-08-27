# 🏨 Hotel Offers Aggregator

## 📌 Description
The **Hotel Offers Aggregator** is a backend service that fetches hotel data from multiple suppliers, deduplicates overlapping hotels, and selects the best-priced offer for each hotel.  
It uses **Temporal.io** for workflow orchestration and **Redis** for caching, with results exposed through a simple Express API.  
The project is fully containerized with **Docker Compose** for easy local setup.

---

## ⚡ Prerequisites

Before you start, make sure you have:

- 🐳 [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/install/) installed
- 🟢 [Node.js](https://nodejs.org/) (v18+ recommended)
- 📦 [npm](https://www.npmjs.com/) (comes with Node.js)
- (Optional) [Postman](https://www.postman.com/downloads/) or [Hoppscotch](https://hoppscotch.io/) for API testing

---

## 🛠️ Tech Stack
- **Node.js (TypeScript)**
- **Express.js**
- **Temporal.io**
- **Redis**
- **Docker & Docker Compose**

---

## 🚀 Getting Started

#### 1️⃣ Clone the repository
```bash
https://github.com/pksharma132/hotel-offers-aggregator
```
```bash
cd hotel-offers-aggregator
```

#### 2️⃣ Start services with Docker Compose

```bash
# builds images and starts Temporal (with Postgres), Redis, server and worker
docker-compose up --build
```

#### 3️⃣ Verify services
- 🕸️ Temporal Web UI: `http://localhost:8080`
- 🛎️ API Server: `http://localhost:3000`
- 🗄️ Redis: `localhost:6379`

#### 4️⃣ (Optional) Run server & worker locally (no Docker)

Open **two terminals**:

**Terminal 1:**  
```bash
# build TypeScript
npm run build

# run server
npm run server
```

**Terminal 2:**  
```bash
# run worker
npm run worker
```

---

#### 🧪 API Testing

You can quickly test your Hotel Offers Aggregator API using the provided Postman collection!

#### 🚀 Import the Collection

#### Hoppscotch
1. Go to [Hoppscotch](https://hoppscotch.io/).
2. Click **Collections** in the sidebar.
3. Click **Import** → **Postman Collection**.
4. Upload or paste the contents of  
   `postman/Hotel Offers Aggregator.json`.
5. Start running requests and see results instantly!

#### Postman
1. Open Postman.
2. Click **Import** (top left).
3. Select **File** and choose  
   `postman/Hotel Offers Aggregator.json`.
4. The collection appears—run the requests and view responses!

---

✨ All endpoints, parameters, and test scripts are ready to go.  
Just import and start exploring