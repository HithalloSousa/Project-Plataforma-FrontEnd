import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/SideBarProfessor";
import "../../styles/professor/Professor.css";
import "../../styles/professor/ProfessorAluno.css";
import "../../styles/professor/TarefaForm.css";

const TarefaForm = () => {
    const [tarefas, setTarefas] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [novaTarefa, setNovaTarefa] = useState({ titulo: "", descricao: "", arquivo: null });

    const fetchTarefas = async () => {
        try {
            const response = await axios.get("https://customenglish.up.railway.app/api/tarefas/");
            const tarefasData = response.data;

            // Verifica se há IDs duplicados
            const ids = tarefasData.map(tarefa => tarefa.id);
            if (new Set(ids).size !== ids.length) {
                console.error("Erro: IDs duplicados encontrados nas tarefas.");
                return;
            }

            // Buscar alunos completos para cada tarefa
            const alunosResponse = await axios.get("https://customenglish.up.railway.app/api/alunos/");
            const alunosData = alunosResponse.data;

            // Verifica se há IDs duplicados
            const alunosIds = alunosData.map(aluno => aluno.id);
            if (new Set(alunosIds).size !== alunosIds.length) {
                console.error("Erro: IDs duplicados encontrados nos alunos.");
                return;
            }

            // Substituir IDs por objetos de aluno
            const tarefasComAlunos = tarefasData.map(tarefa => ({
                ...tarefa,
                alunos: tarefa.alunos.map(alunoId => 
                    alunosData.find(aluno => aluno.id === alunoId) || { id: alunoId, nome: "Desconhecido" }
                )
            }));

            setTarefas(tarefasComAlunos);

        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        }
    };

    const fetchAlunos = async () => {
        try {
            const response = await axios.get("https://customenglish.up.railway.app/api/alunos/");
            setAlunos(response.data);
        } catch (error) {
            console.error("Erro ao buscar alunos:", error);
        }
    };

    const handleCriarTarefa = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("titulo", novaTarefa.titulo);
        formData.append("descricao", novaTarefa.descricao);

        if (novaTarefa.arquivo) {
            formData.append("arquivo", novaTarefa.arquivo);
        }

        try {
            const response = await axios.post("https://customenglish.up.railway.app/api/criar-tarefas/", formData);
            alert("Tarefa criada com sucesso!!");
            setTarefas((prevTarefas) => [...prevTarefas, response.data]);
            setNovaTarefa({ titulo: "", descricao: "", arquivo: null });
        } catch (error) {
            console.error("Erro ao criar tarefa:", error);
            alert("Erro ao criar Tarefa");
        }
    };

    const handleAtribuirTarefa = async (tarefaId, alunoId) => {
        try {
            await axios.post("https://customenglish.up.railway.app/api/atribuir-tarefa/", {
                aluno_id: alunoId,
                tarefa_id: tarefaId
            });

            alert("Tarefa atribuída com sucesso!");

            // Encontra o objeto completo do aluno
            const alunoAssociado = alunos.find(aluno => aluno.id === alunoId);

            if (!alunoAssociado) {
                console.error("Aluno não encontrado na lista de alunos disponíveis.");
                return;
            }

            // Atualizando a lista de alunos disponíveis, removendo o aluno atribuído
            setAlunos(prevAlunos => prevAlunos.filter(aluno => aluno.id !== alunoId));

            // Atualizando a lista de tarefas
            setTarefas(prevTarefas =>
                prevTarefas.map(tarefa =>
                    tarefa.id === tarefaId
                        ? {
                            ...tarefa,
                            alunos: [...tarefa.alunos, alunoAssociado]  // Associe o aluno à tarefa
                        }
                        : tarefa
                )
            );
        } catch (error) {
            console.error("Erro ao atribuir tarefa:", error);
            alert("Erro ao atribuir tarefa.");
        }
    };

    const handleExcluirTarefa = async (tarefaId) => {
        try {
            await axios.delete(`https://customenglish.up.railway.app/api/deletar/tarefa/${tarefaId}/`);
            alert("Tarefa excluída com sucesso!");
            fetchTarefas();
        } catch (error) {
            console.error("Erro ao excluir tarefa:", error);
            alert("Erro ao excluir tarefa");
        }
    };

    const handleRemoverAluno = async (tarefaId, alunoId) => {
        try {
            const response = await axios.patch(
                `https://customenglish.up.railway.app/api/remover-aluno/${tarefaId}/`, { aluno_id: alunoId }
            );
    
            alert("Aluno removido da tarefa com sucesso!");
    
            // Atualiza o estado local das tarefas
            setTarefas(prevTarefas =>
                prevTarefas.map(tarefa =>
                    tarefa.id === tarefaId
                        ? {
                            ...tarefa,
                            alunos: tarefa.alunos.filter(aluno => aluno.id !== alunoId)  // Remove o aluno da tarefa
                        }
                        : tarefa
                )
            );
    
            // Adiciona o aluno de volta à lista de alunos disponíveis
            setAlunos(prevAlunos => {
                const alunoRemovido = tarefas.find(tarefa => tarefa.id === tarefaId)
                    .alunos.find(aluno => aluno.id === alunoId);
    
                // Verifica se o aluno já está na lista de alunos disponíveis
                if (!prevAlunos.some(aluno => aluno.id === alunoRemovido.id)) {
                    return [...prevAlunos, alunoRemovido];
                }
                return prevAlunos;
            });
    
        } catch (error) {
            console.error("Erro ao remover aluno:", error.response?.data || error.message);
            alert("Erro ao remover aluno da tarefa");
        }
    };

    useEffect(() => {
        fetchTarefas();
        fetchAlunos();
    }, []);

    return (
        <div className="professor-layout">
            <Sidebar />
            <div className="container">
                <h1>Lista de Tarefas</h1>

                <form onSubmit={handleCriarTarefa} className="form">
                    <h2>Criar Nova Tarefa</h2>
                    <div className="form-group">
                        <label className="label">Titulo:</label>
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            value={novaTarefa.titulo}
                            onChange={(e) => setNovaTarefa({ ...novaTarefa, titulo: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">Descrição:</label>
                        <textarea
                            name="descricao"
                            value={novaTarefa.descricao}
                            onChange={(e) => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
                            placeholder="Digite a descrição da tarefa..."
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">Arquivo:</label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setNovaTarefa({ ...novaTarefa, arquivo: e.target.files[0] })}
                        />
                    </div>
                    <button type="submit" className="submit-button">Criar Tarefa</button>
                </form>

                <h2 className="subtitle">Tarefas Criadas</h2>
                <div className="tarefas-list">
                    {tarefas.map((tarefa) => (
                        <div key={tarefa.id} className="tarefa-card">
                            <h3 className="tarefa-title">{tarefa.titulo}</h3>
                            <p className="tarefa-descricao">{tarefa.descricao}</p>

                            {/* Associar Aluno à Tarefa */}
                            <h4 className="alunos-title">Associar Aluno:</h4>
                            <ul>
                                {alunos
                                    .filter(aluno => !tarefa.alunos.some(assocAluno => assocAluno.id === aluno.id))
                                    .map((aluno) => (
                                        <li key={aluno.id} className="aluno-item">
                                            {aluno.nome}
                                            <button
                                                className="associar-button"
                                                onClick={() => handleAtribuirTarefa(tarefa.id, aluno.id)}
                                            >
                                                Associar
                                            </button>
                                        </li>
                                    ))}
                            </ul>

                            {/* Lista de Alunos Associados */}
                            <div className="alunos-list">
                                <h4 className="alunos-title">Alunos Associados:</h4>
                                <ul>
                                    {tarefa.alunos.map((aluno) => (
                                        <li key={aluno.id} className="aluno-item">
                                            {aluno.nome}
                                            <button onClick={() => handleRemoverAluno(tarefa.id, aluno.id)} className="associar-button-delete">
                                                Remover Aluno
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button onClick={() => handleExcluirTarefa(tarefa.id)} type="submit" className="submit-button-delete">
                                Excluir Tarefa
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TarefaForm;