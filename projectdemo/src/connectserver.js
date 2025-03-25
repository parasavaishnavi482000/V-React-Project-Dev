const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
 
const app = express();

 
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
 
// Signup Endpoint - Insert User with Hashed Password
app.post("/api/Signup", async (req, res) => {
  const { name, username, email, password, phone } = req.body;
 
  if (!name || !username || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }
 
  try {
    // Check if user already exists
    const checkUserSql = "SELECT * FROM login WHERE email = ? OR username = ?";
    db.query(checkUserSql, [email, username], async (err, results) => {
      if (err) return res.status(500).json({ error: "Error checking user" });
      if (results.length > 0) return res.status(400).json({ message: "User already exists" });
 
      // Hash the password and insert
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = "INSERT INTO login (name, username, email, password, phone) VALUES (?, ?, ?, ?, ?)";
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
    console.error("Error during Signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
 
// login Endpoint - Verify User Credentials
app.post("/api/Login", (req, res) => {
  const { identifier, password } = req.body;
 
  if (!identifier || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
 
  const sql = "SELECT * FROM login WHERE username = ? OR email = ?";
  db.query(sql, [identifier, identifier], async (err, results) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });
 
    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.status(200).json({ message: "Login successful!", user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});
 
// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
 