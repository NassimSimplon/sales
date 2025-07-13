import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface ComboFilterProps {
  label: string;
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

export const ComboFilter: React.FC<ComboFilterProps> = ({
  label,
  options,
  value,
  onValueChange,
  placeholder = 'Search...',
  icon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onValueChange(newValue);
    setIsOpen(true);
  };

  const handleOptionClick = (option: string) => {
    setSearchTerm(option);
    onValueChange(option);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    onValueChange('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Delay closing to allow option clicks
    setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div className="combo-filter">
      <label className="filter-label">
        {icon}
        {label}
      </label>
      
      <div className="combo-container">
        <div className="combo-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="combo-input"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
          />
          {searchTerm && (
            <button className="clear-button" onClick={handleClear}>
              <X size={16} />
            </button>
          )}
        </div>

        {isOpen && filteredOptions.length > 0 && (
          <div className="combo-dropdown">
            {filteredOptions.map(option => (
              <button
                key={option}
                className="combo-option"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};