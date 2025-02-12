import React, { useState, useEffect } from "react";
import SidebarNewProfessor from "../../components/SideBarNewProfessor";
import "../../styles/professor/ProfessorMateriais.css"
import axios from "axios"; // Para fazer a requisição à API
import API_BASE_URL from "../../config";

const ProfessorMateriais = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado da SideBar
    const [materiais, setMateriais] = useState([]); // Lista de materiais
    const [categorias, setCategorias] = useState([]);
    const [novoMaterial, setNovoMaterial] = useState({ categoria: "" }); // Estado para criar novo material
    const [tipoSelecionado, setTipoSelecionado] = useState("todos"); // Estado para filtrar por tipo
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("texto"); // Estado para a categoria
    const [conteudo, setConteudo] = useState(""); // Estado para o conteúdo (texto ou link)
    const [arquivo, setArquivo] = useState(null); // Estado para o arquivo (imagem)


    // Efeito para carregar os materiais ao montar o componente
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/categorias-materiais/`);
                setCategorias(response.data);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        };
        fetchCategorias();
        fetchMateriais();
    }, []);

    // Faz a mudança de categoria
    const handleCategoriaChange = (event) => {
        setCategoriaSelecionada(event.target.value);
    };

    // Buscar materiais da API
    const fetchMateriais = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/materiais/`);
            setMateriais(response.data);
        } catch (error) {
            console.error("Erro ao buscar os materiais:", error);
        }
    };

    // Excluir material
    const handleExcluirMaterial = async (materialId) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/materiais/deletar/${materialId}/`);
            alert("Material excluído com sucesso!");
            fetchMateriais(); // Atualiza a lista após exclusão
        } catch (error) {
            console.error("Erro ao excluir material:", error);
            alert("Erro ao excluir material");
        }
    };


    const handleCriarMaterial = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("categoria_id", Number(categoriaSelecionada)); // Envia o ID da categoria

        // Adiciona o campo correto com base na categoria
        if (categoriaSelecionada === "1") { // Supondo que "Texto" tenha ID 1
            formData.append("conteudo", conteudo);
        } else if (categoriaSelecionada === "3") { // Supondo que "Link" tenha ID 2
            formData.append("link", conteudo);
        } else if (categoriaSelecionada === "2" && arquivo) { // Supondo que "Chart" tenha ID 3
            formData.append("chart", arquivo);
        }


        try {
            const response = await axios.post(`${API_BASE_URL}/api/materiais/criar/`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Material criado com sucesso!");
            fetchMateriais()
        } catch (error) {
            console.error("Erro ao criar material:", error);
            alert("Erro ao criar material");
        }
    };

    // Filtra os materiais com base no tipo selecionado
    const materiaisFiltrados = materiais.filter((material) => {
        if (tipoSelecionado === "todos") {
            return true; // Mostra todos os materiais
        } else {
            return material.categoria.tipo === tipoSelecionado; // Filtra pelo tipo selecionado
        }
    });


    return (
        <div className="professor-layout">
            <SidebarNewProfessor isOpen={isSidebarOpen} toggleSideBar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
                <h1>Lista de Materiais</h1>


                {/* Formulário para criar novo material (se necessário) */}
                <form onSubmit={handleCriarMaterial} className="form">
                    <h2>Criar Novo Material</h2>

                    {/* Campo para selecionar a categoria */}
                    <div>
                        <label>Categoria:</label>
                        <select value={categoriaSelecionada} onChange={handleCategoriaChange} required>
                            <option value="">Selecione uma categoria</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Renderização condicional dos campos */}
                    {categoriaSelecionada === "1" && ( // Supondo que "Texto" tenha ID 1
                        <div>
                            <label>Conteúdo:</label>
                            <textarea
                                value={conteudo}
                                onChange={(e) => setConteudo(e.target.value)}
                                placeholder="Digite o texto"
                                required
                            />
                        </div>
                    )}

                    {categoriaSelecionada === "3" && ( // Supondo que "Link" tenha ID 2
                        <div>
                            <label>Link:</label>
                            <input
                                type="text"
                                value={conteudo}
                                onChange={(e) => setConteudo(e.target.value)}
                                placeholder="Digite o link"
                                required
                            />
                        </div>
                    )}

                    {categoriaSelecionada === "2" && ( // Supondo que "Chart" tenha ID 3
                        <div>
                            <label>Arquivo da Imagem:</label>
                            <input
                                type="file"
                                onChange={(e) => setArquivo(e.target.files[0])}
                                accept="image/*"
                                required
                            />
                        </div>
                    )}

                    {/* Botão de envio */}
                    <button type="submit">Criar Material</button>
                </form>

                {/* Botões para filtrar por tipo */}
                <div className="filtro-botoes">
                    <button onClick={() => setTipoSelecionado("todos")}>Mostrar Todos</button>
                    <button onClick={() => setTipoSelecionado("Chart")}>Mostrar Charts</button>
                    <button onClick={() => setTipoSelecionado("Link")}>Mostrar Links</button>
                    <button onClick={() => setTipoSelecionado("Texto")}>Mostrar Textos</button>
                </div>

                

                {/* Lista de materiais filtrados */}
                <h2 className="subtitle">Materiais Criados</h2>
                <div className="tarefas-list">
                    {materiaisFiltrados.map((material) => (
                        <div key={material.id} className="tarefa-card">
                            <p className="tarefa-descricao">{material.categoria.tipo}</p>

                            {/* Renderização condicional do conteúdo */}
                            {material.categoria.tipo === "Chart" && (
                                <img
                                    src={material.chart.startsWith("http") 
                                        ? material.chart  // Se a URL já for completa
                                        : `https://res.cloudinary.com/dxy12ffx0/${material.chart}`}  // Concatenando a URL do Cloudinary corretamente
                                    alt="Chart"
                                    style={{ width: "100%", maxWidth: "300px" }}
                                    onError={(e) => {
                                        console.error("Erro ao carregar imagem:", e.target.src);
                                        e.target.style.display = "none";
                                    }}
                                />
                            )}


                            {material.categoria.tipo === "Link" && (
                                <a href={material.link} target="_blank" rel="noopener noreferrer">
                                    {material.link}
                                </a>
                            )}

                            {material.categoria.tipo === "Texto" && (
                                <textarea
                                    value={material.conteudo}
                                    readOnly
                                    style={{ width: "100%", height: "100px" }}
                                />
                            )}

                            {/* Botão para excluir material */}
                            <button
                                onClick={() => handleExcluirMaterial(material.id)}
                                type="submit"
                                className="submit-button-delete"
                            >
                                Excluir Material
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfessorMateriais;