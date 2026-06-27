const express = require("express");
const path = require("path");

const itemRoutes = require("./routes/itemRoutes");

const app = express();
const porta = 3000;

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
