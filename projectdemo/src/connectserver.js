// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");


// const app = express();
// const PORT = 5000;
// const SECRET_KEY = "your_secret_key"; // Replace with a strong secret in production!

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // MySQL Connection
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

// // Middleware: Verify JWT Token
// const verifyToken = (req, res, next) => {
//   const token = req.headers["authorization"];
//   if (!token) return res.status(403).json({ message: "No token provided" });

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error("JWT Error:", error.message);
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// // Signup Endpoint - Insert User with Hashed Password
// app.post("/api/signup", async (req, res) => {
//   const { name, username, email, password, phone } = req.body;

//   if (!name || !username || !email || !password || !phone) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     // Check if user already exists
//     const checkUserSql = "SELECT * FROM employees WHERE email = ? OR username = ?";
//     db.query(checkUserSql, [email, username], async (err, results) => {
//       if (err) return res.status(500).json({ error: "Error checking user" });
//       if (results.length > 0) return res.status(400).json({ message: "User already exists" });

//       // Hash the password and insert
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const sql = "INSERT INTO employees (name, username, email, password, phone) VALUES (?, ?, ?, ?, ?)";
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
//     console.error("Error during signup:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Login Endpoint - Verify User Credentials
// app.post("/api/login", (req, res) => {
//   const { identifier, password } = req.body;

//   if (!identifier || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   const sql = "SELECT * FROM employees WHERE username = ? OR email = ?";
//   db.query(sql, [identifier, identifier], async (err, results) => {
//     if (err) return res.status(500).json({ error: "Internal server error" });
//     if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

//     const user = results[0];
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (isPasswordValid) {
//       // Generate JWT Token (expires in 24 hours for testing)
//       const token = jwt.sign(
//         { 
//           id: user.id, 
//           username: user.username, 
//           email: user.email, 
//           exp: Math.floor(Date.now() / 1000) + 86400 // Expires in 86400 seconds (24 hours)
//         },
//         SECRET_KEY
//       );
//       res.status(200).json({ message: "Login successful!", token, user });
//     } else {
//       res.status(401).json({ message: "Invalid credentials" });
//     }
//   });
// });

// // Protected Route - Test Token Expiration
// app.get("/api/protected", verifyToken, (req, res) => {
//   res.status(200).json({ message: "Welcome to the protected route", user: req.user });
// });

// // Start Server
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
const SECRET_KEY = "your_secret_key";
 
// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
 
// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vaishnavi@123",
  database: "office"
});
 
db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
});
 
// Signup Endpoint
app.post("/api/signup", async (req, res) => {
  const { name, username, email, password, phone } = req.body;
 
  console.log("Signup Request:", req.body);
 
  if (!name || !username || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }
 
  try {
    const checkUserSql = "SELECT * FROM employees WHERE email = ? OR phone = ?";
    db.query(checkUserSql, [email, phone], async (err, results) => {
      if (err) {
        console.error("Error checking user:", err);
        return res.status(500).json({ message: "Server error" });
      }
      if (results.length > 0) {
        return res.status(409).json({ message: "User already exists" });
      }
 
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO employees (name, username, email, password, phone) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [name, username, email, hashedPassword, phone], (err) => {
          if (err) {
            console.error("Insert Error:", err);
            return res.status(500).json({ message: "Server error" });
          }
          res.status(201).json({ message: "Signup successful!" });
        });
      } catch (hashErr) {
        console.error("Password Hashing Error:", hashErr);
        return res.status(500).json({ message: "Server error" });
      }
    });
  } catch (error) {
    console.error("Catch Block Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
 
// Login Endpoint
app.post("/api/login", (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const sql = "SELECT * FROM employees WHERE username = ? OR email = ?";
  db.query(sql, [identifier, identifier], async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });
    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET_KEY, { expiresIn: "24h" });
      res.status(200).json({ message: "Login successful!", token, user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});
 
// Get Roles
app.get("/roles", (req, res) => {
  db.query("SELECT * FROM roles", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});
 
// Add Role
app.post("/roles", (req, res) => {
  const { roleName } = req.body;
  db.query("INSERT INTO roles (roleName) VALUES (?)", [roleName], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Role added successfully", roleId: results.insertId });
  });
});
 
// Delete Role
app.delete("/roles/:id", (req, res) => {
  const roleId = req.params.id;
  db.query("DELETE FROM roles WHERE roleID = ?", [roleId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Role deleted successfully" });
  });
});
 
// Get Departments
app.get("/departments", (req, res) => {
  db.query("SELECT * FROM departments", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});
 
// Add Department
app.post("/departments", (req, res) => {
  const { departmentName } = req.body;
  db.query("INSERT INTO departments (departmentName) VALUES (?)", [departmentName], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Department added successfully", departmentId: results.insertId });
  });
});
 
// Delete Department
app.delete("/departments/:id", (req, res) => {
  const departmentId = req.params.id;
  db.query("DELETE FROM departments WHERE departmentID = ?", [departmentId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Department deleted successfully" });
  });
});
 
// Get Role Assignments from employees table with joined data
app.get("/role-assign", (req, res) => {
  db.query(
    `SELECT
      employees.id,
      employees.username,
      employees.email,
      roles.roleName,
      departments.departmentName AS department
    FROM employees
    LEFT JOIN roles ON employees.roleName = roles.roleName
    LEFT JOIN departments ON employees.department = departments.departmentName`,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});
 
// Update Role and Department in employees table
app.put("/role-assign/:id", (req, res) => {
  const { roleName, department } = req.body;
  const employeeId = req.params.id;
  db.query("UPDATE employees SET roleName = ?, department = ? WHERE id = ?", [roleName, department, employeeId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Employee role updated successfully" });
  });
});
 
// 404 Error Handling
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});
 
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
 