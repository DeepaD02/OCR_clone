const db = require("../config/db");
const ExcelJS = require("exceljs");

// GET PROJECTS
// GET PROJECTS WITH PAGINATION
exports.projectsView = (req, res) => {
  // QUERY PARAMS
  const page = Number(req.query.page) || 1;

  const perPage = Number(req.query.perPage) || 10;

  // OFFSET
  const offset = (page - 1) * perPage;

  // TOTAL COUNT
  const countSql = `
    SELECT COUNT(*) AS total
    FROM projects
  `;

  db.query(countSql, (countErr, countResult) => {
    if (countErr) {
      return res.status(500).json({
        error: countErr.message,
      });
    }

    const total = countResult[0].total;

    // MAIN QUERY
    const sql = `
      SELECT
        id,
        project_name AS projectName,
        project_code AS projectCode,
        client AS clientName,
        create_at AS createdAt
      FROM projects
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `;

    db.query(sql, [perPage, offset], (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.status(200).json({
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

// ADD PROJECT
exports.addProject = (req, res) => {
  const { clientName, projectName, projectCode } = req.body;

  if (!clientName || !projectName || !projectCode) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const sql = `
    INSERT INTO projects
    (
      client,
      project_name,
      project_code
    )
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [clientName, projectName.trim(), projectCode.trim()],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Project added successfully",
        id: result.insertId,
      });
    },
  );
};

// Edit Project
exports.editProject = (req, res) => {
  const { id } = req.params;
  const { clientName, projectName, projectCode } = req.body;
  const sql = `UPDATE projects SET client = ?,project_name = ?,project_code = ? where  id = ?`;

  db.query(sql, [clientName, projectName, projectCode, id], (err) => {
    if (err) {
      console.log("DB error", err);
      return res.status(500).json({ error: err });
    }
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
    });
  });
};

// Delete Project
exports.deleteProject = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE from projects where id = ?`;

  db.query(sql, [id], (err) => {
    if (err) {
      console.log("DB ERROR", err);
      res.status(500).json({ ERROR: err });
    }
    res.status(200).json({
      success: true,
      message: "Project Deleted successfully",
    });
  });
};

// ExportProject

// Export Projects
exports.exportProjects = (req, res) => {
  const sql = `
    SELECT 
      id,
      project_name AS projectName,
      project_code AS projectCode,
      client AS clientName,
      create_at AS createdAt
    FROM projects
    ORDER BY id ASC
  `;

  db.query(sql, async (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Projects");

    // COLUMNS
    worksheet.columns = [
      {
        header: "ID",
        key: "id",
        width: 10,
      },
      {
        header: "Project Name",
        key: "projectName",
        width: 30,
      },
      {
        header: "Project Code",
        key: "projectCode",
        width: 25,
      },
      {
        header: "Client",
        key: "clientName",
        width: 25,
      },
      {
        header: "Created At",
        key: "createdAt",
        width: 30,
      },
    ];

    // ROWS
    result.forEach((item) => {
      worksheet.addRow({
        id: item.id,
        projectName: item.projectName,
        projectCode: item.projectCode,
        clientName: item.clientName,
        createdAt: new Date(item.createdAt).toLocaleString("en-IN"),
      });
    });

    // RESPONSE HEADERS
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", "attachment; filename=projects.xlsx");

    await workbook.xlsx.write(res);

    res.end();
  });
};
