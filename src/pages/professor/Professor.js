import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SideBarProfessor";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { FaUser, FaTasks, FaBell } from "react-icons/fa";
import "../../styles/professor/Professor.css"; // Estilos adicionais para o layout
import axios from "axios"; // Para fazer a requisição à API
import API_BASE_URL from "../../config";

const TeacherDashboard = () => {
  const [alunos, setAlunos] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const totalAlunos = alunos.length;
  const totalTarefas = tarefas.length;
  const notificacoes = [
    "Nova tarefa criada: Redação sobre clima.",
    "Aluno João Silva completou uma tarefa.",
    "Nova inscrição: Maria Oliveira."
  ];

  const fetchAlunos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/alunos/`);
      setAlunos(response.data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    }
  };

  const fetchTarefas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tarefas/`);
      setTarefas(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error)
    }
  }

  useEffect(() => {
    fetchAlunos();
    fetchTarefas();
  }, [])

  return (
    <div className="professor-layout">
      <Sidebar />
      <div className="main-content">
        <div className="teacher-dashboard">
          <h1 className="dashboard-title">Bem-vindo, Professor!</h1>
          <div className="dashboard-summary">
            {/* Cartões Resumo */}
            <Card className="summary-card">
              <CardContent>
                <FaUser className="summary-icon" />
                <h2>{totalAlunos}</h2>
                <p>Alunos cadastrados</p>
              </CardContent>
            </Card>
            
            <Card className="summary-card">
              <CardContent>
                <FaTasks className="summary-icon" />
                <h2>{totalTarefas}</h2>
                <p>Tarefas criadas</p>
              </CardContent>
            </Card>
          </div>

          {/* Notificações Recentes */}
          <div className="recent-notifications">
            <h2>Notificações Recentes</h2>
            <ul className="notification-list">
              {notificacoes.map((notificacao, index) => (
                <li key={index} className="notification-item">
                  <FaBell className="notification-icon" />
                  {notificacao}
                </li>
              ))}
            </ul>
          </div>

          {/* Links de Acesso Rápido */}
          <div className="quick-access">
            <h2>Acesso Rápido</h2>
            <div className="quick-access-links">
              <a href="/professor-alunos" className="quick-link">
                Gerenciar Alunos
              </a>
              <a href="/professor-tarefas" className="quick-link">
                Criar Tarefa
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;