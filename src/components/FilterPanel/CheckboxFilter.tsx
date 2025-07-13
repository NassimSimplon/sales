import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxOption {
  key: string;
  label: string;
  description?: string;
}

interface CheckboxFilterProps {
  label: string;
  options: CheckboxOption[];
  selectedValues: Record<string, boolean>;
  onSelectionChange: (key: string, value: boolean) => void;
  icon?: React.ReactNode;
}

export const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  label,
  options,
  selectedValues,
  onSelectionChange,
  icon
}) => {
  return (
    <div className="checkbox-filter">
      <label className="filter-label">
        {icon}
        {label}
      </label>
      
      <div className="checkbox-options">
        {options.map(option => (
          <label key={option.key} className="checkbox-option">
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={selectedValues[option.key] || false}
                onChange={(e) => onSelectionChange(option.key, e.target.checked)}
                className="checkbox-input"
              />
              <div className="checkbox-custom">
                {selectedValues[option.key] && (
                  <Check size={12} className="check-icon" />
                )}
              </div>
            </div>
            
            <div className="checkbox-content">
              <span className="checkbox-label">{option.label}</span>
              {option.description && (
                <span className="checkbox-description">{option.description}</span>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};