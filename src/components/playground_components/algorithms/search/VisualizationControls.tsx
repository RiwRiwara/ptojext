"use client";
import React from 'react';
import { VisualizationControlsProps } from './types';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRedo } from 'react-icons/fa';

const VisualizationControls: React.FC<VisualizationControlsProps> = ({
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  isPlaying,
  speed,
  onSpeedChange,
  currentStep,
  totalSteps
}) => {
  return (
    <div className="">
      <hr className="my-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-3">Visualization Controls</h3>
      
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStepBackward}
            disabled={currentStep === 0 || isPlaying}
            className={`p-2 rounded-full ${
              currentStep === 0 || isPlaying
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-label="Step backward"
          >
            <FaStepBackward />
          </motion.button>
          
          {isPlaying ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPause}
              className="p-2 rounded-full bg-[#83AFC9] text-white hover:bg-[#6c9ab4]"
              aria-label="Pause"
            >
              <FaPause />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPlay}
              disabled={currentStep >= totalSteps - 1}
              className={`p-2 rounded-full ${
                currentStep >= totalSteps - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#83AFC9] text-white hover:bg-[#6c9ab4]'
              }`}
              aria-label="Play"
            >
              <FaPlay />
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStepForward}
            disabled={currentStep >= totalSteps - 1 || isPlaying}
            className={`p-2 rounded-full ${
              currentStep >= totalSteps - 1 || isPlaying
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-label="Step forward"
          >
            <FaStepForward />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
            aria-label="Reset"
          >
            <FaRedo />
          </motion.button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Speed:</span>
          <input
            type="range"
            min="1"
            max="10"
            value={speed}
            onChange={(e) => onSpeedChange(parseInt(e.target.value))}
            className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#83AFC9]"
          />
          <span className="text-sm font-medium text-gray-700">{speed}x</span>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-[#83AFC9] h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Step {currentStep + 1}</span>
        <span>Total Steps: {totalSteps}</span>
      </div>
    </div>
  );
};

export default VisualizationControls;
