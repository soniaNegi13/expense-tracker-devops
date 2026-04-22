const express = require("express");
const { Client } = require("pg");

const app = express();
app.use(express.json());

// DB connection
const client = new Client({
  host: process.env.DB_HOST || "localhost",
  user: "srk",
  password: "1329",
  database: "expense_db",
});

client.connect()
  .then(() => console.log("Connected to DB"))
  .catch(err => console.error("DB connection error", err));


// Get all expenses
app.get("/expenses", async (req, res) => {
  const result = await client.query("SELECT * FROM expenses");
  res.json(result.rows);
});

// Add expense
app.post("/expenses", async (req, res) => {
  const { name, amount } = req.body;

  const result = await client.query(
    "INSERT INTO expenses(name, amount) VALUES($1, $2) RETURNING *",
    [name, amount]
  );

  res.status(201).json(result.rows[0]);
});

// Health check
app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
