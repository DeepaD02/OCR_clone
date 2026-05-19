const db = require("../config/db");
const ExcelJS = require("exceljs");

// exports.viewUsers = (req, res) => {
//   const selectsql = "SELECT * from users";
//   db.query(selectsql, (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err });
//     }
//     console.log(result);
//     res.json(result);
//   });
// };

// VIEW USERS WITH PAGINATION
exports.viewUsers = (req, res) => {
  // QUERY PARAMS
  const page = Number(req.query.page) || 1;

  const perPage = Number(req.query.perPage) || 10;

  // OFFSET
  const offset = (page - 1) * perPage;

  // TOTAL COUNT
  const countSql = `
    SELECT COUNT(*) AS total
    FROM users
  `;

  db.query(countSql, (countErr, countResult) => {
    if (countErr) {
      return res.status(500).json({
        error: countErr,
      });
    }

    const total = countResult[0].total;

    // MAIN QUERY
    const sql = `
      SELECT *
      FROM users
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `;

    db.query(sql, [perPage, offset], (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      res.json({
        success: true,

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

exports.addUser = (req, res) => {
  const { name, email, role, employeeId, branch, wfh } = req.body;
  const nameValue = name.trim();
  const emailValue = email.trim();
  const roleValue = role.trim();
  const employeeIdValue = employeeId.trim();
  const branchValue = branch.trim();

  // convert Yes/No → 1/0 for MySQL boolean
  const wfhValue = wfh === "Yes" ? "WFH" : "Office";

  const sql =
    "INSERT INTO users (name,email,role,employeeId,branch,wfh) VALUES (?,?,?,?,?,?)";

  db.query(
    sql,
    [nameValue, emailValue, roleValue, employeeIdValue, branchValue, wfhValue],
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
};

exports.editUser = (req, res) => {
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
};

exports.deleteUser = (req, res) => {
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
};

exports.filterUsers = (req, res) => {
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
};

// EXPORT USERS
exports.exportUsers = (req, res) => {
  const sql = `
SELECT 
  id,
  name,
  email,
  role,
  employeeId,
  branch,
  wfh
FROM users
ORDER BY id DESC
`;
  db.query(sql, async (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "No users found to export." });
    }

    // FORMAT DATA
    const data = result.map((item, index) => ({
      sno: index + 1,
      name: item.name,
      email: item.email,
      role: item.role,
      employeeId: item.employeeId,
      branch: item.branch,
      wfh:
        item.wfh === "WFH" || item.wfh === "Work From Home"
          ? "Work From Home"
          : "Work From Office",
      reports: item.reports,
      createdAt: new Date(item.created_at).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));

    // CREATE WORKBOOK
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // COLUMNS
    worksheet.columns = [
      { header: "S.No", key: "sno", width: 10 },
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Role", key: "role", width: 20 },
      { header: "Employee ID", key: "employeeId", width: 20 },
      { header: "Branch", key: "branch", width: 20 },
      { header: "Work Mode", key: "wfh", width: 15 },
      { header: "Reports", key: "reports", width: 15 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    // ADD ROWS
    worksheet.addRows(data);

    // RESPONSE HEADERS
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

    // CREATE BUFFER
    const buffer = await workbook.xlsx.writeBuffer();

    // SEND BUFFER
    res.end(buffer);
  });
};
