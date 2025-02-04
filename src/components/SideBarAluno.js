import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaTasks, FaSignOutAlt} from "react-icons/fa";
import { FaTimeline } from "react-icons/fa6";
import "../styles/aluno/SideBarAluno.css";

const SidebarAluno = () => {
  const alunoId = localStorage.getItem("user_id")
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  }

  return (
    <div className="sidebar-aluno">
      <div className="sidebar-header-aluno">
        <h2>Welcome Student</h2>
      </div>
      
      <nav className="sidebar-nav-aluno">
        <NavLink to="/aluno-dashboard" className="sidebar-link-aluno" activeClassName="active">
          <FaHome className="sidebar-icon-aluno" />
          <span>Home</span>
        </NavLink>

        <NavLink to={`/aluno-fichamento/${alunoId}`} className={"sidebar-link-aluno"} activeClassName="active">
          <FaUser className="sidebar-icon-aluno" />
          <span>Fichamento</span>
        </NavLink>

        <NavLink to={`/aluno-tarefas/${alunoId}`} className="sidebar-link-aluno" activeClassName="active">
          <FaTasks className="sidebar-icon-aluno" />
          <span>Tarefas</span>
        </NavLink>
        <NavLink to={`/aluno-cronograma/${alunoId}`} className="sidebar-link-aluno" activeClassName="active">
          <FaTimeline className="sidebar-icon-aluno" />
          <span>Cronograma</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer-aluno">
        <NavLink to='/login' className="sidebar-link-aluno" onClick={handleLogout}>
          <FaSignOutAlt className="sidebar-icon-aluno" />
          <span>Sair</span>
        </NavLink>
      </div>
    </div>
  );
};

export default SidebarAluno;