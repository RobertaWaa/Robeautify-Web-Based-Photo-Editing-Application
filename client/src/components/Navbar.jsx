import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../assets/images/logo.png";
import "../assets/styles/style.css";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!currentUser);
  }, [currentUser, location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Edit Photo", path: "/edit-photo" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Robeautify Logo" style={{ height: "40px" }} />
          <span className="ms-2 text-robeautify-dark fw-semibold fs-4">
            Robeautify
          </span>
        </Link>

        {/* Button hamburger */}
        <button
          className="navbar-toggler d-lg-none border-0"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* For desktop */}
        <div className="collapse navbar-collapse d-lg-flex">
          <ul className="navbar-nav mx-auto">
            {navLinks.map((link) => (
              <motion.li
                key={link.name}
                className="nav-item mx-2"
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  className={`nav-link ${
                    isActive(link.path)
                      ? "text-robeautify-dark fw-medium active"
                      : "text-gray-600"
                  }`}
                  to={link.path}
                >
                  <span>{link.name}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
          <ul className="navbar-nav">
            {isLoggedIn ? (
              <>
                <motion.li className="nav-item" whileHover={{ scale: 1.05 }}>
                  <Link
                    className="nav-link btn btn-outline-robeautify border-robeautify me-2"
                    to="/my-account"
                  >
                    My Account
                  </Link>
                </motion.li>
                <motion.li className="nav-item" whileHover={{ scale: 1.05 }}>
                  <button
                    className="nav-link btn btn-outline-danger"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </motion.li>
              </>
            ) : (
              <>
                <motion.li className="nav-item" whileHover={{ scale: 1.05 }}>
                  <Link
                    className="nav-link btn btn-outline-primary me-2"
                    to="/login"
                  >
                    Log In
                  </Link>
                </motion.li>
                <motion.li className="nav-item" whileHover={{ scale: 1.05 }}>
                  <Link className="nav-link btn btn-primary" to="/signup">
                    Sign Up
                  </Link>
                </motion.li>
              </>
            )}
          </ul>
        </div>

        {/* Meniu for mobile */}
        {mobileMenuOpen && (
          <div className="d-lg-none w-100 mobile-menu">
            <div className="bg-light p-3 mt-2 rounded shadow">
              <ul className="navbar-nav">
                {navLinks.map((link) => (
                  <li key={link.name} className="nav-item py-2">
                    <Link
                      className={`nav-link d-block ${
                        isActive(link.path)
                          ? "text-robeautify-dark fw-medium"
                          : "text-gray-600"
                      }`}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li className="nav-item py-2">
                  {isLoggedIn ? (
                    <>
                      <Link
                        className="btn btn-outline-robeautify border-robeautify w-100 mb-2 text-center"
                        to="/my-account"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <button
                        className="btn btn-outline-danger w-100 text-center"
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        className="btn btn-outline-primary w-100 mb-2 text-center"
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Log In
                      </Link>
                      <Link
                        className="btn btn-primary w-100 text-center"
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
