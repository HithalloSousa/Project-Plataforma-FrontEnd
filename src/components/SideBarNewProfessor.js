import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaUser, FaEnvelope, FaSignOutAlt, FaTasks} from 'react-icons/fa';
import '../styles/SideBar2.css';

const SidebarNewProfessor = ({ isOpen, toggleSideBar }) => {
  const navigate = useNavigate();

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
          <NavLink to="/professor-dashboard" className="menu-item">
            <FaHome />
            <span>Home</span>
          </NavLink>

          <NavLink to="/professor-alunos" className="menu-item" activeClassName="active">
            <FaUser />
            <span>Students</span>
          </NavLink>

          <NavLink to="/professor-tarefas" className="menu-item" activeClassName="active">
            <FaTasks />
            <span>Tasks</span>
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

export default SidebarNewProfessor;
