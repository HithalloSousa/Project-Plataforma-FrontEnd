import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../styles/aluno/Aluno.css";
import SidebarAluno from "../../components/SideBarAluno";
import "../../styles/aluno/AlunoFichamento.css";
import API_BASE_URL from "../../config";

const AlunoCronograma = () => {
    const { id } = useParams();
    const alunoId = id;
    const [aluno, setAluno] = useState({});
    const [fichamento, setFichamento] = useState({});

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
            <SidebarAluno />
            <div className="main-content-aluno">
                <div className="card">
                    <h1 className="h1-fichamento-aluno">Cronograma</h1>
                    <h2 className="h2-fichamento-aluno">{aluno.nome}, bem-vindo ao seu cronograma!</h2>
                    <p>Aqui você tem acesso ao cronograma do seu curso, como duração e contéudos a serem vistos.</p>
                </div>
                <div className="card">
                    <h2 className="h2-fichamento-aluno">Cronograma de estudos:</h2>
                    <p>{fichamento.cronograma_conteudos}</p>
                </div>
            </div>
        </div>
    );
};

export default AlunoCronograma;
