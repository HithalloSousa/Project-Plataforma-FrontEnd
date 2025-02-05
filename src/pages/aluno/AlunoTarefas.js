import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SidebarAluno from "../../components/SideBarAluno";
import "../../styles/aluno/Aluno.css";
import "../../styles/aluno/AlunoTarefas.css";

const AlunoTarefas = () => {
    const { id } = useParams();
    const alunoId = id;
    const [aluno, setAluno] = useState({});
    const [tarefas, setTarefas] = useState([]);
    const [imagens, setImagens] = useState({});
    const [previews, setPreviews] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = 'Tarefas'
        const fetchData = async () => {
            try {
                const [alunoResponse, tarefasResponse] = await Promise.all([
                    axios.get(`https://customenglish.up.railway.app/api/aluno/${alunoId}/`),
                    axios.get(`https://customenglish.up.railway.app/api/tarefas/${alunoId}/`)
                ]);
                setAluno(alunoResponse.data);
                setTarefas(tarefasResponse.data);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                setError("Erro ao carregar dados. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleFileChange = (event, tarefaId) => {
        const file = event.target.files[0];
        if (file) {
            setImagens((prev) => ({ ...prev, [tarefaId]: file }));
            setPreviews((prev) => ({ ...prev, [tarefaId]: URL.createObjectURL(file) }));
        }
    };

    const concluirTarefa = async (tarefaId) => {
        const file = imagens[tarefaId];
        if (!file) {
            alert("Por favor, envie uma imagem antes de concluir a tarefa.");
            return;
        }

        const formData = new FormData();
        formData.append("imagem", file);
        formData.append("aluno_id", alunoId);
        formData.append("tarefa_id", tarefaId);

        try {
            const response = await axios.post(
                "https://customenglish.up.railway.app/api/tarefas/concluir-tarefa/",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            alert(response.data.message);
            console.log(response.data)
            setTarefas((prev) =>
                prev.map((tarefa) =>
                    tarefa.id === tarefaId
                        ? {
                              ...tarefa,
                              concluido: true,
                              imagem_concluida: response.data.imagem,
                              imagem_correcao: response.data.imagem_correcao, // Atualiza a correção
                          }
                        : tarefa
                )
            );
        } catch (error) {
            console.error("Erro ao concluir a tarefa:", error);
            alert("Erro ao concluir a tarefa. Tente novamente.");
        }
    };

    if (loading) {
        return <div className="loading">Carregando...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="aluno-layout">
            <SidebarAluno />
            <div className="main-content-aluno">
                <h1 className="h1-tarefa-aluno">Tarefas</h1>
                <div className="tarefas-container">
                    {tarefas.map((tarefa) => (
                        <div key={tarefa.id} className="tarefa-card">
                            <h2 className="tarefa-titulo">{tarefa.titulo}</h2>
                            <p className="tarefa-descricao">{tarefa.descricao}</p>
                            {tarefa.arquivo && (
                                <a href={tarefa.arquivo} download target="_blank" rel="noopener noreferrer" className="download-button">
                                    📥 Baixar Arquivo
                                </a>
                            )}

                            <div className="upload-section">
                                <h3 className="upload-title">Enviar Resposta</h3>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="file-input"
                                    onChange={(event) => handleFileChange(event, tarefa.id)}
                                />
                                {previews[tarefa.id] && (
                                    <div className="preview-image">
                                        <h4>Pré-visualização:</h4>
                                        <div className="image-container"> 
                                            <img src={previews[tarefa.id]} alt="Pré-visualização" className="tarefa-imagem" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {tarefa.imagem_concluida && (
                                <div className="imagem-resposta">
                                    <h4 className="imagem-title">Imagem Enviada:</h4>
                                    <div className="image-container"> 
                                        <img
                                            src={tarefa.imagem_concluida.startsWith("http") ? tarefa.imagem_concluida : `http://localhost:8000${tarefa.imagem_concluida}`}
                                            alt="Tarefa Concluída"
                                            className="tarefa-imagem"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Se houver uma imagem de correção, mostrar o botão de download */}
                            {tarefa.concluido && (
                                <div className="correcao-section">
                                    <h4 className="imagem-title">Correção do Professor:</h4>
                                    {tarefa.imagem_correcao ? (
                                        <a
                                            href={tarefa.imagem_correcao.startsWith("http") ? tarefa.imagem_correcao : `http://localhost:8000${tarefa.imagem_correcao}`}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="download-button"
                                        >
                                            📥 Baixar Correção
                                        </a>
                                    ) : (
                                        <p className="aguardando-correcao">🕒 Aguardando a correção do professor</p>
                                    )}
                                </div>
                            )}

                            <button
                                className={`concluir-button ${tarefa.concluido ? "concluida" : "pendente"}`}
                                onClick={() => concluirTarefa(tarefa.id)}
                                disabled={tarefa.concluido}
                            >
                                {tarefa.concluido ? "✅ Concluída" : "✔ Concluir Tarefa"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AlunoTarefas;
