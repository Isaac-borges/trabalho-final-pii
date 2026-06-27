const pool = require("../config/database");

const getTurmas = async (req, res) => {
  try {
    const comandoSql = "SELECT * FROM turmas ORDER BY id DESC";
    const resultado = await pool.query(comandoSql);
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro interno ao buscar turmas" });
  }
};

const createTurma = async (req, res) => {
  try {
    const { nome_disciplina, ano_letivo, turno } = req.body;

    if (!nome_disciplina || !ano_letivo) {
      return res
        .status(400)
        .json({ erro: "Nome da disciplina e ano letivo são obrigatórios" });
    }

    const comandoSql = `
            INSERT INTO turmas (nome_disciplina, ano_letivo, turno)
            VALUES ($1, $2, $3) RETURNING *
        `;
    const resultado = await pool.query(comandoSql, [
      nome_disciplina,
      ano_letivo,
      turno,
    ]);
    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao criar turma" });
  }
};

const getAlunosPorTurma = async (req, res) => {
  try {
    const idTurma = req.params.id;
    const comandoSql = `
            SELECT * FROM alunos
            WHERE turma_id = $1
            ORDER BY nome_completo ASC
        `;
    const resultado = await pool.query(comandoSql, [idTurma]);
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar alunos da turma" });
  }
};

const createAluno = async (req, res) => {
  try {
    const { nome_completo, matricula, email, turma_id } = req.body;

    if (!email || !email.includes("@")) {
      return res
        .status(400)
        .json({ erro: "Forneça um endereço de e-mail válido contendo @." });
    }

    const comandoSql = `
            INSERT INTO alunos (nome_completo, matricula, email, turma_id)
            VALUES ($1, $2, $3, $4) RETURNING *
        `;
    const resultado = await pool.query(comandoSql, [
      nome_completo,
      matricula,
      email,
      turma_id,
    ]);
    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao cadastrar aluno" });
  }
};

const updateAluno = async (req, res) => {
  try {
    const idAluno = req.params.id;
    const { nome_completo, matricula, email } = req.body;

    const comandoSql = `
            UPDATE alunos
            SET nome_completo = $1, matricula = $2, email = $3
            WHERE id = $4 RETURNING *
        `;
    const resultado = await pool.query(comandoSql, [
      nome_completo,
      matricula,
      email,
      idAluno,
    ]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao atualizar dados do aluno" });
  }
};

const patchNotasAluno = async (req, res) => {
  try {
    const idAluno = req.params.id;
    const { nota_bimestre_1, nota_bimestre_2, faltas } = req.body;

    if (
      nota_bimestre_1 < 0 ||
      nota_bimestre_1 > 10 ||
      nota_bimestre_2 < 0 ||
      nota_bimestre_2 > 10
    ) {
      return res
        .status(400)
        .json({ erro: "As notas devem ser estritamente entre 0 e 10." });
    }

    const comandoSql = `
            UPDATE alunos
            SET nota_bimestre_1 = $1, nota_bimestre_2 = $2, faltas = $3
            WHERE id = $4 RETURNING *
        `;
    const resultado = await pool.query(comandoSql, [
      nota_bimestre_1,
      nota_bimestre_2,
      faltas,
      idAluno,
    ]);
    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao lançar notas" });
  }
};

const deleteAluno = async (req, res) => {
  try {
    const idAluno = req.params.id;
    const comandoSql = "DELETE FROM alunos WHERE id = $1";
    await pool.query(comandoSql, [idAluno]);
    res.status(204).send();
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao remover aluno" });
  }
};

module.exports = {
  getTurmas,
  createTurma,
  getAlunosPorTurma,
  createAluno,
  updateAluno,
  patchNotasAluno,
  deleteAluno,
};
