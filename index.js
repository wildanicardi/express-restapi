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
  connection.query("SELECT * FROM users", (error, results) => {
    res.status(200).json(results);
  });
});
app.get("/api/user/:id", (req, res) => {
  connection.query(
    "SELECT * FROM users WHERE id=?",
    [req.params.id],
    (error, results) => {
      res.status(200).json(results);
    }
  );
});

app.post("/api/user", (req, res) => {
  connection.query(
    "INSERT INTO users (name) VALUES (?)",
    [req.body.name],
     (error, results) => {
     res.status(201).json({message:"Created"});
    }
  );
});

app.delete("/api/user/:id", (req, res) => {
  connection.query(
    "DELETE FROM users WHERE id = ?",
    [req.params.id],
    (err, result) => {
      res.status(200).json({ message: "Deleted Success" });
    }
  );
});

app.patch("/api/user/:id", (req, res) => {
  connection.query(
    "UPDATE users SET name = ? WHERE id = ? ",
    [req.body.name, req.params.id],
    (err, result) => {
      res.status(201).json({ message: "Update Success" });
    }
  );
});

app.listen(PORT);
