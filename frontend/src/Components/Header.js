import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    // Fetch folder names from the server
    fetch("https://jr5-travel.onrender.com/images")
      .then((response) => response.json())
      .then((data) => setFolders(data))
      .catch((error) => console.error("Error fetching folders:", error));
  }, []);

  return (
    <header className="header">
      <Link className="logo">JR5 Travels</Link>
      <nav className="nav">
        <Link className="nav-link dropdown">
          Portfolio
          <div className="dropdown-menu">
            {folders.map((folder) => (
              <Link
                to={`/gallery/${folder.folder}`} // Link to specific folder section
                key={folder.folder}
                className="dropdown-item"
              >
                {folder.folder}
              </Link>
            ))}
          </div>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
