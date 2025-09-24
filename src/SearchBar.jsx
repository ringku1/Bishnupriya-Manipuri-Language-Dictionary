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
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Fuse from "fuse.js";
import "./SearchBar.css";

// Diacritic mapping removed - now using Fuse.js for fuzzy search

const SearchBar = forwardRef(({ onSelectWord }, ref) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchMode, setSearchMode] = useState("word"); // "word" or "definition"
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
    keys: ['word'], // Search in word field only
    threshold: 0.4, // Moderate fuzzy matching (0=exact, 1=match anything)
    distance: 100,  // Maximum character distance
    includeScore: true,
    shouldSort: true,
    minMatchCharLength: 1,
    ignoreLocation: true, // Don't care about character position
    findAllMatches: false
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
    
    const queryLower = query.toLowerCase();
    const results = new Set(); // Use Set to avoid duplicates
    
    // 1. Exact matches (highest priority)
    words.forEach(wordObj => {
      if (typeof wordObj.word === 'string' && 
          wordObj.word.toLowerCase() === queryLower) {
        results.add(wordObj);
      }
    });
    
    // 2. Prefix matches (second priority)
    if (results.size < 20) { // Only if we need more results
      words.forEach(wordObj => {
        if (typeof wordObj.word === 'string' && 
            wordObj.word.toLowerCase().startsWith(queryLower) &&
            !results.has(wordObj)) {
          results.add(wordObj);
        }
      });
    }
    
    return Array.from(results).slice(0, 20); // Limit Tier 1 to 20 results
  };
  
  // TIER 3: Definition Search (Fallback - 5-15ms)
  const definitionSearch = (query) => {
    if (!query || !words.length) return [];
    
    const queryLower = query.toLowerCase();
    const results = [];
    
    words.forEach(wordObj => {
      if (typeof wordObj.definition === 'string' && 
          wordObj.definition.toLowerCase().includes(queryLower)) {
        results.push(wordObj);
      }
    });
    
    return results.slice(0, 30); // Limit definition search to 30 results
  };
  
  // HYBRID SEARCH ORCHESTRATOR - Routes based on search mode
  const hybridSearch = (query) => {
    if (!query) return [];
    
    const startTime = performance.now();
    
    // Route based on search mode
    if (searchMode === "definition") {
      // Definition search mode - use Tier 3 only
      return definitionSearch(query);
    }
    
    // Word search mode - use Tier 1 + Tier 2 (existing logic)
    // TIER 1: Exact + Prefix (Fastest - always run first)
    const tier1Results = exactAndPrefixSearch(query);
    
    // If we have good exact/prefix results, might be enough
    if (tier1Results.length >= 10) {
      // console.log(`Tier 1 sufficient: ${performance.now() - startTime}ms`);
      return tier1Results;
    }
    
    // TIER 2: Fuzzy Search (Primary engine)
    let tier2Results = [];
    if (fuseInstance.current) {
      const fuseResults = fuseInstance.current.search(query);
      tier2Results = fuseResults
        .map(result => result.item)
        .slice(0, 30);
    }
    
    // Combine Tier 1 + Tier 2, removing duplicates
    const combinedResults = new Set();
    const finalResults = [];
    
    // Add Tier 1 results first (highest priority)
    tier1Results.forEach(item => {
      combinedResults.add(item.word.toLowerCase());
      finalResults.push(item);
    });
    
    // Add Tier 2 results, avoiding duplicates
    tier2Results.forEach(item => {
      if (!combinedResults.has(item.word.toLowerCase())) {
        combinedResults.add(item.word.toLowerCase());
        finalResults.push(item);
      }
    });
    
    // console.log(`Word search: ${performance.now() - startTime}ms (${tier1Results.length} + ${tier2Results.length})`);
    
    return finalResults.slice(0, 50); // Final limit of 50 results
  };

  // Handle search mode toggle and re-execute search
  const handleSearchModeChange = (newMode) => {
    setSearchMode(newMode);
    // Re-execute search with current query using new mode
    if (inputValue.trim()) {
      // Temporarily use the new mode for immediate search
      const query = inputValue.trim();
      let results = [];
      
      if (newMode === "definition") {
        results = definitionSearch(query);
      } else {
        // Word search mode - use existing Tier 1 + 2 logic
        const tier1Results = exactAndPrefixSearch(query);
        if (tier1Results.length >= 10) {
          results = tier1Results;
        } else {
          let tier2Results = [];
          if (fuseInstance.current) {
            const fuseResults = fuseInstance.current.search(query);
            tier2Results = fuseResults.map(result => result.item).slice(0, 30);
          }
          
          const combinedResults = new Set();
          const finalResults = [];
          tier1Results.forEach(item => {
            combinedResults.add(item.word.toLowerCase());
            finalResults.push(item);
          });
          tier2Results.forEach(item => {
            if (!combinedResults.has(item.word.toLowerCase())) {
              combinedResults.add(item.word.toLowerCase());
              finalResults.push(item);
            }
          });
          results = finalResults.slice(0, 50);
        }
      }
      
      setSuggestions(results);
      setShowSuggestions(true);
    }
  };

  // Old normalization functions removed - now using Fuse.js for fuzzy search
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

    // Check cache first
    const cachedResults = getCachedResults(cacheKey);
    if (cachedResults) {
      setSuggestions(cachedResults);
      setShowSuggestions(true);
      setActiveIdx(-1);
      return;
    }

    // Perform 3-tier hybrid search
    const searchResults = hybridSearch(value);

    // Cache the results
    setCachedResults(cacheKey, searchResults);

    setSuggestions(searchResults);
    setShowSuggestions(true);
    setActiveIdx(-1);
  }, [inputValue, words, searchMode]);

  // Handle suggestion click
  const handleClick = (wordObj) => {
    setInputValue(wordObj.word);
    setSuggestions([]);
    setShowSuggestions(false);
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

  return (
    <>
      {/* Search Mode Toggle */}
      <div className="search-mode-toggle">
        <button
          className={`toggle-button ${searchMode === "word" ? "active" : ""}`}
          onClick={() => handleSearchModeChange("word")}
          aria-pressed={searchMode === "word"}
        >
          Search By Word
        </button>
        <button
          className={`toggle-button ${searchMode === "definition" ? "active" : ""}`}
          onClick={() => handleSearchModeChange("definition")}
          aria-pressed={searchMode === "definition"}
        >
          Search In Definition
        </button>
      </div>
      
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
                  {highlightMatch(wordObj.word)}
                </span>
                <span className="suggestion-pos">({wordObj.pos})</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
    </>
  );
});

// Add display name for debugging
SearchBar.displayName = "SearchBar";

export default SearchBar;
