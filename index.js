const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const swaggerDoc = require("./swagger.json");

const PORT = 3000;
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(morgan("dev"));

// connection database mysql
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud-express",
});

connection.connect((err) => {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  console.log("success");
});
// add swagger ui documentation
const swaggerUi = require("swagger-ui-express");

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get("/api/users", (req, res) => {
  let sql = "SELECT * FROM users";
  connection.query(sql, (error, results) => {
    if (!error) {
      res.status(200).json(results);
    }
    res.status(400).json({ message: error });
  });
});
app.get("/api/user/:id", (req, res) => {
  let sql = "SELECT * FROM users WHERE id=?";
  connection.query(sql, [req.params.id], (error, results) => {
    if (!error) {
      res.status(200).json(results);
    }
    res.status(400).json({ message: error });
  });
});

app.post("/api/user", (req, res) => {
  let sql = "INSERT INTO users (name) VALUES (?)";
  connection.query(sql, [req.body.name], (error, results) => {
    if (!error) {
      res.status(201).json({ message: "Created" });
    }
    res.status(400).json({ message: error });
  });
});

app.delete("/api/user/:id", (req, res) => {
  connection.query(
    "DELETE FROM users WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (!err) {
        res.status(200).json({ message: "Deleted Success" });
      }
      res.status(400).json({ message: err });
    }
  );
});

app.put("/api/user/:id", (req, res) => {
  let sql = "UPDATE users SET name = ? WHERE id = ? ";
  connection.query(sql, [req.body.name, req.params.id], (err, result) => {
    if (!err) {
      res.status(201).json({ message: "Update Success" });
    }
    console.log(err);
  });
});

app.listen(PORT);
