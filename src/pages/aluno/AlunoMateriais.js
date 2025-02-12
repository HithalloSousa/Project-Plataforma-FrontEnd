import React, { useState, useEffect } from "react";
import SidebarNewAluno from "../../components/SideBarNewAluno";
import "../../styles/aluno/AlunoMateriais.css";
import axios from "axios";
import API_BASE_URL from "../../config";
import { FaFileAlt, FaImage, FaLink, FaHome } from "react-icons/fa"; // Ícones para melhor visualização

const AlunoMateriais = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [materiais, setMateriais] = useState([]);
    const [tipoSelecionado, setTipoSelecionado] = useState("inicio");

    const fetchMateriais = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/materiais/`);
            setMateriais(response.data);
        } catch (error) {
            console.error("Erro ao buscar os materiais:", error);
        }
    };

    useEffect(() => {
        fetchMateriais();
    }, []);

    const materiaisFiltrados = materiais.filter((material) => 
        tipoSelecionado !== "inicio" && material.categoria.tipo === tipoSelecionado
    );

    return (
        <div className="aluno-layout">
            <SidebarNewAluno isOpen={isSidebarOpen} toggleSideBar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
                <h1 className="titulo">📚 Banco de Materiais</h1>

                <div className="filtro-botoes">
                    <button className={tipoSelecionado === "inicio" ? "active" : ""} onClick={() => setTipoSelecionado("inicio")}><FaHome /> Início</button>
                    <button className={tipoSelecionado === "Chart" ? "active" : ""} onClick={() => setTipoSelecionado("Chart")}><FaImage /> Charts</button>
                    <button className={tipoSelecionado === "Link" ? "active" : ""} onClick={() => setTipoSelecionado("Link")}><FaLink /> Links</button>
                    <button className={tipoSelecionado === "Texto" ? "active" : ""} onClick={() => setTipoSelecionado("Texto")}><FaFileAlt /> Textos</button>
                </div>

                {tipoSelecionado === "inicio" ? (
                    <div className="intro-text">
                        <h2>Bem-vindo ao Banco de Materiais!</h2>
                        <p>Aqui você encontrará diversos recursos para apoiar seus estudos.</p>
                        <ul>
                            <li><FaImage /> <strong>Charts:</strong> Diagramas e gráficos ilustrativos.</li>
                            <li><FaLink /> <strong>Links:</strong> Referências externas para aprofundamento.</li>
                            <li><FaFileAlt /> <strong>Textos:</strong> Materiais escritos para leitura.</li>
                        </ul>
                    </div>
                ) : (
                    <div className="materias-list">
                        {materiaisFiltrados.length > 0 ? (
                            materiaisFiltrados.map((material) => (
                                <div key={material.id} className="materias-card">
                                    <p className="materias-descricao">{material.categoria.tipo}</p>

                                    {material.categoria.tipo === "Chart" && (
                                        <img
                                            src={material.chart.startsWith("http") ? material.chart : `https://res.cloudinary.com/dxy12ffx0/${material.chart}`}
                                            alt="Chart"
                                            className="chart-image"
                                            onError={(e) => (e.target.style.display = "none")}
                                        />
                                    )}

                                    {material.categoria.tipo === "Link" && (
                                        <a href={material.link} target="_blank" rel="noopener noreferrer" className="material-link">
                                            🔗 Acesse o Material
                                        </a>
                                    )}

                                    {material.categoria.tipo === "Texto" && (
                                        <div className="material-texto" style={{whiteSpace: "pre-wrap"}}>{material.conteudo}</div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="mensagem-sem-materiais">
                                <p>Não há materiais disponíveis para a categoria "{tipoSelecionado}".</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlunoMateriais;