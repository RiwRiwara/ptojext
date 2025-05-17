import { Button } from "@heroui/react";
import {
    FaRandom,
} from "react-icons/fa";
import { MdOutlineShuffle } from "react-icons/md";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import { CiSquarePlus } from "react-icons/ci";
import { CiSquareMinus } from "react-icons/ci";

interface ArrayControlsProps {
    arraySize: number;
    isPlaying?: boolean;
    onArraySizeChange: (size: number) => void;
    onRandomize: () => void;
    onCustomArray?: (input: string) => void;
    customArrayInput?: string;
    setCustomArrayInput?: (input: string) => void;
    inputError?: string;
    currentArray?: number[];
    onShuffle?: () => void;
    onSortAscending?: () => void;
    onSortDescending?: () => void;
    onAddElement?: () => void;
    onRemoveElement?: () => void;
}

export default function ArrayControls({
    arraySize,
    isPlaying = false,
    onArraySizeChange,
    onRandomize,
    onCustomArray,
    customArrayInput = '',
    setCustomArrayInput,
    inputError,
    currentArray = [],
    onShuffle,
    onSortAscending,
    onSortDescending,
    onAddElement,
    onRemoveElement,
}: ArrayControlsProps) {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="grid grid-cols-2 items-center gap-2 bg-white border shadow-md rounded-md p-4">
                    <div>
                       <label className="text-sm font-medium text-gray-700">Array Size</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={arraySize}
                                onChange={(e) => onArraySizeChange(parseInt(e.target.value))}
                                disabled={isPlaying}
                                className="h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-sm font-medium text-gray-700 text-center">
                                {arraySize}
                            </span>
                        </div> 
                    </div>

                    <div className="flex justify-end">
                            <Button
                            onPress={onRandomize}
                            className="flex items-center justify-center gap-1 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all disabled:opacity-50 text-sm"
                            disabled={isPlaying}
                        >
                            <FaRandom size={14} />
                            <span className="hidden sm:inline">Randomize</span>
                        </Button>
                    </div>
                </div>

                {/* <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                    <Button
                        onPress={onRandomize}
                        className="flex items-center justify-center gap-1 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all disabled:opacity-50 text-sm"
                        disabled={isPlaying}
                    >
                        <FaRandom size={14} />
                        Randomize
                    </Button>

                    {onShuffle && (
                        <Button
                            onPress={onShuffle}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all disabled:opacity-50 text-sm"
                            disabled={isPlaying}
                        >
                            <MdOutlineShuffle size={16} />
                            Shuffle
                        </Button>
                    )}

                    {onSortAscending && (
                        <Button
                            onPress={onSortAscending}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all disabled:opacity-50 text-sm"
                            disabled={isPlaying}
                        >
                            <GoSortAsc size={16} />
                            Sort Asc
                        </Button>
                    )}

                    {onSortDescending && (
                        <Button
                            onPress={onSortDescending}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-all disabled:opacity-50 text-sm"
                            disabled={isPlaying}
                        >
                            <GoSortDesc size={16} />
                            Sort Desc
                        </Button>
                    )}

                    {onAddElement && (
                        <Button
                            onPress={onAddElement}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-all disabled:opacity-50 text-sm"
                            disabled={isPlaying || arraySize >= 50}
                        >
                            <CiSquarePlus size={16} />
                            Add
                        </Button>
                    )}

                    {onRemoveElement && (
                        <Button
                            onPress={onRemoveElement}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all disabled:opacity-50 text-sm"
                            disabled={isPlaying || arraySize <= 5}
                        >
                            <CiSquareMinus size={16} />
                            Remove
                        </Button>
                    )}
                </div> */}

                {onCustomArray && setCustomArrayInput && (
                <div className="bg-white border shadow-md rounded-md p-4">
                    <label className="flex text-sm font-medium text-gray-700 mb-1">Custom Array</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={customArrayInput}
                            onChange={(e) => setCustomArrayInput(e.target.value)}
                            placeholder="e.g., 5, 2, 8, 1, 9"
                            className="flex-1 w-[20px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#83AFC9] text-sm"
                            disabled={isPlaying}
                        />
                        <Button
                            onPress={() => onCustomArray(customArrayInput)}
                            className="px-3 py-2 bg-[#83AFC9] text-white rounded-md hover:bg-[#6da5c0] transition-all disabled:opacity-50 text-sm"
                            disabled={isPlaying || !customArrayInput.trim()}
                        >
                            Apply
                        </Button>
                    </div>
                    {inputError && <p className="mt-1 text-xs text-red-500">{inputError}</p>}
                </div>
            )}
            </div>

            

            {currentArray.length > 0 && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Current Array</h3>
                    <p className="font-mono text-sm text-gray-800 break-all overflow-x-auto">
                        [{currentArray.join(", ")}]
                    </p>
                </div>
            )}
        </div>
    );
}