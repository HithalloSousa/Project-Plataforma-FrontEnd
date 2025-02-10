import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/aluno/Aluno.css";
import { useParams } from "react-router-dom";
import SidebarNewAluno from "../../components/SideBarNewAluno";
import "../../styles/aluno/AlunoFichamento.css";
import API_BASE_URL from "../../config";

const AlunoFichamento = () => {
    const { id } = useParams();
    const alunoId = id;
    const [aluno, setAluno] = useState({});
    const [fichamento, setFichamento] = useState({});
    const [nivelAlunoNome, setNivelAlunoNome] = useState(""); // Estado para armazenar o nome do nível
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado da SideBar

    const fetchFichamento = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/fichamento/${alunoId}/`);
            setFichamento(response.data);

            // Busca o nome do nível com base no ID do nivel_aluno
            if (response.data.nivel_aluno) {
                fetchNivelAlunoNome(response.data.nivel_aluno);
            }
        } catch (error) {
            console.error("Erro ao buscar o fichamento:", error);
        }
    };

    const fetchNivelAlunoNome = async (nivelAlunoId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/nivels/`);
            // console.log(response.data); // Lista de níveis

            // Encontra o nível correspondente ao ID
            const nivelEncontrado = response.data.find(nivel => nivel.id === nivelAlunoId);

            if (nivelEncontrado) {
                setNivelAlunoNome(nivelEncontrado.nome); // Define o nome do nível no estado
            } else {
                console.error("Nível não encontrado para o ID:", nivelAlunoId);
            }
        } catch (error) {
            console.error("Erro ao buscar o nome do nível:", error);
        }
    };

    const fetchAluno = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/aluno/${alunoId}/`);
            setAluno(response.data);
        } catch (error) {
            console.error("Erro ao buscar o aluno:", error);
        }
    };

    useEffect(() => {
        document.title = 'Fichamento'
        fetchFichamento();
        fetchAluno();
    }, [id]);

    return (
        <div className="aluno-layout">
            <SidebarNewAluno isOpen={isSidebarOpen} toggleSideBar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className={`main-content-aluno ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <h1 className="h1-fichamento-aluno">Registration</h1>
                <div className="card">
                    <h2 className="h2-fichamento-aluno">{aluno.nome}, Welcome to your Registration!</h2>
                    <p>In your file, you have access to a detailed description of your level, the personalized methodology according to your profile, level and objective!</p>
                </div>
                <div className="card">
                    <h2 className="h2-fichamento-aluno">Student level:</h2>
                    <p>{nivelAlunoNome}</p> {/* Exibe o nome do nível */}
                </div>
                <div className="card">
                    <h2 className="h2-fichamento-aluno">Detailed level:</h2>
                    <p style={{ whiteSpace: "pre-wrap" }}>{fichamento.nivel_detalhado}</p>
                </div>
                <div className="card">
                    <h2 className="h2-fichamento-aluno">Customized Methodology:</h2>
                    <p style={{ whiteSpace: "pre-wrap" }}>{fichamento.metodologia_personalizada}</p>
                </div>
            </div>
        </div>
    );
};

export default AlunoFichamento;