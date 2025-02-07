import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/SideBarProfessor";
import "../../styles/professor/Professor.css";
import "../../styles/professor/ProfessorAluno.css"; // Estilos adicionais para o layout
import "../../styles/professor/FichamentoForm.css"
import API_BASE_URL from "../../config";

const FichamentoForm = () => {
  const { id } = useParams(); // Pega o ID do aluno da URL
  const navigate = useNavigate();

  const [niveis, setNiveis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNiveis = async () => {
    try {
      // const response = await axios.get("https://customenglish.up.railway.app/api/nivels/");
      const response = await axios.get(`${API_BASE_URL}/api/nivels/`);
      setNiveis(response.data);
    } catch (error) {
      console.error("Erro ao buscar os níveis:", error);
    }
  };

  const [fichamento, setFichamento] = useState({
    aluno_id: id,
    nivel_aluno: "",
    nivel_detalhado: "",
    cronograma_conteudos: "",
    metodologia_personalizada: "",
  });

  useEffect(() => {
    fetchNiveis();
    if (id) {
      axios
        .get(`${API_BASE_URL}/api/fichamento/${id}/`)
        .then((response) => {
          if (response.data) {
            setFichamento(response.data);
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar fichamento:", error);
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      aluno_id: id,
      nivel_aluno: fichamento.nivel_aluno,
      nivel_detalhado: fichamento.nivel_detalhado,
      cronograma_conteudos: fichamento.cronograma_conteudos,
      metodologia_personalizada: fichamento.metodologia_personalizada,
    };

    console.log("Payload enviado:", payload);

    try {
      if (fichamento.id) {
        await axios.put(
          `${API_BASE_URL}/api/fichamento/${id}/${fichamento.id}/`,
          payload
        );
      } else {
        await axios.post(`${API_BASE_URL}/api/criar-fichamento/`, payload);
      }
      alert("Fichamento feito com sucesso!");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError("Ocorreu um erro ao salvar o fichamento");
      console.error("Erro ao salvar fichamento:", error.response?.data || error);
    }
  };

  const handleChange = (e) => {
    setFichamento({
      ...fichamento,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="professor-layout">
      <Sidebar />
      <div className="main-content">
        <div className="form-container">
          <h2>{fichamento.id ? "Editar Fichamento" : "Criar Fichamento"}</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nivel_aluno">Nível de Inglês:</label>
              {niveis.length === 0 ? (
                <select disabled>
                  <option>Carregando níveis...</option>
                </select>
              ) : (
                <select
                  id="nivel_aluno"
                  name="nivel_aluno"
                  value={fichamento.nivel_aluno || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um nível</option>
                  {niveis.map((nivel) => (
                    <option key={nivel.id} value={nivel.id}>
                      {nivel.nome}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label>Nível Detalhado:</label>
              <textarea
                name="nivel_detalhado"
                value={fichamento.nivel_detalhado}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Cronograma de Conteúdos:</label>
              <textarea
                name="cronograma_conteudos"
                value={fichamento.cronograma_conteudos}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Metodologia Personalizada:</label>
              <textarea
                name="metodologia_personalizada"
                value={fichamento.metodologia_personalizada}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : fichamento.id ? "Atualizar" : "Criar"} Fichamento
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FichamentoForm;