import React, { useState, useEffect } from "react";
import SidebarNewProfessor from "../../components/SideBarNewProfessor";
import "../../styles/professor/ProfessorMateriais.css";
import axios from "axios";
import API_BASE_URL from "../../config";

const ProfessorMateriais = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [materiais, setMateriais] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [arquivo, setArquivo] = useState(null);
    const [titulo, setTitulo] = useState("")
    const [tipoSelecionado, setTipoSelecionado] = useState(""); // Inicialmente seleciona "Texto"

    // Carrega categorias e materiais ao montar o componente
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

    // Busca materiais da API
    const fetchMateriais = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/materiais/`);
            setMateriais(response.data);
        } catch (error) {
            console.error("Erro ao buscar os materiais:", error);
        }
    };

    // Exclui um material
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

    // Limpa os campos do formulário
    const limparCampos = () => {
        setCategoriaSelecionada("");
        setTitulo("");
        setConteudo("");
        setArquivo(null);
    };

    // Cria um novo material
    const handleCriarMaterial = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("categoria_id", Number(categoriaSelecionada));
        formData.append("titulo", titulo)

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
            fetchMateriais(); // Atualiza a lista de materiais
            limparCampos(); // Limpa os campos do formulário
        } catch (error) {
            console.error("Erro ao criar material:", error);
            alert("Erro ao criar material");
        }
    };

    // Filtra os materiais com base no tipo selecionado
    const materiaisFiltrados = tipoSelecionado
        ? materiais.filter((material) => material.categoria.tipo === tipoSelecionado)
        : materiais.length > 0 ? [materiais[materiais.length - 1]] : [];

    return (
        <div className="professor-layout">
            <SidebarNewProfessor isOpen={isSidebarOpen} toggleSideBar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
                <h1>Lista de Materiais</h1>

                {/* Formulário para criar novo material */}
                <form onSubmit={handleCriarMaterial} className="form">
                    <h2>Criar Novo Material</h2>

                    {/* Campo para selecionar a categoria */}
                    <div>
                        <label style={{color:"white"}}>Categoria:</label>
                        <select value={categoriaSelecionada} onChange={(e) => setCategoriaSelecionada(e.target.value)} required>
                            <option value="">Selecione uma categoria</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ color: "white" }}>Título:</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Digite o título"
                            required
                            style={{ width: "100%" }} // Ajuste o estilo conforme necessário
                        />
                    </div>

                    {/* Renderização condicional dos campos */}
                    {categoriaSelecionada === "1" && ( // Supondo que "Texto" tenha ID 1
                        <div>
                            <label style={{color:"white"}}>Conteúdo:</label>
                            <textarea
                                value={conteudo}
                                onChange={(e) => setConteudo(e.target.value)}
                                placeholder="Digite o texto"
                                required
                                style={{ whiteSpace: "pre-wrap" }} // Mantém a formatação do texto
                            />
                        </div>
                    )}

                    {categoriaSelecionada === "3" && ( // Supondo que "Link" tenha ID 2
                        <div>
                            <label style={{color:"white"}}>Link:</label>
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
                            <label style={{color:"white"}}>Arquivo da Imagem:</label>
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
                    <button onClick={() => setTipoSelecionado("Chart")}>Mostrar Charts</button>
                    <button onClick={() => setTipoSelecionado("Link")}>Mostrar Links</button>
                    <button onClick={() => setTipoSelecionado("Texto")}>Mostrar Textos</button>
                </div>

                {/* Lista de materiais filtrados */}
                <h2 className="subtitle" style={{color:"white"}}>Materiais Criados</h2>
                <div className="tarefas-list">
                    {materiaisFiltrados.map((material) => (
                        <div key={material.id} className="tarefa-card">
                            <p className="tarefa-descricao">{material.titulo}</p>

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
                                    style={{ width: "100%", height: "100px", whiteSpace: "pre-wrap" }} // Mantém a formatação do texto
                                />
                            )}

                            {/* Botão para excluir material */}
                            <div style={{ marginTop: "10px" }}>
                                <button
                                    onClick={() => handleExcluirMaterial(material.id)}
                                    type="submit"
                                    className="submit-button-delete"
                                >
                                    Excluir Material
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfessorMateriais;