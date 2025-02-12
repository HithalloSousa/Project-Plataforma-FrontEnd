import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate  } from "react-router-dom";
import Login from "./pages/Login";
import Aluno from "./pages/aluno/Aluno";
import TeacherDashboard from "./pages/professor/Professor";
import ProfessorAlunos from "./pages/professor/ProfessorAlunos"
import PrivateRoute from "./components/PrivateRoute";
import { StudentProvider } from "./contexts/StudentContext";
import ProfessorEditaAluno from "./pages/professor/ProfessorEditarAlunos";
import FichamentoForm from "./pages/professor/FichamentoForm";
import TarefaForm from "./pages/professor/TarefasForm";
import TarefasAluno from "./pages/professor/TarefasAluno";
import AlunoFichamento from "./pages/aluno/AlunoFichamento";
import AlunoTarefas from "./pages/aluno/AlunoTarefas";
import AlunoCronograma from "./pages/aluno/AlunoCronograma";
import AulasForm from "./pages/professor/AulasForm";
import ProfessorMateriais from "./pages/professor/ProfessorMateriais";
import AlunoMateriais from "./pages/aluno/AlunoMateriais";

const App = () => {
  return (
    <StudentProvider>

    
      <Router>
        <Routes>
          {/* Rota principal redirecionando para login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Página de login */}
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas */}
          <Route path="/" element={<PrivateRoute  />}> 
            {/* Rotas do Aluno*/}
            <Route path="/aluno-dashboard" element={<Aluno />} />
            <Route path="/aluno-fichamento/:id" element={<AlunoFichamento />} />
            <Route path="/aluno-tarefas/:id" element={<AlunoTarefas />} />
            <Route path="/aluno-cronograma/:id" element={<AlunoCronograma />} />
            <Route path="/aluno/materiais" element={<AlunoMateriais />} />
            {/* Rotas do Professor*/}
            <Route path="/professor-dashboard" element={<TeacherDashboard />} />
            <Route path="/professor-alunos" element={<ProfessorAlunos />} />
            <Route path="/professor/editar-aluno/:id" element={<ProfessorEditaAluno />} />
            <Route path="/professor/aluno/fichamento/criar/:id" element={<FichamentoForm  />} />
            <Route path="/professor/aluno/fichamento/editar/:id" element={<FichamentoForm />} />
            <Route path="/professor/aluno/aulas/criar/:id" element={<AulasForm />} />
            <Route path="/professor/aluno/aulas/editar/:id" element={<AulasForm />} />
            <Route path="/professor-tarefas" element={<TarefaForm />} />
            <Route path="/professor/aluno/tarefas/editar/:id" element={<TarefasAluno />} />
            <Route path="/professor/materiais" element={<ProfessorMateriais />} />
          </Route>

        </Routes>
      </Router>
    </StudentProvider>
  );
};

export default App;
