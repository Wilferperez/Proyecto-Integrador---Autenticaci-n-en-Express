const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const mediumClientsEndpoint = require("./medium-clients");
const premiumClientsEndpoint = require("./premium-clients");

const PORT = 3000;

const users = [
  { email: "admin@example.com", name: "admin", rol: "admin" },
  { email: "user@example.com", name: "user", rol: "user" },
];

function JWTValidation(req, res, next) {
  const token = req.headers.authorization;
  jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
    if (error) {
      return res.json({ error });
    }
    req.rol = decoded.rol;
  });
  next();
}

app.use(express.json());
// app.use(JWTValidation);

app.use("/api/medium-clients", mediumClientsEndpoint);
app.use("/api/premium-clients", premiumClientsEndpoint);

app.get("/", function (req, res) {
  res.send("Bienvenido a la api de ADA Cars");
});

app.post("/auth", function (req, res) {
  const email = req.body.email;
  const exist = users.find((user) => user.email === email);
  if (!exist) {
    return res.status(401).send({ error: "Invalid user name or password" });
  }
  const token = jwt.sign(exist, process.env.SECRET_KEY, {
    expiresIn: 3600,
    algorithm: "HS256",
  });
    exist.token = token;
    res.json({ token });
});

app.get("/premium-clients", JWTValidation, function (req, res) {
  if (req.rol === "admin"){
    return res.json({message: "premium-clients list"});
  }else {
    return res.json({ error: "Access not allowed" });
  }
});


app.get("/medium-clients", JWTValidation, function (req, res) {
  if (req.rol === "admin" || req.rol === "user"){
    return res.json({message: "medium-clients list"});
  }else {
    return res.json({ error: "Access not allowed" });
  }
});
//Se recomienda no editar ni eliminar la instancia del servidor.
// Instancia del servidor
const server = app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});

// Exportación del servidor
module.exports = server;
