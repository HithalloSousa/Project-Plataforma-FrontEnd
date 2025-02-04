import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaTasks, FaSignOutAlt } from "react-icons/fa";
import "../styles/professor/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Welcome Teacher</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/professor-dashboard" 
          className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
        >
          <FaHome className="sidebar-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/professor-alunos" 
          className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
        >
          <FaUser className="sidebar-icon" />
          <span>Alunos</span>
        </NavLink>

        <NavLink 
          to="/professor-tarefas" 
          className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
        >
          <FaTasks className="sidebar-icon" />
          <span>Tarefas</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-link logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="sidebar-icon" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
