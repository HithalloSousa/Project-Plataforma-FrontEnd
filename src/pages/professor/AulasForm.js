import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/SideBarProfessor";
import "../../styles/professor/Professor.css";
import "../../styles/professor/ProfessorAluno.css"; 
import "../../styles/professor/FichamentoForm.css";
import API_BASE_URL from "../../config";
import { format, parseISO } from 'date-fns';


const AulasForm = () => {
    const { id } = useParams();
    const [aulas, setAulas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [data, setData] = useState("");
    const [mensagem, setMensagem] = useState("");
    const formatDate = (dateString) => {
        const date = parseISO(dateString);
        return format(date, 'dd/MM/yyyy');
    };

    useEffect(() => {
        fetchAulas();
    }, [id]);

    const fetchAulas = async () => {
        try {
            // const response = await axios.get(`https://customenglish.up.railway.app/api/aulas/${id}`);
            const response = await axios.get(`${API_BASE_URL}/api/aulas/${id}`);
            setAulas(response.data);
        } catch (error) {
            console.error("Erro ao buscar aulas:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const response = await axios.post(`${API_BASE_URL}/api/criar-aulas/`, {
                aluno_id: id,
                titulo,
                data: data,
            });
            
            console.log("Resposta do back-end:", response.data); // Verifique a resposta do back
            setAulas([...aulas, response.data]);
            setModalOpen(false);
            setTitulo("");
            setData("");
            alert("Aula cadastrada com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar aula:", error);
        }
    };

    const handleDelete = async (aulaId) => {
        try {
            // await axios.delete(`https://customenglish.up.railway.app/api/aulas/${aulaId}/`);
            const alunoId = id;
            await axios.delete(`${API_BASE_URL}/api/aulas-excluir/${alunoId}/${aulaId}/`);
            setAulas(aulas.filter((aula) => aula.id !== aulaId));
            alert("Aula deletada com sucesso!");
        } catch (error) {
            console.error("Erro ao deletar aula:", error);
        }
    };

    return (
        <div className="professor-layout">
            <Sidebar />
            <div className="main-content">
                <div className="form-container">
                    <h2>Aulas Cadastradas</h2>
                    {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}
                    {loading ? (
                        <p>Carregando...</p>
                    ) : (
                        <>
                            {aulas.length > 0 ? (
                                <ul className="aulas-list">
                                    {aulas.map((aula) => (
                                        <li key={aula.id} className="aula-item">
                                            <strong>{aula.titulo}</strong> - {formatDate(aula.data)}
                                            <button onClick={() => handleDelete(aula.id)} className="delete-button">Deletar</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Nenhuma aula cadastrada ainda.</p>
                            )}
                            <button onClick={() => setModalOpen(true)}>Cadastrar Nova Aula</button>
                        </>
                    )}
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Cadastrar Nova Aula</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Título:</label>
                                <input 
                                    type="text" 
                                    value={titulo} 
                                    onChange={(e) => setTitulo(e.target.value)} 
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Data:</label>
                                <input 
                                    type="date" 
                                    value={data} 
                                    onChange={(e) => setData(e.target.value)} 
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit">Salvar</button>
                                <button type="button" onClick={() => setModalOpen(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AulasForm;