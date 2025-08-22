// SearchBar Component
// Features:
// - Live suggestions (up to 10) as you type
// - Keyboard navigation (arrow keys, enter, escape)
// - Suggestions remain visible when clicking outside
// - Highlighting of matched text
// - Loading spinner while fetching words
// - Accessibility with ARIA attributes
// - Calls onSelectWord when a word is selected
// - Modern, theme-aware UI
import React, { useState, useEffect, useRef } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSelectWord }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  // Load word list
  useEffect(() => {
    fetch("wordnet.json")
      .then((res) => res.json())
      .then((data) => {
        // Only keep entries with a word field
        setWords(data.filter((w) => typeof w.word === "string"));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load wordnet:", err);
        setLoading(false);
      });
  }, []);

  // Filter suggestions dynamically (from beginning of word)
  useEffect(() => {
    const value = inputValue.trim().toLowerCase();
    if (!value) {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveIdx(-1);
      return;
    }
    const filtered = words
      .filter(
        (wordObj) =>
          typeof wordObj.word === "string" &&
          wordObj.word.toLowerCase().startsWith(value)
      )
      .slice(0, 10);
    setSuggestions(filtered);
    setShowSuggestions(true);
    setActiveIdx(-1);
  }, [inputValue, words]);

  // Handle typing
  const handleChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  // Handle suggestion click
  const handleClick = (wordObj) => {
    setInputValue(wordObj.word);
    setSuggestions([]);
    setShowSuggestions(false);
    onSelectWord(wordObj);
  };

  // Handle Enter, ArrowUp, ArrowDown, Escape
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!showSuggestions) setShowSuggestions(true);
      setActiveIdx((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      const value = inputValue.trim().toLowerCase();
      if (!value) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      // If a suggestion is highlighted, select it
      if (showSuggestions && activeIdx >= 0 && suggestions[activeIdx]) {
        handleClick(suggestions[activeIdx]);
      } else {
        // Otherwise, do exact match search (same as Search button)
        const exactMatch = words.find(
          (wordObj) => wordObj.word.toLowerCase() === value
        );
        if (exactMatch) {
          setSuggestions([exactMatch]);
          setShowSuggestions(true);
          setActiveIdx(-1);
        } else {
          setSuggestions([]);
          setShowSuggestions(true);
          setActiveIdx(-1);
        }
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIdx(-1);
    }
  };

  // Highlight typed letters
  const highlightMatch = (word) => {
    const value = inputValue.trim();
    const start = word.toLowerCase().indexOf(value.toLowerCase());
    if (start === -1) return word;
    const end = start + value.length;
    return (
      <>
        <span className="highlight">{word.slice(0, start)}</span>
        <span className="highlight-match">{word.slice(start, end)}</span>
        <span className="highlight">{word.slice(end)}</span>
      </>
    );
  };

  // Click outside handler removed so suggestions stay visible

  return (
    <div className="search-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          Loading words...
        </div>
      )}

      <div className="search-row">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a word..."
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="search-input"
          disabled={loading}
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-activedescendant={
            activeIdx >= 0 ? `suggestion-${activeIdx}` : undefined
          }
          autoComplete="off"
        />

        <button
          className="search-button"
          onClick={() => {
            const value = inputValue.trim().toLowerCase();
            if (!value) {
              setSuggestions([]);
              setShowSuggestions(false);
              return;
            }
            const exactMatch = words.find(
              (wordObj) => wordObj.word.toLowerCase() === value
            );
            if (exactMatch) {
              setSuggestions([exactMatch]);
              setShowSuggestions(true);
              setActiveIdx(-1);
            } else {
              setSuggestions([]);
              setShowSuggestions(true);
              setActiveIdx(-1);
            }
          }}
          disabled={loading}
        >
          Search
        </button>
      </div>

      {showSuggestions && !loading && (
        <ul
          className="suggestions-list"
          id="suggestions-list"
          ref={suggestionRef}
        >
          {suggestions.length === 0 ? (
            <li className="no-suggestion">No results found</li>
          ) : (
            suggestions.map((wordObj, idx) => (
              <li
                key={idx}
                id={`suggestion-${idx}`}
                className={activeIdx === idx ? "active" : ""}
                onClick={() => handleClick(wordObj)}
                tabIndex={0}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(-1)}
              >
                <span className="suggestion-word">
                  {highlightMatch(wordObj.word)}
                </span>
                <span className="suggestion-pos">({wordObj.pos})</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
