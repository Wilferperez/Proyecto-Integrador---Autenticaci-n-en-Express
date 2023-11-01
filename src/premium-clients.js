const express = require("express");
const router = express.Router();

const premiumClients = [
  { nombre: "Roberto", age: "23" },
  { nombre: "Pablo", age: "22" },
  { nombre: "Laura", age: "22" },
  { nombre: "Sofia", age: "21" },
  { nombre: "Angelica", age: "24" },
  { nombre: "Estiven", age: "27" },
  { nombre: "Armando", age: "28" },
];

router.get("/", function (req, res) {
  res.json({ clients: premiumClients });
});

router.post("/", function (req, res) {
  const data = req.body;
  premiumClients.push(data);
  res.status(201).json({ createdClient: data });
});

router.put("/:id", function (req, res) {
  const id = req.params.id;
  const data = req.body;
  premiumClients[id] = data;
  res.status(200).json({ updatedClient: premiumClients[id] });
});

router.delete("/:id", function (req, res) {
  const id = req.params.id;
  const data = premiumClients.splice(id, 1);
  res.status(200).json({ deletedClient: data });
});

module.exports = router;
