export interface SearchAlgorithm {
  key: string;
  label: string;
  description: string;
  complexity: {
    time: {
      best: string;
      average: string;
      worst: string;
    };
    space: string;
  };
  colorScheme: {
    background: string;
    defaultElement: string;
    activeElement: string;
    comparingElement: string;
    foundElement: string;
    lowBound?: string;
    highBound?: string;
  };
  requiresSorted: boolean;
}

export interface AnimationStep {
  type: string;
  indices?: number[];
  message: string;
  leftBound?: number;
  rightBound?: number;
  lowBound?: number;
  highBound?: number;
  step?: number;
}

export interface SearchVisualizerProps {
  array: number[];
  target: number;
  steps: AnimationStep[];
  currentStep: number;
  colorScheme: SearchAlgorithm['colorScheme'];
  speed: number;
  isPlaying: boolean;
  isSorted: boolean;
  onSearch?: (value: number) => void;
}

export interface AlgorithmSelectorProps {
  algorithms: SearchAlgorithm[];
  selectedAlgo: string;
  onSelectAlgorithm: (key: string) => void;
}

export interface ArrayControlsProps {
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  onGenerateArray: () => void;
  target: number;
  onTargetChange: (target: number) => void;
  isSorted: boolean;
  onToggleSorted: () => void;
  selectedAlgo: string;
  requiresSorted: boolean;
}

export interface VisualizationControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  isPlaying: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
  currentStep: number;
  totalSteps: number;
}

export interface CodeDisplayProps {
  selectedAlgo: string;
  currentHighlightedLine: string | null;
}
