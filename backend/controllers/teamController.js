const db = require("../config/db");

exports.addTeam = async (req, res) => {
  try {
    const { projectHead, project, teamLead } = req.body;

    // VALIDATION
    if (!teamLead || !projectHead) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    // TIMESTAMP
    const timestamp = Date.now().toString();

    // LAST 4 DIGITS
    const last4 = timestamp.slice(-4);

    // REMOVE SPACES FROM TEAM LEAD
    const cleanLead = teamLead.replace(/\s+/g, "");

    // TEAM NAME
    const teamName = `${cleanLead}TEAM${last4}`;

    // SQL QUERY
    const sql = `
      INSERT INTO teams
      (team_name, project,team_lead, project_head)
      VALUES (?,?, ?, ?)
    `;

    db.query(sql, [teamName, project, teamLead, projectHead], (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Team created successfully",
        data: {
          id: result.insertId,
          teamName,
          project,
          projectHead,
          teamLead,
        },
      });
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// GET TEAMS WITH PAGINATION
exports.viewTeam = (req, res) => {
  // QUERY PARAMS
  const page = Number(req.query.page) || 1;

  const perPage = Number(req.query.perPage) || 10;

  // OFFSET
  const offset = (page - 1) * perPage;

  // TOTAL COUNT
  const countSql = `
    SELECT COUNT(*) AS total
    FROM teams
  `;

  db.query(countSql, (countErr, countResult) => {
    if (countErr) {
      return res.status(500).json({
        success: false,
        error: countErr,
      });
    }

    const total = countResult[0].total;

    // MAIN QUERY
    const sql = `
      SELECT
        id,
        team_name AS TeamName,
        project,
        team_lead AS TeamLead,
        project_head AS ProjectHead,
        coders,
        auditors,
        create_at AS CreateAt
      FROM teams
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `;

    db.query(sql, [perPage, offset], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err,
        });
      }

      res.status(200).json({
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

// Edit
exports.editTeam = (req, res) => {
  try {
    const { id } = req.params;

    const { project, teamLead, projectHead } = req.body;

    // VALIDATION
    if (!project || !teamLead || !projectHead) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const sql = `
      UPDATE teams
      SET
        project = ?,
        team_lead = ?,
        project_head = ?
      WHERE id = ?
    `;

    db.query(sql, [project, teamLead, projectHead, id], (err, result) => {
      if (err) {
        console.log("DB ERROR:", err);

        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Team updated successfully",
      });
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE
// DELETE
exports.deleteTeam = (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      DELETE FROM teams
      WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.log("DB ERROR:", err);

        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Team deleted successfully",
      });
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
