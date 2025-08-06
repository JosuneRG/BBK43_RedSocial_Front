import React from 'react';
import '../styles/Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} RedSocial • Todos los derechos reservados</p>
      <div className="footer-links">
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="/about">Acerca de</a>
        <a href="/contact">Contacto</a>
      </div>
    </footer>
  );
};

export default Footer;
