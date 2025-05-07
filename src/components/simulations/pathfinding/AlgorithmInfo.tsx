import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoInformation } from 'react-icons/io5';
import { HiClock, HiPuzzle, HiLightningBolt, HiAdjustments } from 'react-icons/hi';
import { AlgorithmKey, AlgorithmInfo as AlgorithmInfoType } from './types';

interface AlgorithmInfoProps {
  algorithm: AlgorithmKey;
  algorithms: AlgorithmInfoType[];
  showAlgorithmInfo: boolean;
  setShowAlgorithmInfo: (show: boolean) => void;
}

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({
  algorithm,
  algorithms,
  showAlgorithmInfo,
  setShowAlgorithmInfo,
}) => {
  const currentAlgorithm = algorithms.find(a => a.key === algorithm);

  return (
    <div className="mb-5 w-full mx-auto bgg">
      <div
        className="relative p-4 rounded-xl bg-gradient-to-r from-sky-50 to-primary-50 border border-sky-100 text-slate-700 text-sm shadow-sm overflow-hidden"
      >
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowAlgorithmInfo(!showAlgorithmInfo)}
        >
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${currentAlgorithm?.color}-100 text-${currentAlgorithm?.color}-800`}>
              {currentAlgorithm?.shortLabel}
            </span>
            <span className="font-medium">{currentAlgorithm?.label}</span>
          </div>
          <button className="text-slate-500 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors">
            <IoInformation className={`transition-transform ${showAlgorithmInfo ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <AnimatePresence>
          {showAlgorithmInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <p className="mb-3 text-slate-600">{currentAlgorithm?.desc}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mt-1 bg-white/50 p-3 rounded-lg">
                <div className="flex items-center gap-1"><HiClock className="text-slate-500" /> <span className="font-semibold">Complexity:</span> {currentAlgorithm?.complexity}</div>
                <div className="flex items-center gap-1"><HiPuzzle className="text-slate-500" /> <span className="font-semibold">Optimal Path:</span> {currentAlgorithm?.optimalPath}</div>
                <div className="flex items-center gap-1"><HiLightningBolt className="text-slate-500" /> <span className="font-semibold">Speed:</span> {currentAlgorithm?.speed}</div>
                <div className="flex items-center gap-1"><HiAdjustments className="text-slate-500" /> <span className="font-semibold">Weights:</span> {currentAlgorithm?.worksWithWeights ? 'Supported' : 'Not supported'}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlgorithmInfo;
