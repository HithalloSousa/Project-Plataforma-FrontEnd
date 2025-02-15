import React, { useEffect, useState, useCallback } from "react";
import axios from "axios"; // Importe o axios
import "../../styles/aluno/Aluno.css";
// import SidebarAluno from "../../components/SideBarAluno";
import SidebarNewAluno from "../../components/SideBarNewAluno";
import API_BASE_URL from "../../config";

const Aluno = () => {
  const alunoId = localStorage.getItem("user_id");
  const [aluno, setAluno] = useState({});
  const [aulas, setAulas] = useState([]);
  const [aulaAtualIndex, setAulaAtualIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado da SideBar
  const [ultimaTarefa, setUltimaTarefa] = useState(null); //pega a ultima tarefa cadastrada
  

  // Função para buscar os dados do aluno
  const fetchAluno = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/aluno/${alunoId}/`);
      setAluno(response.data);
    } catch (error) {
      console.error("Erro ao buscar o aluno:", error);
    }
  }, [alunoId]);

  // Função para buscar as aulas (simulação)
  const fetchAulas = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/aulas/${alunoId}/`);
      setAulas(response.data);
    } catch (error) {
      console.error("Erro ao buscar as aulas do aluno:", error);
    }
  }, [alunoId]);

  // Função para buscar a última tarefa
  const fetchUltimaTarefa = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tarefas/${alunoId}/`);
      
      if (response.data.length > 0) {
        const tarefasOrdenadas = response.data.reverse(); // Inverte a ordem
        setUltimaTarefa(tarefasOrdenadas[0]);
      } else {
        setUltimaTarefa(null);
      }
    } catch (error) {
      console.error("Erro ao buscar a última tarefa:", error)
    }
  }, [alunoId])

  // Busca os dados do aluno e as aulas ao montar o componente
  useEffect(() => {
    fetchAluno();
    fetchAulas();
    fetchUltimaTarefa();
  }, [fetchAluno, fetchAulas, fetchUltimaTarefa]);

  // Função para navegar para a aula anterior
  const aulaAnterior = () => {
    if (aulaAtualIndex > 0) {
      setAulaAtualIndex(aulaAtualIndex - 1);
    }
  };

  // Função para navegar para a próxima aula
  const aulaPosterior = () => {
    if (aulaAtualIndex < aulas.length - 1) {
      setAulaAtualIndex(aulaAtualIndex + 1);
    }
  };

  // Define o título da página
  useEffect(() => {
    document.title = 'Dashboard';
  }, []);

  return (
    <div className="aluno-layout">
      <SidebarNewAluno isOpen={isSidebarOpen} toggleSideBar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`main-content-aluno ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <h1 style={{color: 'white'}}>Home</h1>
        <p style={{textAlign:'center', color:'white'}}>Welcome, {aluno.nome}!</p>

        <div className="aulas-container">
          <div className="aula-card">
            <h2>Last Class</h2>
            {aulaAtualIndex > 0 ? (
              <div>
                <h3>{aulas[aulaAtualIndex - 1].titulo}</h3>
                <p>{aulas[aulaAtualIndex - 1].data}</p>
              </div>
            ) : (
              <p>There is no previous class.</p>
            )}
          </div>

          <div className="aula-card">
            <h2>Current Class</h2>
            {aulas.length > 0 ? (
              <div>
                <h3>{aulas[aulaAtualIndex].titulo}</h3>
                <p>{aulas[aulaAtualIndex].data}</p>
              </div>
            ) : (
              <p>There is no current class.</p>
            )}
          </div>

          <div className="aula-card">
            <h2>Next Class</h2>
            {aulaAtualIndex < aulas.length - 1 ? (
              <div>
                <h3>{aulas[aulaAtualIndex + 1].titulo}</h3>
                <p>{aulas[aulaAtualIndex + 1].data}</p>
              </div>
            ) : (
              <p>There is no next class.</p>
            )}
          </div>
        </div>

        <div className="navegacao-aulas">
          <button onClick={aulaAnterior} disabled={aulaAtualIndex === 0}>
            Previous Class
          </button>
          <button onClick={aulaPosterior} disabled={aulaAtualIndex === aulas.length - 1}>
            Next Class
          </button>
        </div>

        {/* Exibir a última tarefa cadastrada */}
        <h1>Last Task</h1>
        <div className="tarefa-card">
          {ultimaTarefa ? (
            <div>
              <h3>{ultimaTarefa.titulo}</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{ultimaTarefa.descricao}</p>
            </div>
          ) : (
            <p>There is no recent task.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Aluno;