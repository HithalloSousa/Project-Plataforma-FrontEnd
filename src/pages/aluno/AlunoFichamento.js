import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/aluno/Aluno.css";
import { useParams } from "react-router-dom";
import SidebarAluno from "../../components/SideBarAluno";
import "../../styles/aluno/AlunoFichamento.css";
import API_BASE_URL from "../../config";

const AlunoFichamento = () => {
    const { id } = useParams();
    const alunoId = id;
    const [aluno, setAluno] = useState({});
    const [fichamento, setFichamento] = useState({});
    const [nivelAlunoNome, setNivelAlunoNome] = useState(""); // Estado para armazenar o nome do nível

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
            <SidebarAluno />
            <div className="main-content-aluno">
                <h1 className="h1-fichamento-aluno">Fichamento</h1>
                <div className="card">
                    <h2 className="h2-fichamento-aluno">{aluno.nome}, bem-vindo ao seu fichamento!</h2>
                    <p>Em seu fichamento, você tem acesso a descrição detalhada do seu nível, a metodologia personalizada de acordo com seu perfil, nível e objetivo!</p>
                </div>
                <div className="card">
                    <h2 className="h2-fichamento-aluno">Nível do aluno:</h2>
                    <p>{nivelAlunoNome}</p> {/* Exibe o nome do nível */}
                </div>
                <div className="card">
                    <h2 className="h2-fichamento-aluno">Nível detalhado:</h2>
                    <p style={{ whiteSpace: "pre-wrap" }}>{fichamento.nivel_detalhado}</p>
                </div>
                <div className="card">
                    <h2 className="h2-fichamento-aluno">Metodologia Personalizada:</h2>
                    <p style={{ whiteSpace: "pre-wrap" }}>{fichamento.metodologia_personalizada}</p>
                </div>
            </div>
        </div>
    );
};

export default AlunoFichamento;