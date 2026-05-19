const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const ExcelJS = require("exceljs");

const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());

const PORT = 3000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root@123",
  database: "local_db",
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("MySQL Connected");
  }
});

router.get("/users", (req, res) => {
  const selectsql = "SELECT * from users";
  db.query(selectsql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    console.log(result);
    res.json(result);
  });
});

router.post("/users", (req, res) => {
  const { name, email, role, employeeId, branch, wfh } = req.body;

  // convert Yes/No → 1/0 for MySQL boolean
  const wfhValue = wfh === "Yes" ? "WFH" : "Office";

  const sql =
    "INSERT INTO users (name,email,role,employeeId,branch,wfh) VALUES (?,?,?,?,?,?)";

  db.query(
    sql,
    [name, email, role, employeeId, branch, wfhValue],
    (err, result) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({
          success: false,
          message: "Error inserting data",
          error: err,
        });
      }
      res.status(201).json({
        success: true,
        message: "User added successfully",
      });
    },
  );
});

router.patch("/users/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // get keys and values
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const setClause = fields.map((field) => `${field} = ?`).join(", ");

  const sql = `UPDATE users SET ${setClause} WHERE id = ?`;

  db.query(sql, [...values, id], (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ error: err });
    }

    res.json({
      success: true,
      message: "User updated (PATCH)",
    });
  });
});

router.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const deletesql = "delete from users where id = ?";

  db.query(deletesql, [id], (err, result) => {
    if (err) {
      console.log("DB ERROR", err);
      return res.status(500).json({ success: false, message: "Delete failed" });
    }
    res.json({
      success: true,
      message: "successfully delete",
    });
  });
});

router.get("/users/filter", (req, res) => {
  const { role, branch, wfh, search } = req.query;

  let sql = "SELECT * FROM users WHERE 1=1";
  let values = [];

  //search
  // search
  if (search && search.trim() !== "") {
    const cleanSearch = search.trim().toLowerCase();
    sql += " AND (LOWER(name) LIKE ? OR LOWER(role) LIKE ?)";
    values.push(`%${cleanSearch}%`, `%${cleanSearch}%`);
  }

  // filters

  if (role && role !== "All roles") {
    sql += " AND role = ?";
    values.push(role);
  }

  if (branch && branch !== "All branches") {
    sql += " AND branch = ?";
    values.push(branch);
  }

  if (wfh && wfh !== "All modes") {
    const mode = wfh === "WFH" ? "Work From Home" : "Work From Office";
    sql += " AND wfh = ?";
    values.push(mode);
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }

    res.json(result);
  });
});

// CLIENT PAGE
router.post("/clients", (req, res) => {
  const { clientName, clientCode } = req.body;

  const sql = "INSERT INTO clients (client_name, client_code) VALUES (?, ?)";

  db.query(sql, [clientName, clientCode], (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ error: err });
    }

    res.json({
      success: true,
      message: "Client added successfully",
    });
  });
});

router.get("/clients", (req, res) => {
  const sql = `
    SELECT 
      id,
      client_name AS clientName,
      client_code AS clientCode,
      CREATED_AT AS createdAt
    FROM clients
    ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.json(result);
  });
});

router.patch("/clients/:id", (req, res) => {
  const { id } = req.params;
  const { clientName, clientCode } = req.body;

  const sql = "UPDATE clients SET client_name=?, client_code=? WHERE id=?";

  db.query(sql, [clientName, clientCode, id], (err) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ error: err });
    }

    res.json({
      success: true,
      message: "Client updated successfully",
    });
  });
});

router.delete("/clients/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM clients WHERE id=?", [id], (err) => {
    if (err) {
      console.log("DB ERROR:", err);

      return res.status(500).json({ error: err });
    }

    res.json({ success: true });
  });
});

// Client Export

router.get("/clients/export", (req, res) => {
  const sql = `
    SELECT 
      id,
      client_name AS clientName,
      client_code AS clientCode,
      CREATED_AT AS createdAt
    FROM clients
    ORDER BY id DESC
  `;

  db.query(sql, async (err, result) => {
    if (err) return res.status(500).json({ error: err });

    // ✅ ADD S.NO HERE
    const data = result.map((item, index) => ({
      sno: index + 1,
      clientName: item.clientName,
      clientCode: item.clientCode,
      createdAt: item.createdAt,
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Clients");

    // ✅ COLUMNS (WITH S.NO)
    worksheet.columns = [
      { header: "S.No", key: "sno", width: 10 },
      { header: "Client Name", key: "clientName", width: 30 },
      { header: "Client Code", key: "clientCode", width: 20 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    worksheet.addRows(data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", "attachment; filename=clients.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  });
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
