const db = require("../config/db");

// GET PROJECT HEADS
exports.getProjectHeads = (req, res) => {
  const sql = `
    SELECT id, name
    FROM users
    WHERE role = 'Project Head'
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err,
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  });
};

// GET TEAM LEADS
exports.getTeamLeads = (req, res) => {
  const sql = `
    SELECT id, name
    FROM users
    WHERE role = 'Lead'
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err,
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  });
};
