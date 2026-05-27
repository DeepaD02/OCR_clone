const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const SECRET_KEY = "mysecretkey";

exports.register = async (req, res) => {

  try {

    const { name, email, password } = req.body;


    const checkSql =
      "SELECT * FROM register WHERE email = ?";

    db.query(checkSql, [email], async (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }


      if (result.length > 0) {
        return res.status(400).json({
          message: "User already exists. Please Login",
        });
      }


      const hashedPassword =
        await bcrypt.hash(password, 10);


      const insertSql =
        "INSERT INTO register (name, email, password) VALUES (?, ?, ?)";

      db.query(
        insertSql,
        [name, email, hashedPassword],
        (err, result) => {

          if (err) {
            return res.status(500).json(err);
          }

          res.json({
            message: "Registration Successful",
          });

        }
      );

    });

  } catch (error) {
    res.status(500).json(error);
  }

};


exports.login = (req, res) => {

  const { email, password } = req.body;

  const sql =
    "SELECT * FROM register WHERE email = ?";

  db.query(sql, [email], async (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }


    if (result.length === 0) {
      return res.status(400).json({
        message: "User not found. Please Register",
      });
    }

    const user = result[0];

  
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  });

};
