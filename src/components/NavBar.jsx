import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.scss";
import "../styles/buttons.scss";

import Logo from "../assets/logos/Icon.png";
import Title from "../assets/logos/Title.svg";
import Mode from "../assets/images/dark-mode.svg";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (location.pathname === "/login") return null;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleTheme = () => {
    const body = document.body;

    if (body.classList.contains("dark")) {
      body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={Logo} alt="Ufloria Logo" className="logo" />
        <img src={Title} alt="Ufloria Title" className="title" />
      </div>

      {/* Hamburger for mobile */}
      <button
        className="hamburger show-mobile"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <div className={`nav-links ${open ? "open" : ""}`}>
        <Link
          to="/"
          className={location.pathname === "/" ? "active" : ""}
          onClick={closeMenu}
        >
          Dashboard
        </Link>

        <Link
          to="/perfumes"
          className={location.pathname === "/perfumes" ? "active" : ""}
          onClick={closeMenu}
        >
          Perfumes
        </Link>

        <Link
          to="/supplier"
          className={location.pathname === "/supplier" ? "active" : ""}
          onClick={closeMenu}
        >
          Supplier
        </Link>
      </div>

      <div className="nav-right">
        <img onClick={toggleTheme} src={Mode} className="mode" />
        <button onClick={logout} className="btn btn-danger">
          Logout
        </button>
      </div>
    </nav>
  );
}
