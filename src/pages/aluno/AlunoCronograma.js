import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../styles/aluno/Aluno.css";
import SidebarNewAluno from "../../components/SideBarNewAluno";
import "../../styles/aluno/AlunoFichamento.css";
import API_BASE_URL from "../../config";

const AlunoCronograma = () => {
    const { id } = useParams();
    const alunoId = id;
    const [aluno, setAluno] = useState({});
    const [fichamento, setFichamento] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado da SideBar

    // Usar useCallback para evitar recriação da função
    const fetchFichamento = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/fichamento/${alunoId}/`);
            setFichamento(response.data);
        } catch (error) {
            console.error("Erro ao buscar o fichamento:", error);
        }
    }, [alunoId]);

    const fetchAluno = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/aluno/${alunoId}/`);
            setAluno(response.data);
        } catch (error) {
            console.error("Erro ao buscar o aluno:", error);
        }
    }, [alunoId]);

    // Agora o useEffect reconhece que fetchFichamento e fetchAluno não mudam desnecessariamente
    useEffect(() => {
        document.title = 'Cronograma de Estudos'
        fetchFichamento();
        fetchAluno();
    }, [fetchFichamento, fetchAluno]);

    return (
        <div className="aluno-layout">
            <SidebarNewAluno isOpen={isSidebarOpen} toggleSideBar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className={`main-content-aluno ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="card">
                    <h1 className="h1-fichamento-aluno">RoadMap</h1>
                    <h2 className="h2-fichamento-aluno">{aluno.nome}, welcome to your roadmap!</h2>
                    <p>Here you have access to your course roadmap, with duration and content to be viewed.</p>
                </div>
                <div className="card">
                    <h2 className="h2-fichamento-aluno">Study roadmap:</h2>
                    <p style={{ whiteSpace: "pre-wrap" }}>{fichamento.cronograma_conteudos}</p>
                </div>
            </div>
        </div>
    );
};

export default AlunoCronograma;
