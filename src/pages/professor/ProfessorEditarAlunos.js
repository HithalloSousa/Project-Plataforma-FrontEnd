import React, { useEffect, useState } from "react";
import SidebarNewProfessor from "../../components/SideBarNewProfessor";
import "../../styles/professor/ProfessorEditaAluno.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config";

const ProfessorEditaAluno = () => {
    const { id } = useParams(); // Pega o ID do aluno da URL
    const [aluno, setAluno] = useState({ nome: "", email: "" });
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado da SideBar

    useEffect(() => {
        const fetchAluno = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/aluno/${id}/`);
                setAluno(response.data);
            } catch (error) {
                console.error("Erro ao buscar o aluno:", error);
                alert("Erro ao carregar os dados do aluno.");
            }
        };

        setTimeout(fetchAluno, 100); // Pequeno delay para evitar loops
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAluno((prevAluno) => ({ ...prevAluno, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}/api/aluno/${id}/`, aluno);
            alert("Aluno atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar aluno:", error);
            alert("Erro ao atualizar aluno. Tente novamente.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Tem certeza que deseja deletar este aluno?")) {
            try {
                await axios.delete(`${API_BASE_URL}/api/aluno/${id}/`);
                alert("Aluno deletado com sucesso!");
                navigate("/professor-alunos");
            } catch (error) {
                console.error("Erro ao deletar aluno:", error);
                alert("Erro ao deletar aluno. Tente novamente.");
            }
        }
    };

    return (
        <div className="professor-edita-aluno-container">
            <SidebarNewProfessor isOpen={isSidebarOpen} toggleSideBar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <h1>Editar Aluno</h1>
                <form onSubmit={handleSubmit} className="edita-aluno-form">
                    <div className="form-group">
                        <label htmlFor="nome">Nome:</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={aluno.nome}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={aluno.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-button">Salvar Alterações</button>
                    <button type="button" className="delete-button" onClick={handleDelete}>
                        Deletar Aluno
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfessorEditaAluno;
