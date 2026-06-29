const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");

router.get("/turmas", itemController.getTurmas);
router.post("/turmas", itemController.createTurma);
router.get("/turmas/:id/alunos", itemController.getAlunosPorTurma);
router.delete("/turmas/:id", itemController.deleteTurma);

router.post("/alunos", itemController.createAluno);
router.put("/alunos/:id", itemController.updateAluno);
router.patch("/alunos/:id/notas", itemController.patchNotasAluno);
router.delete("/alunos/:id", itemController.deleteAluno);

module.exports = router;
