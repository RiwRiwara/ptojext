import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import Block from './partials/Block';

export default function SortingMainComponent() {
    const [blocks, setBlocks] = useState<number[]>(generateRandomBlocks(5)); // Initial blocks
    const [rerender, setRerender] = useState(false);
    
    // Generate an array of blocks with random scales between 0 and 30
    function generateRandomBlocks(numBlocks: number): number[] {
        return Array.from({ length: numBlocks }, () => Math.floor(Math.random() * 31)); // Scale between 0 and 30
    }

    useEffect(() => {
        setRerender(prev => !prev);
    }, [blocks]);

    // Add a new random block
    const addBlock = () => {
        setBlocks([...blocks, Math.floor(Math.random() * 31)]);
    };

    // Delete a block
    const deleteBlock = () => {
        if (blocks.length > 0) {
            setBlocks(blocks.slice(0, -1));
        }
    };

    // Shuffle the positions of blocks
    const shuffleBlocks = () => {
        setBlocks([...blocks].sort(() => Math.random() - 0.5));
    };

    // Generate new random values for all blocks
    const randomizeBlocks = () => {
        setBlocks(generateRandomBlocks(blocks.length));
    };

    return (
        <div className='p-4 rounded-md w-full flex flex-col gap-4'>
            <div className="flex flex-row gap-6 justify-center items-end">
                {blocks.map((scale, index) => (
                    <Block key={index} scale={scale} />
                ))}
            </div>

            <div className="flex justify-center gap-2">
                <button 
                    onClick={addBlock} 
                    className="px-4 py-2 bg-slate-500 text-white rounded"
                >
                    +
                </button>
                <button 
                    onClick={deleteBlock} 
                    className="px-4 py-2 bg-slate-300 text-white rounded"
                >
                    -
                </button>
                <button 
                    onClick={shuffleBlocks} 
                    className="px-4 py-2 bg-sky-300 text-white rounded"
                >
                    Shuffle
                </button>
                <button 
                    onClick={randomizeBlocks} 
                    className="px-4 py-2 bg-emerald-400 text-white rounded"
                >
                    Randomize
                </button>
            </div>
        </div>
    );
}
