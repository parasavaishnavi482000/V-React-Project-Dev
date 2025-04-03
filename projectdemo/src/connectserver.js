// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const bcrypt = require("bcrypt");
 
// const app = express();


// app.use(cors());
// app.use(bodyParser.json());
 

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Vaishnavi@123",
//   database: "office",
// });
 
// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database:", err);
//     return;
//   }
//   console.log("Connected to the MySQL database.");
// });
 

// app.post("/api/Signup", async (req, res) => {
//   const { name, username, email, password, phone } = req.body;
 
//   if (!name || !username || !email || !password || !phone) {
//     return res.status(400).json({ message: "All fields are required" });
//   }
 
//   try {
   
//     const checkUserSql = "SELECT * FROM login WHERE email = ? OR username = ?";
//     db.query(checkUserSql, [email, username], async (err, results) => {
//       if (err) return res.status(500).json({ error: "Error checking user" });
//       if (results.length > 0) return res.status(400).json({ message: "User already exists" });
 
     
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const sql = "INSERT INTO login (name, username, email, password, phone) VALUES (?, ?, ?, ?, ?)";
//       const values = [name, username, email, hashedPassword, phone];
 
//       db.query(sql, values, (err, result) => {
//         if (err) {
//           console.error("Error inserting data:", err);
//           return res.status(500).send(err);
//         }
//         res.status(200).json({ message: "Signup successful!" });
//       });
//     });
//   } catch (error) {
//     console.error("Error during Signup:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
 

// app.post("/api/Login", (req, res) => {
//   const { identifier, password } = req.body;
 
//   if (!identifier || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }
 
//   const sql = "SELECT * FROM login WHERE username = ? OR email = ?";
//   db.query(sql, [identifier, identifier], async (err, results) => {
//     if (err) return res.status(500).json({ error: "Internal server error" });
//     if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });
 
//     const user = results[0];
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (isPasswordValid) {
//       res.status(200).json({ message: "Login successful!", user });
//     } else {
//       res.status(401).json({ message: "Invalid credentials" });
//     }
//   });
// });
 

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
 

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const app = express();
const PORT = 5000;
const SECRET_KEY = "your_secret_key"; // Replace with a strong secret in production!

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vaishnavi@123",
  database: "office",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// Middleware: Verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Signup Endpoint - Insert User with Hashed Password
app.post("/api/Signup", async (req, res) => {
  const { name, username, email, password, phone } = req.body;

  if (!name || !username || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const checkUserSql = "SELECT * FROM employees WHERE email = ? OR username = ?";
    db.query(checkUserSql, [email, username], async (err, results) => {
      if (err) return res.status(500).json({ error: "Error checking user" });
      if (results.length > 0) return res.status(400).json({ message: "User already exists" });

      // Hash the password and insert
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = "INSERT INTO employees (name, username, email, password, phone) VALUES (?, ?, ?, ?, ?)";
      const values = [name, username, email, hashedPassword, phone];

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error("Error inserting data:", err);
          return res.status(500).send(err);
        }
        res.status(200).json({ message: "Signup successful!" });
      });
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login Endpoint - Verify User Credentials
app.post("/api/Login", (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "SELECT * FROM employees WHERE username = ? OR email = ?";
  db.query(sql, [identifier, identifier], async (err, results) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Generate JWT Token (expires in 24 hours for testing)
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          exp: Math.floor(Date.now() / 1000) + 86400 // Expires in 86400 seconds (24 hours)
        },
        SECRET_KEY
      );
      res.status(200).json({ message: "Login successful!", token, user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

// Protected Route - Test Token Expiration
app.get("/api/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Welcome to the protected route", user: req.user });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});