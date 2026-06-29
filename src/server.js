const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const itemRoutes = require("./routes/itemRoutes");

const app = express();
const porta = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", itemRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get("/turma/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "turma.html"));
});

app.listen(porta, () => {
  console.log(`Servidor rodando! Acesse: http://localhost:${porta}`);
});
