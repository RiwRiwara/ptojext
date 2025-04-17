import { Button } from "@heroui/react";
import {
    FaRandom,
} from "react-icons/fa";
import { MdOutlineShuffle } from "react-icons/md";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import { CiSquarePlus } from "react-icons/ci";
import { CiSquareMinus } from "react-icons/ci";

interface ArrayControlsProps {
    currentArray: number[];
    isPlaying: boolean;
    onGenerateRandom: (size: number) => void;
    onShuffle: () => void;
    onSortAscending: () => void;
    onSortDescending: () => void;
    onAddElement: () => void;
    onRemoveElement: () => void;
}

export default function ArrayControls({
    currentArray,
    isPlaying,
    onGenerateRandom,
    onShuffle,
    onSortAscending,
    onSortDescending,
    onAddElement,
    onRemoveElement,
}: ArrayControlsProps) {
    return (
        <section className="mb-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Array Controls
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                <Button
                    onClick={() => onGenerateRandom(10)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all disabled:opacity-50"
                    disabled={isPlaying}
                >
                    <FaRandom />
                    Random
                </Button>
                <Button
                    onClick={onShuffle}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all disabled:opacity-50"
                    disabled={isPlaying}
                >
                    <MdOutlineShuffle />
                    Shuffle
                </Button>
                <Button
                    onClick={onSortAscending}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all disabled:opacity-50"
                    disabled={isPlaying}
                >
                    <GoSortAsc />
                    Ascending
                </Button>
                <Button
                    onClick={onSortDescending}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-all disabled:opacity-50"
                    disabled={isPlaying}
                >
                    <GoSortDesc />
                    Descending
                </Button>
                <Button
                    onClick={onAddElement}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-all disabled:opacity-50"
                    disabled={isPlaying || currentArray.length >= 20}
                >
                    <CiSquarePlus />
                    Add
                </Button>
                <Button
                    onClick={onRemoveElement}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all disabled:opacity-50"
                    disabled={isPlaying || currentArray.length <= 3}
                >
                    <CiSquareMinus />
                    Remove
                </Button>
            </div>
            <div className="mt-4 p-3 bg-gray-100 rounded-md">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Current Array</h3>
                <p className="font-mono text-sm text-gray-800 break-all">
                    [{currentArray.join(", ")}]
                </p>
            </div>
        </section>
    );
}