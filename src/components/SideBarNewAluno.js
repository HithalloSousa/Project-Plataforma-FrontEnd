import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaTasks, FaSignOutAlt, FaTimes, FaBars} from "react-icons/fa";
import { FaTimeline } from "react-icons/fa6";
import '../styles/SideBar2.css';

const SidebarNewAluno = ({ isOpen, toggleSideBar }) => {
  const navigate = useNavigate();
  const alunoId = localStorage.getItem("user_id")

  const handleLogoff = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <>
      <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <div className="menu-icon" onClick={toggleSideBar}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className="menu-items">
          <NavLink to="/aluno-dashboard" className="menu-item">
            <FaHome />
            <span>Home</span>
          </NavLink>

          <NavLink to={`/aluno-fichamento/${alunoId}`} className="menu-item" activeClassName="active">
            <FaUser />
            <span>Profile</span>
          </NavLink>

          <NavLink to={`/aluno-tarefas/${alunoId}`} className="menu-item" activeClassName="active">
            <FaTasks />
            <span>Tasks</span>
          </NavLink>

          <NavLink to={`/aluno-cronograma/${alunoId}`} className="menu-item" activeClassName="active">
            <FaTimeline />
            <span>RoadMap</span>
          </NavLink>
        </div>

        <div className="logoff-button" onClick={handleLogoff}>
          <FaSignOutAlt />
          <span>Logoff</span>
        </div>
      </div>

      {/* Overlay para escurecer o fundo quando a sidebar estiver aberta */}
      <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={toggleSideBar}></div>
    </>
  );
};

export default SidebarNewAluno;
