import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/SideBarProfessor";
import "../../styles/professor/Professor.css";
import "../../styles/professor/ProfessorAluno.css"; 
import "../../styles/professor/FichamentoForm.css";

const AulasForm = () => {
    const { id } = useParams();
    const [aulas, setAulas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [data, setData] = useState("");

    useEffect(() => {
        fetchAulas();
    }, [id]);

    const fetchAulas = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/aulas/${id}`);
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
            const response = await axios.post("http://localhost:8000/api/criar-aulas/", {
                aluno_id: id,
                titulo,
                data,
            });
            setAulas([...aulas, response.data]);
            setModalOpen(false);
            setTitulo("");
            setData("");
        } catch (error) {
            console.error("Erro ao cadastrar aula:", error);
        }
    };

    return (
        <div className="professor-layout">
            <Sidebar />
            <div className="main-content">
                <div className="form-container">
                    <h2>Aulas Cadastradas</h2>

                    {loading ? (
                        <p>Carregando...</p>
                    ) : (
                        <>
                            {aulas.length > 0 ? (
                                <ul className="aulas-list">
                                    {aulas.map((aula) => (
                                        <li key={aula.id} className="aula-item">
                                            <strong>{aula.titulo}</strong> - {new Date(aula.data).toLocaleDateString()}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Nenhuma aula cadastrada ainda.</p>
                            )}

                            <button onClick={() => setModalOpen(true)}>
                                Cadastrar Nova Aula
                            </button>
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
