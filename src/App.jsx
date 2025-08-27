// React Dictionary App
// Features:
// - Theme toggle (light/dark) with persistence
// - Responsive layout
// - Search bar with live suggestions (up to 10), keyboard navigation, and highlight
// - Suggestions remain visible when clicking outside
// - Word detail panel with animation
// - Modern UI and accessibility
// Main components: App, SearchBar, WordDetail
import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import WordDetail from "./WordDetail";
import "./App.css";

function App() {
  const [selectedWord, setSelectedWord] = useState(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
      );
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [theme]);

  const handleSelectWord = (wordObj) => {
    setSelectedWord(wordObj);
  };

  const handleCloseDetail = () => {
    setSelectedWord(null);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="App">
      <button
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
        title={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
      >
        {theme === "dark" ? "🌞" : "🌙"}
      </button>

      {/* MAIN CONTENT WRAPPER - This is the key fix */}
      <div className="main-content">
        <h1>BM Dictionary</h1>
        <SearchBar onSelectWord={handleSelectWord} />
        <WordDetail wordObj={selectedWord} onClose={handleCloseDetail} />
      </div>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section about-app">
            <h3>About This Dictionary App</h3>
            <p>
              This is a simple dictionary app of Bishnupriya Manipuri Language
              to English Language.
            </p>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-section reference">
            <h3>Reference</h3>
            <p>
              <span>
                Bishnupriya Manipuri to English Dictionary, by Dr. Kali Prasad
                Sinha. You can read the original dictionary from{" "}
              </span>
              <a
                href="https://archive.org/details/bishupriya-manipuri-to-english-dictionary-dr.-kali-prasad-sinha/page/n7/mode/2up"
                target="_blank"
                rel="noopener noreferrer"
              >
                Internet Archive
              </a>
            </p>
          </div>

          <div className="footer-divider"></div>
          <div className="footer-section about-me">
            <h3>About Me</h3>
            <p>
              Hi, I'm Ringku. I'm just an Engineer! I'm just curious about my
              Bishnupriya Manipuri literature. For any suggestions or
              corrections, please contact me.
            </p>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-section contact-info">
            <h3>Contact</h3>
            <ul>
              <li>
                <span className="contact-icon" title="Email" aria-label="Email">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="20" height="20" rx="4" fill="#e3edfc" />
                    <path
                      d="M4 6.5V13.5C4 14.0523 4.44772 14.5 5 14.5H15C15.5523 14.5 16 14.0523 16 13.5V6.5C16 5.94772 15.5523 5.5 15 5.5H5C4.44772 5.5 4 5.94772 4 6.5Z"
                      stroke="#1a73e8"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M4.5 6.5L10 11.5L15.5 6.5"
                      stroke="#1a73e8"
                      strokeWidth="1.2"
                    />
                  </svg>
                </span>
                <a href="mailto:ringkuxinha@gmail.com">Ringku Singha</a>
              </li>
              <li>
                <span
                  className="contact-icon"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="20" height="20" rx="4" fill="#e3edfc" />
                    <path
                      d="M12.07 6.5H13.5V4.11C13.25 4.08 12.39 4 11.4 4C9.33 4 7.91 5.24 7.91 7.53V9.5H5.5V12.14H7.91V18H10.66V12.14H12.97L13.35 9.5H10.66V7.79C10.66 7.02 10.87 6.5 12.07 6.5Z"
                      fill="#1a73e8"
                    />
                  </svg>
                </span>
                <a
                  href="https://www.facebook.com/ringku.singha.794/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ringku Singha
                </a>
              </li>
              <li>
                <span
                  className="contact-icon"
                  title="LinkedIn"
                  aria-label="LinkedIn"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="20" height="20" rx="4" fill="#e3edfc" />
                    <path
                      d="M6.5 8.5V14M10 11.5V14M10 11.5C10 10.3954 10.8954 9.5 12 9.5C13.1046 9.5 14 10.3954 14 11.5V14M8 6.5C8 7.05228 7.55228 7.5 7 7.5C6.44772 7.5 6 7.05228 6 6.5C6 5.94772 6.44772 5.5 7 5.5C7.55228 5.5 8 5.94772 8 6.5Z"
                      stroke="#1a73e8"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <a
                  href="https://linkedin.com/in/ringku1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ringku Singha
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
