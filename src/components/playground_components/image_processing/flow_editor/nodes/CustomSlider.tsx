import React, { useState, useEffect } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

interface CustomSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  label: string;
  onChange: (value: number) => void;
  showInput?: boolean; // Optional flag to show input, defaults to true
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  value: initialValue,
  min,
  max,
  step,
  label,
  onChange,
  showInput = true
}) => {
  const [internalValue, setInternalValue] = useState<number>(initialValue);
  const [displayValue, setDisplayValue] = useState<string>(initialValue.toString());
  const [inputValue, setInputValue] = useState<string>(initialValue.toString());

  useEffect(() => {
    setInternalValue(initialValue);
    setInputValue(initialValue.toString());
  }, [initialValue]);

  // Ensure value is always within bounds
  const boundedValue = Math.max(min, Math.min(max, internalValue));

  // Calculate the percentage for the progress bar
  const percentage = ((boundedValue - min) / (max - min)) * 100;

  // Format display value
  const formattedDisplayValue = boundedValue.toFixed(step < 1 ? 1 : 0);

  // Handle decrement button
  const handleDecrement = () => {
    const newValue = Math.max(min, internalValue - step);
    setInternalValue(newValue);
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, internalValue + step);
    setInternalValue(newValue);
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    // Parse the input value and ensure it's within range
    let newValue = parseFloat(inputValue);

    // Check if it's a valid number
    if (isNaN(newValue)) {
      newValue = internalValue;
      setInputValue(internalValue.toString());
      return;
    }

    // Ensure the value is within min/max range
    newValue = Math.max(min, Math.min(max, newValue));

    // Update all state values
    setInternalValue(newValue);
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur(); // Trigger onBlur to apply the value
    }
  };

  // Stop propagation to prevent node dragging
  const preventPropagation = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="custom-slider" onMouseDown={preventPropagation} onClick={preventPropagation} onTouchStart={preventPropagation}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-600">{label}</span>
          <span className="text-xs font-mono bg-gray-100 px-1 py-0.5 rounded">{formattedDisplayValue}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Decrement button */}
        <button
          className="w-7 h-7 rounded bg-gray-200 text-gray-700 flex items-center justify-center active:bg-gray-300"
          onClick={handleDecrement}
          disabled={internalValue <= min}
          onMouseDown={preventPropagation}
          onTouchStart={preventPropagation}
        >
          -
        </button>

        {/* Progress bar */}
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${((internalValue - min) / (max - min)) * 100}%` }}
          />
        </div>

        {/* Increment button */}
        <button
          className="w-7 h-7 rounded bg-gray-200 text-gray-700 flex items-center justify-center active:bg-gray-300"
          onClick={handleIncrement}
          disabled={internalValue >= max}
          onMouseDown={preventPropagation}
          onTouchStart={preventPropagation}
        >
          +
        </button>

        {/* Manual input field */}
        {showInput && (
          <input
            type="text"
            className="w-12 h-7 text-center text-xs rounded border border-gray-300"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            onMouseDown={preventPropagation}
            onTouchStart={preventPropagation}
          />
        )}
      </div>
    </div>
  );
};
