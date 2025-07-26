import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { Guest, GuestData, fuzzySearch } from './utils/search';
import guestData from './data/guests.json';

function App() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const guests: GuestData = guestData;

  useEffect(() => {
    if (query.trim()) {
      const results = fuzzySearch(guests, query);
      setSuggestions(results);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [query, guests]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedGuest(null);
  };

  const handleSuggestionClick = (guest: Guest) => {
    setSelectedGuest(guest);
    setQuery(guest.name);
    setShowDropdown(false);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Find Your Table</h1>
        <div className="search-container">
          <input
            ref={inputRef}
            type="text"
            placeholder="Start typing your name..."
            value={query}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            className="search-input"
          />
          {showDropdown && suggestions.length > 0 && (
            <div className="dropdown">
              {suggestions.map((guest, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleSuggestionClick(guest)}
                >
                  {guest.name}
                </div>
              ))}
            </div>
          )}
        </div>
        {selectedGuest && (
          <div className="result">
            <h2>Welcome, {selectedGuest.name}!</h2>
            <p>You're seated at table <strong>{selectedGuest.table}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
