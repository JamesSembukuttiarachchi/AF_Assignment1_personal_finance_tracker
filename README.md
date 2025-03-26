# 💰 Personal Finance Tracker API

A **finance management system** built with **Node.js, Express, MongoDB, and JWT authentication**.  
It allows users to **manage transactions, set budgets, track goals, and receive notifications**.

---

## 📌 Features
✅ **User Authentication** – Register, Login, JWT-based security <br>
✅ **Multi-Currency Support** – Currency conversion using Frankfurter API <br>
✅ **Recurring Transactions** – Automate future transactions <br>
✅ **Budget Management** – Track spending by category <br>
✅ **Financial Goals** – Set savings goals and track progress <br>
✅ **Notifications** – Get alerts for upcoming transactions and budget limits <br>
✅ **Reports & Analytics** – Generate financial summaries <br>
✅ **Full Test Coverage** – Unit & Integration tests with Jest & Supertest

---

## **🛠 Tech Stack**
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Authentication:** JWT (JSON Web Tokens), bcryptjs  
- **Testing:** Jest, Supertest, MongoMemoryServer  
- **Logging:** Winston, Morgan  
- **Background Jobs:** Node-cron (for scheduled tasks)  
- **Currency Conversion:** Frankfurter API  

---

## **🚀 Project Setup**
### **1️⃣ Clone the Repository**
```sh
git clone [https://github.com/your-username/project-rakindum.git](https://github.com/SE1020-IT2070-OOP-DSA-25/project-JamesSembukuttiarachchi.git)
cd project-JamesSembukuttiarachchi
cd personal-finance-tracker
```
### **2️⃣ Install Dependencies**
```sh
npm install
```
### **3️⃣ Setup Environment Variables**
- Copy the `.env.example` file to `.env`
```sh
NODE_ENV=development
PORT=
MONGO_URI=your_mongo_db_url
JWT_SECRET=your_jwt_secret
```

### **4️⃣ Start the development server**
```sh
npm start
```

### **5️⃣ Run unit test and integration test**
```sh
npm test
```
