import React from 'react';
import './Footer.css'; 
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <div className="footer-links">
          <Link to="/" className="footer-link">PORTFOLIO</Link>
        </div>
        <div className="footer-copyright">
          All content Copyright © 2025 Joseph Rhodes
        </div>
      </div>
      <a href="#top" className="footer-back-to-top">↑</a>
    </footer>
  );
};

export default Footer;
