import { useRef, useEffect, useState } from "react";

interface BlockProps {
    width?: number;
    height?: number;
    scale?: number;
}

function Block({ width = 50, height = 100, scale = 1 }: BlockProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [value, setValue] = useState(scale);

    // Sync value with scale prop
    useEffect(() => {
        setValue(scale);
    }, [scale]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw block with updated scale (value)
        ctx.fillStyle = "lightgray";
        ctx.fillRect(
            (canvas.width - width) / 2,
            canvas.height - height * (value * 0.1),
            width,
            height * (value * 0.1)
        );
    }, [value, width, height]); // Re-render when `value` changes

    const handlePlus = () => {
        setValue((prevValue) => Math.min(prevValue + 1, 30));
    };

    const handleMinus = () => {
        setValue((prevValue) => Math.max(prevValue - 1, 0));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "") {
            setValue(0);
            return;
        }
        const newValue = parseInt(e.target.value, 10);
        setValue(Math.max(0, Math.min(newValue, 30)));
    };

    return (
        <div className="flex flex-col duration-500 ease-soft-spring">
            <canvas ref={canvasRef} width={width} height={300} />
            <button onClick={handlePlus} className="bg-gray-700 text-white font-bold focus:scale-105 duration-300 ease-soft-spring text-xs">
                +
            </button>
            <input
                className="border-2 border-gray-700 w-[50px] text-center text-xs"
                type="number"
                value={value}
                onChange={handleInputChange}
            />
            <button onClick={handleMinus} className="bg-gray-700 text-white font-bold focus:scale-105 duration-300 ease-soft-spring rounded-b-md text-xs">
                -
            </button>
        </div>
    );
}

export default Block
