const mysql = require("mysql2");
const { faker } = require("@faker-js/faker");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root@123",
  database: "local_db",
});

db.connect((err) => {
  if (err) {
    console.log("DB connection failed:", err);
    return;
  }
  console.log("Connected to MySQL");

  generateClients();
});

// function to generate data
function generateClients() {
  const count = 10;

  const clients = [];

  for (let i = 0; i < count; i++) {
    clients.push([
      faker.person.fullName(),
      faker.string.alphanumeric(6).toUpperCase(),
    ]);
  }

  const sql = "INSERT INTO clients (client_name, client_code) VALUES ?";

  db.query(sql, [clients], (err, result) => {
    if (err) {
      console.log("Insert error:", err);
    } else {
      console.log(`${count} clients inserted successfully`);
    }

    db.end();
  });
}
