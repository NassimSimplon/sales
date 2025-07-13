import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface ListboxFilterProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  icon?: React.ReactNode;
}

export const ListboxFilter: React.FC<ListboxFilterProps> = ({
  label,
  options,
  selectedValues,
  onSelectionChange,
  icon
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    const newSelection = selectedValues.includes(option)
      ? selectedValues.filter(val => val !== option)
      : [...selectedValues, option];
    
    onSelectionChange(newSelection);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return `Select ${label.toLowerCase()}`;
    if (selectedValues.length === 1) return selectedValues[0];
    return `${selectedValues.length} selected`;
  };

  return (
    <div className="listbox-filter">
      <label className="filter-label">
        {icon}
        {label}
      </label>
      
      <div className="listbox-container">
        <button
          className="listbox-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="listbox-text">{getDisplayText()}</span>
          <ChevronDown 
            size={16} 
            className={`chevron ${isOpen ? 'rotated' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="listbox-dropdown">
            <div className="listbox-header">
              <button
                className="select-all-btn"
                onClick={() => {
                  if (selectedValues.length === options.length) {
                    onSelectionChange([]);
                  } else {
                    onSelectionChange([...options]);
                  }
                }}
              >
                {selectedValues.length === options.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="listbox-options">
              {options.map(option => (
                <button
                  key={option}
                  className={`listbox-option ${selectedValues.includes(option) ? 'selected' : ''}`}
                  onClick={() => handleOptionClick(option)}
                >
                  <span className="option-text">{option}</span>
                  {selectedValues.includes(option) && (
                    <Check size={16} className="check-icon" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};