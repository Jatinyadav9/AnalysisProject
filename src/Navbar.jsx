import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <ul className={isOpen ? "nav-links active" : "nav-links"} style={{ textAlign: "center" }}>
        <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
        <li><Link to="/about" onClick={() => setIsOpen(false)}>About</Link></li>
        <li><Link to="/compare" onClick={() => setIsOpen(false)}>Compare</Link></li>
        <li><Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
      </ul>
      <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
        &#9776;
      </div>
    </nav>
  );
};

export default Navbar;
