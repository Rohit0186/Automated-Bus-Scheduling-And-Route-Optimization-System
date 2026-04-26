import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import ModernInput from './ModernInput';
import { MapPin, Loader2 } from 'lucide-react';

const StationAutocomplete = ({ label, value, onChange, placeholder, restrictedTo }) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (val) => {
    setQuery(val);
    onChange(val);
    if (val.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/stations/search?query=${val}`);
      let data = response.data;
      if (restrictedTo && restrictedTo.length > 0) {
        data = data.filter(s => restrictedTo.includes(s.name));
      }
      setSuggestions(data);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectSuggestion = (station) => {
    setQuery(station.name);
    onChange(station.name);
    setShowDropdown(false);
  };

  const handleFocus = () => {
    if (!query && restrictedTo && restrictedTo.length > 0) {
      // Show all restricted destinations as suggestions initially
      const initialSuggestions = restrictedTo.map((name, index) => ({ id: `res-${index}`, name }));
      setSuggestions(initialSuggestions);
      setShowDropdown(true);
    } else if (query && suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="autocomplete-container" ref={dropdownRef}>
      <ModernInput
        label={label}
        icon={MapPin}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onClick={handleFocus}
        placeholder={placeholder}
      />
      {loading && <Loader2 className="search-spinner" size={16} />}
      
      {showDropdown && suggestions.length > 0 && (
        <div className="suggestion-dropdown glass-effect">
          {suggestions.map((station) => (
            <div
              key={station.id}
              className="suggestion-item"
              onClick={() => selectSuggestion(station)}
            >
              <MapPin size={14} className="pin" />
              <div className="station-info">
                <span className="station-name">{station.name}</span>
                <span className="station-region">{station.region?.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StationAutocomplete;
