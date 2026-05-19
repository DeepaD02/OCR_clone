// const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Root@123",
//   database: "practice_db",
// });

// db.connect((err) => {
//   if (err) {
//     console.log(err);
//     return;
//   }

//   console.log("MySQL Connected");

//   const sql = `
//     INSERT INTO sales (first_name, country, score)
//     VALUES ?
//   `;

//   const values = [
//     ["Arun", "India", 350],
//     ["John", "USA", 651],
//     ["Priya", "India", 785],
//     ["David", "Canada", 388],
//     ["Sara", "UK", 295],
//     ["Kiran", "India", 0],
//     ["Sophia", "Germany", 276],
//   ];

//   db.query(sql, [values], (err, result) => {
//     if (err) {
//       console.log(err);
//       return;
//     }

//     console.log("7 Records Inserted Successfully");
//     console.log(result);
//   });
// });

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root@123",
  database: "practice_db",
});

db.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log("MySQL Connected");

  const sql = `
    INSERT INTO orders (order_id,name,customer_id,sales_pd)
    VALUES ?
  `;

  const values = [
    [1001, "Arun", 1, 37],
    [1002, "Sara", 5, 35],
    [1003, "David", 4, 34],
    [1004, "Deepa", 8, 87],
  ];

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log("4 Records Inserted Successfully");
    console.log(result);
  });
});
