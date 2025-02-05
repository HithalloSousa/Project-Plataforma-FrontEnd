import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/SideBarProfessor";
import "../../styles/professor/Professor.css";
import "../../styles/professor/ProfessorAluno.css";
import "../../styles/professor/TarefaAluno.css";

const TarefasAluno = () => {
  const { id } = useParams(); // Pega o ID do aluno da URL
  const [tarefas, setTarefas] = useState([]); // Estado para armazenar as tarefas
  const [imagemCorrecao, setImagemCorrecao] = useState({});

  // Função para buscar as tarefas do aluno
  const fetchTarefas = async () => {
    try {
      const response = await axios.get(`https://customenglish.up.railway.app/api/tarefas/${id}/`, {
        params: { aluno_id: id },
      });

      const tarefasFormatadas = response.data.map((tarefa) => ({
        ...tarefa,
        tarefa_concluida: tarefa.tarefa_concluida || {}, // Define {} se estiver undefined
      }));

      setTarefas(tarefasFormatadas);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  // Função para marcar a tarefa como corrigida
  const handleCorrigirTarefa = async (tarefaId) => {
    const formData = new FormData();


    formData.append("aluno_id", id);
    formData.append("tarefa_id", tarefaId)
    if (imagemCorrecao[tarefaId]) {
      formData.append("imagem_correcao", imagemCorrecao[tarefaId]);
    }

    try {
      await axios.post(
        `https://customenglish.up.railway.app/api/corrigir-tarefa/${tarefaId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Tarefa corrigida com sucesso!");
      fetchTarefas();
    } catch (error) {
      console.error("Erro ao corrigir tarefa:", error);
      alert("Erro ao corrigir tarefa.");
    }
  };

  // Busca as tarefas ao carregar o componente
  useEffect(() => {
    fetchTarefas();
  }, [id]);

  return (
    <div className="professor-layout">
      <Sidebar />
      <div className="main-content">
        <h1>Tarefas do Aluno</h1>

        {/* Lista de tarefas */}
        <div className="tarefas-container">
          {Array.isArray(tarefas) && tarefas.length === 0 ? (
            <div className="no-tasks-message">
              <p>Não há tarefas cadastradas para este aluno.</p>
              <p>Atribua uma tarefa para começar.</p>
            </div>
          ) : (
            Array.isArray(tarefas) &&
            tarefas.map((tarefa) => {
              return (
                <div key={tarefa.id} className="tarefa-card">
                  <h3>{tarefa.titulo}</h3>
                  <p>{tarefa.descricao}</p>

                  {/* Exibe a imagem da tarefa concluída pelo aluno */}
                  {tarefa.imagem_concluida ? (
                    <div className="tarefa-imagem-container">
                      <h3>Resposta do Aluno</h3>
                      <div className="imagem-wrapper"> 
                        <img 
                          src={
                            tarefa.imagem_concluida.startsWith("http")
                            ? tarefa.imagem_concluida
                            : `https://customenglish.up.railway.app${tarefa.imagem_concluida}`
                          }
                          alt="Tarefa Concluida"
                          className="tarefa-imagem"
                          onError={(e) => {
                            console.error("Erro ao carregar imagem:", e.target.src);
                            e.target.style.display = "none";
                          }}
                        />
                        <a
                          href={tarefa.imagem_concluida.startsWith("http") ? tarefa.imagem_concluida : `https://customenglish.up.railway.app${tarefa.imagem_concluida}`}
                          dowload
                          target="_blank"
                          rel="noopener noreferrer"
                          className="download-button"
                        >
                          📥Baixar Imagem
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p>O aluno não enviou uma imagem para esta tarefa.</p>
                  )}

                  <p>
                    Status:{" "}
                    <span
                      style={{
                        color: tarefa.concluido ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {tarefa.concluido ? "Concluída" : "Pendente"}
                    </span>
                  </p>
                  <p>
                    Corrigida:{" "}
                    <span
                      style={{
                        color: tarefa.imagem_correcao ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {tarefa.imagem_correcao ? "Sim" : "Não"}
                    </span>
                  </p>

                  {/* Formulário para enviar correção */}
                  {!tarefa.imagem_correcao && ( // Se não houver imagem de correção, permitir correção
                    <div className="correcao-container">
                      <label>Enviar imagem de correção:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setImagemCorrecao({ ...imagemCorrecao, [tarefa.id]: e.target.files[0] })
                        }
                      />
                      <button
                        className="corrigir-button"
                        onClick={() => handleCorrigirTarefa(tarefa.id)}
                        disabled={!!tarefa.imagem_correcao} // Botão desativado se já tiver correção
                      >
                        {tarefa.imagem_correcao ? "Tarefa Corrigida" : "Corrigir Tarefa"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TarefasAluno;