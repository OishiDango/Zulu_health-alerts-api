import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import styles from "./Navigation.module.css";

const Navigation = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        {/* Logo */}
        <div className={styles.logoSection} onClick={() => navigate("/")}>
          <img src={logo} alt="logo" className={styles.logo} />
          <span className={styles.logoText}>Health Alert</span>
        </div>

        {/* Dropdown Menu */}
        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={styles.menuButton}
          >
            ☰
          </button>

          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button
                onClick={() => {
                  navigate("/");
                  setDropdownOpen(false);
                }}
                className={styles.dropdownItem}
              >
                Home
              </button>

              <button
                onClick={() => {
                  navigate("/login");
                  setDropdownOpen(false);
                }}
                className={styles.dropdownItem}
              >
                Log in
              </button>

              <button
                onClick={() => {
                  navigate("/register");
                  setDropdownOpen(false);
                }}
                className={styles.dropdownItem}
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
