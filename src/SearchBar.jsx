// SearchBar Component
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Fuse from "fuse.js";
import "./SearchBar.css";
import { diacriticMap, normalizeString } from "./LetterVarient.js";

const SearchBar = forwardRef(({ onSelectWord }, ref) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);
  // Cache for search results - using useRef to persist across renders
  const searchCache = useRef(new Map());
  const CACHE_SIZE_LIMIT = 100; // Limit cache size to prevent memory issues

  // Expose focusInput method to parent component
  useImperativeHandle(
    ref,
    () => ({
      focusInput: () => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Also show suggestions if there's a value
          if (inputValue.trim()) {
            setShowSuggestions(true);
          }
        }
      },
    }),
    [inputValue]
  );

  // Cache management functions
  const getCachedResults = (query) => {
    return searchCache.current.get(query);
  };

  const setCachedResults = (query, results) => {
    // Implement LRU cache by removing oldest entries when limit is reached
    if (searchCache.current.size >= CACHE_SIZE_LIMIT) {
      const firstKey = searchCache.current.keys().next().value;
      searchCache.current.delete(firstKey);
    }
    searchCache.current.set(query, results);
  };

  // Fuse.js configuration for fuzzy search
  const fuseOptions = {
    keys: ["word"], // Search in word field only
    threshold: 0.4, // Moderate fuzzy matching (0=exact, 1=match anything)
    distance: 100, // Maximum character distance
    includeScore: true,
    shouldSort: true,
    minMatchCharLength: 1,
    ignoreLocation: true, // Don't care about character position
    findAllMatches: false,
  };

  // Create Fuse instance when words are loaded
  const fuseInstance = useRef(null);

  useEffect(() => {
    if (words.length > 0 && !fuseInstance.current) {
      fuseInstance.current = new Fuse(words, fuseOptions);
    }
  }, [words]);

  // TIER 1: Exact + Prefix Matching (Fastest - <1ms)
  const exactAndPrefixSearch = (query) => {
    if (!query || !words.length) return [];

    const normalizedQuery = normalizeString(query.toLowerCase());
    const prefixPattern = createDiacriticPattern(query);
    const results = new Set();

    // 1. Exact matches (highest priority)
    words.forEach((wordObj) => {
      if (typeof wordObj.word === "string") {
        const normalizedWord = normalizeString(wordObj.word.toLowerCase());
        if (normalizedWord === normalizedQuery) {
          results.add(wordObj);
        }
      }
    });

    // 2. Prefix matches (second priority)
    if (results.size < 20) {
      words.forEach((wordObj) => {
        if (
          typeof wordObj.word === "string" &&
          prefixPattern.test(wordObj.word) &&
          !results.has(wordObj)
        ) {
          results.add(wordObj);
        }
      });
    }

    return Array.from(results).slice(0, 20);
  };


  // HYBRID SEARCH ORCHESTRATOR - Word search only (Tier 1 + Tier 2)
  const hybridSearch = (query) => {
    if (!query) return [];

    // TIER 1: Exact + Prefix (Fastest - always run first)
    const tier1Results = exactAndPrefixSearch(query);

    // If we have good exact/prefix results, might be enough
    if (tier1Results.length >= 10) {
      return tier1Results;
    }

    // TIER 2: Fuzzy Search (Primary engine)
    let tier2Results = [];
    if (fuseInstance.current) {
      const fuseResults = fuseInstance.current.search(query);
      tier2Results = fuseResults.map((result) => result.item).slice(0, 30);
    }

    // Combine Tier 1 + Tier 2, removing duplicates
    const combinedResults = new Set();
    const finalResults = [];

    // Add Tier 1 results first (highest priority)
    tier1Results.forEach((item) => {
      combinedResults.add(item.word.toLowerCase());
      finalResults.push(item);
    });

    // Add Tier 2 results, avoiding duplicates
    tier2Results.forEach((item) => {
      if (!combinedResults.has(item.word.toLowerCase())) {
        combinedResults.add(item.word.toLowerCase());
        finalResults.push(item);
      }
    });
    
    return finalResults.slice(0, 50); // Final limit of 50 results
  };

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

  const handleChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };
  // Filter suggestions dynamically using 3-tier hybrid search with caching
  useEffect(() => {
    const value = inputValue.trim();
    if (!value) {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveIdx(-1);
      return;
    }

    const cacheKey = value.toLowerCase();

    // Check cache first (mode-specific)
    const cachedResults = getCachedResults(cacheKey);
    if (cachedResults) {
      setSuggestions(cachedResults);
      setShowSuggestions(true);
      setActiveIdx(-1);
      return;
    }

    // Perform 3-tier hybrid search
    const searchResults = hybridSearch(value);

    // Cache the results (mode-specific)
    setCachedResults(cacheKey, searchResults);

    setSuggestions(searchResults);
    setShowSuggestions(true);
    setActiveIdx(-1);
  }, [inputValue, words]);

  // Handle suggestion click
  const handleClick = (wordObj) => {
    onSelectWord(wordObj);
  };

  // Clear input function - moved here for reusability
  const clearInput = () => {
    setInputValue("");
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIdx(-1);
    // Focus back on input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle Enter, ArrowUp, ArrowDown, Escape
  const handleKeyDown = (e) => {
    // Handle Delete/Backspace to clear when Ctrl/Cmd is held
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === "Backspace" || e.key === "Delete")
    ) {
      e.preventDefault();
      clearInput();
      return;
    }

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
        // Otherwise, perform hybrid search (same as Search button)
        const searchResults = hybridSearch(value);
        setSuggestions(searchResults);
        setShowSuggestions(true);
        setActiveIdx(-1);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIdx(-1);
    }
  };

  // Highlight typed letters
  function highlightMatch(text, query) {
    if (!query) return text;
    const normalizedText = normalizeString(text);
    const normalizedQuery = normalizeString(query);

    const idx = normalizedText.indexOf(normalizedQuery);
    if (idx === -1) return text;

    // Find the actual substring in original text
    const start = idx;
    const end = idx + normalizedQuery.length;
    return (
      <>
        {text.slice(0, start)}
        <span className="highlight">{text.slice(start, end)}</span>
        {text.slice(end)}
      </>
    );
  }

  // Helper: Build regex for diacritic-aware search
  const createDiacriticPattern = (input) => {
    const patternString = input
      .split("")
      .map((char) => {
        if (diacriticMap[char]) {
          return `[${diacriticMap[char].join("")}]`;
        } else {
          return char;
        }
      })
      .join("");
    return new RegExp(`^${patternString}`, "i");
  };

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
            placeholder='Type "ককসি" or "Kaksi"'
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
            title="Press Ctrl+K (or Cmd+K on Mac) to focus this search box"
          />
          {inputValue && (
            <button
              className="clear-button"
              onClick={clearInput}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  clearInput();
                }
              }}
              disabled={loading}
              title="Clear search (Ctrl+Backspace or click)"
              aria-label="Clear search input"
              tabIndex={0}
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
          )}
          <button
            className="search-button"
            onClick={() => {
              const value = inputValue.trim();
              if (!value) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
              }
              // Perform 3-tier hybrid search
              const searchResults = hybridSearch(value);
              setSuggestions(searchResults);
              setShowSuggestions(true);
              setActiveIdx(-1);
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
                    {highlightMatch(wordObj.word, inputValue)}
                  </span>
                  <span className="suggestion-pos">({wordObj.pos})</span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
  );
});

// Add display name for debugging
SearchBar.displayName = "SearchBar";

export default SearchBar;
