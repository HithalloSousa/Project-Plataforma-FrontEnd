import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SideBarProfessor";
import "../../styles/professor/Professor.css";
import "../../styles/professor/ProfessorAluno.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfessorAlunos = () => {
  const [alunos, setAlunos] = useState([]);
  const [novoAluno, setNovoAluno] = useState({ nome: "", email: "", senha: "", categoria_id: 1 });
  const navigate = useNavigate();

  const fetchAlunos = async () => {
    try {
      const response = await axios.get("https://customenglish.up.railway.app/api/alunos/");
      setAlunos(response.data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    }
  };

  const handleCriarAluno = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://customenglish.up.railway.app/api/criar-alunos/", novoAluno);
      console.log("Aluno criado:", response.data);
      setNovoAluno({ nome: "", email: "", senha: "" });
      fetchAlunos();
      alert("Aluno criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar aluno:", error);
      alert("Erro ao criar aluno. Verifique os dados e tente novamente.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/professor/editar-aluno/${id}`);
  };

  const handleFichamento = async (id) => {
    try {
      const response = await axios.get(`https://customenglish.up.railway.app/api/fichamento/${id}/`);
      if (response.data) {
        navigate(`/professor/aluno/fichamento/editar/${id}`);
      } else {
        navigate(`/professor/aluno/fichamento/criar/${id}`);
      }
    } catch (error) {
      console.error("Erro ao buscar fichamento:", error);
    }
  };

  const handleTarefas = async (id) => {
    try {
      const response = await axios.get(`https://customenglish.up.railway.app/api/tarefas/${id}/`);
      if (response.data) {
        navigate(`/professor/aluno/tarefas/editar/${id}`);
      } else {
        console.log('O aluno não tem tarefas.');
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  const handleAulas = async (id) => {
    try {
      const response = await axios.get(`https://customenglish.up.railway.app/api/aulas/${id}/`);
      console.log(response.data)
      if (response.data) {
        navigate(`/professor/aluno/aulas/editar/${id}`);
      } else {
        navigate(`/professor/aluno/aulas/criar/${id}`)
      }
    } catch (error) {
      console.error("Erro ao buscar aulas:", error);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  return (
    <div className="professor-layout">
      <Sidebar />
      <div className="main-content">
        <h1>Lista de Alunos</h1>

        <form onSubmit={handleCriarAluno} className="criar-aluno-form">
          <h2>Criar Novo Aluno</h2>
          <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={novoAluno.nome}
              onChange={(e) => setNovoAluno({ ...novoAluno, nome: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={novoAluno.email}
              onChange={(e) => setNovoAluno({ ...novoAluno, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha:</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={novoAluno.senha}
              onChange={(e) => setNovoAluno({ ...novoAluno, senha: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="submit-button">Criar Aluno</button>
        </form>

        <div className="alunos-container">
          {alunos.length === 0 ? (
            <p>Não há alunos cadastrados.</p>
          ) : (
            alunos.map((aluno) => (
              <div key={aluno.id} className="aluno-card">
                <h3>{aluno.nome}</h3>
                <p>{aluno.email}</p>
                <div className="aluno-actions">
                  <button className="edit-button" onClick={() => handleEdit(aluno.id)}>
                    Editar
                  </button>
                  <button className="edit-button" onClick={() => handleFichamento(aluno.id)}>
                    Fichamento
                  </button>
                  <button className="edit-button" onClick={() => handleTarefas(aluno.id)}>
                    Tarefas
                  </button>
                  <button className="edit-button" onClick={() => handleAulas(aluno.id)}>
                    Aulas
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessorAlunos;