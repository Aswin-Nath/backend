const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "zohobooks.mysql.database.azure.com",
  user: "sqladmin",
  password: "aswinnath@123",
  database: "faq",
  ssl: {
    rejectUnauthorized: false,
  },
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Route to submit a query
app.post("/add-query", (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Question content is required" });
  }

  const sql = "INSERT INTO query (QuestionContent, isAnswered) VALUES (?, ?)";
  db.query(sql, [question, 0], (err, result) => {
    if (err) {
      console.error("Error inserting query:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Query submitted successfully" });
  });
});

app.get("/queries", (req, res) => {
  const sql = "SELECT * FROM query";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching queries:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

app.post("/respond-query", (req, res) => {
  const { id, answer } = req.body;
  const sql =
    "UPDATE query SET AnswerContent = ?, isAnswered = 1 WHERE id = ?";

  db.query(sql, [answer, id], (err, result) => {
    if (err) {
      console.error("Error updating query:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "Query answered successfully!" });
  });
});

app.post("/add-to-faq", (req, res) => {
  const { question, answer } = req.body;
  const sql = "INSERT INTO faqs (QuestionContent, AnswerContent) VALUES (?, ?)";

  db.query(sql, [question, answer], (err, result) => {
    if (err) {
      console.error("Error adding to FAQ:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "Added to FAQ successfully!" });
  });
});

app.get("/faqs", (req, res) => {
  const sql = "SELECT * FROM faqs";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching FAQs:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

app.delete("/delete-faq/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM faqs WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting FAQ:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "FAQ deleted successfully!" });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
