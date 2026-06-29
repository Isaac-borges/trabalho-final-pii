document.addEventListener("DOMContentLoaded", () => {
  const btnTema = document.getElementById("btn-tema");
  const temaSalvo = localStorage.getItem("tema");

  if (temaSalvo === "dark") {
    document.body.classList.add("dark-theme");
  }

  if (btnTema) {
    btnTema.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      const temaAtual = document.body.classList.contains("dark-theme")
        ? "dark"
        : "light";
      localStorage.setItem("tema", temaAtual);
    });
  }

  const painelTurmas = document.getElementById("lista-turmas");
  const tabelaAlunos = document.getElementById("tabela-alunos");

  const partesUrl = window.location.pathname.split("/");
  const idTurmaAtual = partesUrl[partesUrl.length - 1];

  if (painelTurmas) {
    const formTurma = document.getElementById("form-turma");

    const carregarTurmas = async () => {
      painelTurmas.textContent = "";
      try {
        const resposta = await fetch("/api/turmas");
        const turmas = await resposta.json();

        turmas.forEach((turma) => {
          const card = document.createElement("div");
          card.className = "card-turma";

          const h3 = document.createElement("h3");
          h3.textContent = turma.nome_disciplina;

          const pInfo = document.createElement("p");
          pInfo.textContent = `Período: ${turma.ano_letivo} | Turno: ${turma.turno}`;

          const btnAcessar = document.createElement("a");
          btnAcessar.href = `/turma/${turma.id}`;
          btnAcessar.className = "btn btn-primario";
          btnAcessar.style.marginTop = "15px";
          btnAcessar.textContent = "Abrir Diário";

          card.appendChild(h3);
          card.appendChild(pInfo);
          card.appendChild(btnAcessar);
          painelTurmas.appendChild(card);
        });
      } catch (erro) {
        console.error("Erro ao buscar turmas:", erro);
      }
    };

    formTurma.addEventListener("submit", async (e) => {
      e.preventDefault();
      const dados = {
        nome_disciplina: document.getElementById("nome_disciplina").value,
        ano_letivo: document.getElementById("ano_letivo").value,
        turno: document.getElementById("turno").value,
      };

      const resposta = await fetch("/api/turmas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (resposta.ok) {
        formTurma.reset();
        carregarTurmas();
      }
    });

    carregarTurmas();
  }

  if (tabelaAlunos && idTurmaAtual) {
    const formAluno = document.getElementById("form-aluno");
    const tituloTurma = document.getElementById("titulo-turma");
    const btnExcluirTurma = document.getElementById("btn-excluir-turma");

    tituloTurma.textContent = `Diário da Turma #${idTurmaAtual}`;

    if (btnExcluirTurma) {
      btnExcluirTurma.addEventListener("click", async () => {
        const confirmar = confirm(
          "ATENÇÃO: Tem certeza que deseja excluir esta turma?\nTodos os alunos matriculados nela também serão apagados para sempre!",
        );

        if (confirmar) {
          const resposta = await fetch(`/api/turmas/${idTurmaAtual}`, {
            method: "DELETE",
          });

          if (resposta.ok) {
            alert("Turma excluída com sucesso!");
            window.location.href = "/";
          } else {
            alert("Erro ao excluir a turma.");
          }
        }
      });
    }

    const carregarAlunos = async () => {
      tabelaAlunos.textContent = "";
      try {
        const resposta = await fetch(`/api/turmas/${idTurmaAtual}/alunos`);
        const alunos = await resposta.json();

        alunos.forEach((aluno) => {
          const linha = document.createElement("tr");

          const tdNome = document.createElement("td");
          tdNome.textContent = aluno.nome_completo;

          const tdMatricula = document.createElement("td");
          tdMatricula.textContent = aluno.matricula;

          const tdEmail = document.createElement("td");
          tdEmail.textContent = aluno.email;

          const tdN1 = document.createElement("td");
          const inputN1 = document.createElement("input");
          inputN1.type = "number";
          inputN1.className = "input-tabela";
          inputN1.min = "0";
          inputN1.max = "10";
          inputN1.step = "0.1";
          inputN1.value = aluno.nota_bimestre_1;
          tdN1.appendChild(inputN1);

          const tdN2 = document.createElement("td");
          const inputN2 = document.createElement("input");
          inputN2.type = "number";
          inputN2.className = "input-tabela";
          inputN2.min = "0";
          inputN2.max = "10";
          inputN2.step = "0.1";
          inputN2.value = aluno.nota_bimestre_2;
          tdN2.appendChild(inputN2);

          const tdFaltas = document.createElement("td");
          const inputFaltas = document.createElement("input");
          inputFaltas.type = "number";
          inputFaltas.className = "input-tabela";
          inputFaltas.min = "0";
          inputFaltas.value = aluno.faltas;
          tdFaltas.appendChild(inputFaltas);

          const tdAcoes = document.createElement("td");
          tdAcoes.style.display = "flex";
          tdAcoes.style.gap = "5px";

          const btnSalvarNotas = document.createElement("button");
          btnSalvarNotas.className = "btn btn-sucesso";
          btnSalvarNotas.textContent = "✓ Nota";
          btnSalvarNotas.addEventListener("click", async () => {
            const n1 = parseFloat(inputN1.value);
            const n2 = parseFloat(inputN2.value);
            if (n1 < 0 || n1 > 10 || n2 < 0 || n2 > 10) {
              alert("Erro Cliente: As notas devem ser entre 0 e 10!");
              return;
            }

            if (isNaN(n1) || isNaN(n2)) {
              alert("Erro Cliente: Valor inserido nas notas não é numérico!");
              return;
            }

            const respPatch = await fetch(`/api/alunos/${aluno.id}/notas`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nota_bimestre_1: n1,
                nota_bimestre_2: n2,
                faltas: parseInt(inputFaltas.value),
              }),
            });
            if (respPatch.ok) alert("Notas/Faltas salvas!");
            else {
              const erroServer = await respPatch.json();
              alert(`Erro Servidor: ${erroServer.erro}`);
            }
          });

          const btnEditar = document.createElement("button");
          btnEditar.className = "btn btn-primario";
          btnEditar.textContent = "Editar";
          btnEditar.addEventListener("click", async () => {
            const novoNome = prompt(
              "Mudar nome completo:",
              aluno.nome_completo,
            );
            const novaMatricula = prompt("Mudar matrícula:", aluno.matricula);
            let novoEmail = prompt("Mudar e-mail:", aluno.email);

            while (!novoEmail.includes("@")) {
              novoEmail = prompt("O email deve conter '@'!", aluno.email);
            }

            if (novoNome && novaMatricula && novoEmail) {
              const respPut = await fetch(`/api/alunos/${aluno.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  nome_completo: novoNome,
                  matricula: novaMatricula,
                  email: novoEmail,
                }),
              });
              if (respPut.ok) carregarAlunos();
            }
          });

          const btnDeletar = document.createElement("button");
          btnDeletar.className = "btn btn-perigo";
          btnDeletar.textContent = "X";
          btnDeletar.addEventListener("click", async () => {
            if (
              confirm(`Tem certeza que deseja remover ${aluno.nome_completo}?`)
            ) {
              const respDel = await fetch(`/api/alunos/${aluno.id}`, {
                method: "DELETE",
              });
              if (respDel.ok) carregarAlunos();
            }
          });

          tdAcoes.appendChild(btnSalvarNotas);
          tdAcoes.appendChild(btnEditar);
          tdAcoes.appendChild(btnDeletar);

          linha.appendChild(tdNome);
          linha.appendChild(tdMatricula);
          linha.appendChild(tdEmail);
          linha.appendChild(tdN1);
          linha.appendChild(tdN2);
          linha.appendChild(tdFaltas);
          linha.appendChild(tdAcoes);

          tabelaAlunos.appendChild(linha);
        });
      } catch (erro) {
        console.error("Erro ao buscar alunos:", erro);
      }
    };

    formAluno.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("email").value;

      if (!emailInput.includes("@")) {
        alert("Erro Cliente: Insira um email válido!");
        return;
      }

      const dados = {
        nome_completo: document.getElementById("nome_completo").value,
        matricula: document.getElementById("matricula").value,
        email: emailInput,
        turma_id: parseInt(idTurmaAtual),
      };

      const resposta = await fetch("/api/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (resposta.ok) {
        formAluno.reset();
        carregarAlunos();
      } else {
        const erroObj = await resposta.json();
        alert(`Erro: ${erroObj.erro}`);
      }
    });

    carregarAlunos();
  }
});
