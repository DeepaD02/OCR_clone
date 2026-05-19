const db = require("../config/db");

exports.addDiagnoses = (req, res) => {
  const { code, describtion, type, label } = req.body;
  sql = `insert into diagnoses(code,describtion,type,label) values(?,?,?,?)`;

  db.query(sql, [code, describtion, type, label], (err, result) => {
    if (err) {
      console.log("ERROR", err);
      return res.status(500).json({
        error: err,
      });
    }
    res.status(200).json({
      success: true,
      message: "diagnoses successfully added",
    });
  });
};

// exports.viewDiagnoses = (req, res) => {
//   sql = `select  id,code,describtion,type,label,created_at as Createdat from diagnoses ORDER BY id DESC`;

//   db.query(sql, (err, result) => {
//     if (err) {
//       console.log("ERROR", err);
//       return res.status(500).json({ error: err });
//     }
//     res.status(200).json(result);
//   });
// };

exports.viewDiagnoses = (req, res) => {
  const {
    search = "",
    label = "",
    type = "",
    page = 1,
    perPage = 10,
  } = req.query;

  // OFFSET
  const offset = (Number(page) - 1) * Number(perPage);

  let whereSql = ` WHERE 1=1 `;

  const values = [];

  // SEARCH
  if (search) {
    whereSql += `
      AND (
        code LIKE ?
        OR describtion LIKE ?
      )
    `;

    values.push(`%${search}%`, `%${search}%`);
  }

  // LABEL
  if (label) {
    whereSql += ` AND label = ? `;
    values.push(label);
  }

  // TYPE
  if (type) {
    whereSql += ` AND type = ? `;
    values.push(type);
  }

  // COUNT QUERY
  const countSql = `
    SELECT COUNT(*) AS total
    FROM diagnoses
    ${whereSql}
  `;

  db.query(countSql, values, (countErr, countResult) => {
    if (countErr) {
      return res.status(500).json({
        error: countErr,
      });
    }

    const total = countResult[0].total;

    // MAIN QUERY
    const sql = `
      SELECT
        id,
        code,
        describtion,
        type,
        label,
        created_at AS Createdat
      FROM diagnoses
      ${whereSql}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `;

    db.query(sql, [...values, Number(perPage), offset], (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      res.status(200).json({
        success: true,

        data: result,

        pagination: {
          total,
          currentPage: Number(page),
          perPage: Number(perPage),
          totalPages: Math.ceil(total / Number(perPage)),
        },
      });
    });
  });
};

exports.editDiagnoses = (req, res) => {
  const { id } = req.params;
  const { code, describtion, type, label } = req.body;

  const sql = `UPDATE diagnoses SET code = ?,describtion = ?,type = ?,label = ? where id = ?`;

  db.query(sql, [code, describtion, type, label, id], (err, result) => {
    if (err) {
      console.log("ERROR", err);
      return res.status(500).json({ error: err });
    }
    res.status(200).json(result);
  });
};

exports.deleteDiagnoses = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE from diagnoses where id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("error", err);
      return res.status(500).json({ error: err });
    }
    res.status(200).json(result);
  });
};
