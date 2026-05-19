const db = require("../config/db");
const ExcelJS = require("exceljs");

// VIEW CLIENTS
exports.viewClients = (req, res) => {
  const page = Number(req.query.page) || 1;
  const perPage = Number(req.query.perPage) || 10;

  const offset = (page - 1) * perPage;
  const countSql = `SELECT COUNT(*) AS total FROM clients`;
  db.query(countSql, (countErr, countResult) => {
    if (countErr) {
      return res.status(500).json({ error: countErr });
    }
    const total = countResult[0].total;
    const sql = `
      SELECT 
        id,
        client_name AS clientName,
        client_code AS clientCode,
        CREATED_AT AS createdAt
      FROM clients
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `;

    db.query(sql, [perPage, offset], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.json({
        status: true,
        data: result,
        pagination: {
          total,
          currentPage: page,
          perPage,
          totalPages: Math.ceil(total / perPage),
        },
      });
    });
  });
};

// ADD CLIENT
exports.addClient = (req, res) => {
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
};

// EDIT CLIENT
exports.editClient = (req, res) => {
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
};

// DELETE CLIENT
exports.deleteClient = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM clients WHERE id=?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.log("DB ERROR:", err);

      return res.status(500).json({ error: err });
    }

    res.json({
      success: true,
      message: "Client deleted successfully",
    });
  });
};

// EXPORT CLIENTS
exports.exportClients = (req, res) => {
  const sql = `
    SELECT 
      id,
      client_name,
      client_code,
      CREATED_AT
    FROM clients
    ORDER BY id ASC
  `;

  db.query(sql, async (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Clients");

    // COLUMNS
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Client Name", key: "clientName", width: 30 },
      { header: "Client Code", key: "clientCode", width: 25 },
      { header: "Created At", key: "createdAt", width: 30 },
    ];

    // ROWS
    result.forEach((item) => {
      worksheet.addRow({
        id: item.id,
        clientName: item.client_name,
        clientCode: item.client_code,
        createdAt: new Date(item.CREATED_AT).toLocaleString("en-IN"),
      });
    });

    // RESPONSE HEADERS
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", "attachment; filename=clients.xlsx");

    await workbook.xlsx.write(res);

    res.end();
  });
};
