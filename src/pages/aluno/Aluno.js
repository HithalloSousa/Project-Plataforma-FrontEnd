import React, { useEffect, useState, useCallback } from "react";
import axios from "axios"; // Importe o axios
import "../../styles/aluno/Aluno.css";
import SidebarAluno from "../../components/SideBarAluno";
import API_BASE_URL from "../../config";

const Aluno = () => {
  const alunoId = localStorage.getItem("user_id");
  const [aluno, setAluno] = useState({});
  const [aulas, setAulas] = useState([]);
  const [aulaAtualIndex, setAulaAtualIndex] = useState(0);
  

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

  // Busca os dados do aluno e as aulas ao montar o componente
  useEffect(() => {
    fetchAluno();
    fetchAulas();
  }, [fetchAluno, fetchAulas]);

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
      <SidebarAluno />
      <div className="main-content-aluno">
        <h1>Home</h1>
        <p>Bem vindo, {aluno.nome}!</p>

        <div className="aulas-container">
          <div className="aula-card">
            <h2>Aula Anterior</h2>
            {aulaAtualIndex > 0 ? (
              <div>
                <h3>{aulas[aulaAtualIndex - 1].titulo}</h3>
                <p>{aulas[aulaAtualIndex - 1].data}</p>
              </div>
            ) : (
              <p>Não há aula anterior.</p>
            )}
          </div>

          <div className="aula-card">
            <h2>Aula Atual</h2>
            {aulas.length > 0 ? (
              <div>
                <h3>{aulas[aulaAtualIndex].titulo}</h3>
                <p>{aulas[aulaAtualIndex].data}</p>
              </div>
            ) : (
              <p>Não há aula atual.</p>
            )}
          </div>

          <div className="aula-card">
            <h2>Próxima Aula</h2>
            {aulaAtualIndex < aulas.length - 1 ? (
              <div>
                <h3>{aulas[aulaAtualIndex + 1].titulo}</h3>
                <p>{aulas[aulaAtualIndex + 1].data}</p>
              </div>
            ) : (
              <p>Não há próxima aula.</p>
            )}
          </div>
        </div>

        <div className="navegacao-aulas">
          <button onClick={aulaAnterior} disabled={aulaAtualIndex === 0}>
            Aula Anterior
          </button>
          <button onClick={aulaPosterior} disabled={aulaAtualIndex === aulas.length - 1}>
            Próxima Aula
          </button>
        </div>
      </div>
    </div>
  );
};

export default Aluno;