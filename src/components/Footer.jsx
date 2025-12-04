import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.scss";
import Logo from "../assets/logos/Icon.png";

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="back-to-top" onClick={scrollTop}>
        ↑
      </div>

      <div className="footer-bar">
        <small>&copy; {year} Ufloria. All rights reserved.</small>
        <small className="made">Built with care — Uflora Sales</small>
      </div>
    </footer>
  );
}
