import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "./Footer.css"; // Import the external CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">HamroSubs</div>
        <p className="footer-text">
          Empowering digital subscriptions with seamless solutions.
        </p>
        <div className="footer-socials">
          <a href="#" className="social-link"><FaFacebookF /></a>
          <a href="#" className="social-link"><FaTwitter /></a>
          <a href="#" className="social-link"><FaInstagram /></a>
          <a href="#" className="social-link"><FaLinkedinIn /></a>
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} HamroSubs. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
