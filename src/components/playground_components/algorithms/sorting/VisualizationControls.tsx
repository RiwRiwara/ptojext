import { Button } from "@heroui/react";
import {
    FaPlay,
    FaPause,
    FaRedo,
    FaStepForward,
    FaStepBackward,
    FaCode,
} from "react-icons/fa";
import { MdSpeed } from "react-icons/md";

interface VisualizationControlsProps {
    isPlaying: boolean;
    setIsPlaying: (isPlaying: boolean) => void;
    currentStep: number;
    totalSteps: number;
    speed: number;
    setSpeed: (speed: number) => void;
    showCode: boolean;
    setShowCode: (showCode: boolean) => void;
    onReset: () => void;
    onPrevStep: () => void;
    onNextStep: () => void;
}

export default function VisualizationControls({
    isPlaying,
    setIsPlaying,
    currentStep,
    totalSteps,
    speed,
    setSpeed,
    showCode,
    setShowCode,
    onReset,
    onPrevStep,
    onNextStep,
}: VisualizationControlsProps) {
    return (
        <section>
            <div className="flex flex-row items-center gap-4 lg:gap-8 mb-2 md:mb-0">
                <div className="flex flex-row gap-2">
                    <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md shadow-md transition-all ${isPlaying
                        ? "bg-amber-600 text-white hover:bg-amber-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                    {/* {isPlaying ? "Pause" : "Play"} */}
                    </Button>

                    <Button
                    onClick={onReset}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-all disabled:opacity-50"
                    disabled={isPlaying}
                >
                    <FaRedo />
                    {/* Reset */}
                    </Button>

                    {/* <div className="flex items-center gap-2">
                        <Button
                            onClick={onPrevStep}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all disabled:opacity-50"
                            disabled={isPlaying || currentStep <= 0}
                        >
                            <FaStepBackward />
                            Prev
                        </Button>

                        <span className="text-sm font-medium mx-2">
                            Step {currentStep + 1} of {Math.max(totalSteps, 1)}
                        </span>
                        
                        <Button
                            onClick={onNextStep}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all disabled:opacity-50"
                            disabled={isPlaying || currentStep >= totalSteps - 1}
                        >
                            Next
                            <FaStepForward />
                        </Button>
                    </div> */}
                </div>
                
                <div className="flex items-center gap-2 min-w-[100px] justify-end">
                    <MdSpeed className="text-gray-600 hidden md:flex" />
                    <input
                        type="range"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-full h-2 bg-gray-300 rounded-lg cursor-pointer accent-indigo-600"
                    />
                    <span className="text-sm text-gray-600 w-10 text-right">
                        {speed.toFixed(1)}x
                    </span>
                </div>
            </div>
        </section>
    );
}