export interface AnimationStep {
    from: number;
    to: number;
    type?: "swap" | "compare" | "done" | "select" | "set";
    value?: number;
}

export interface SortingAlgorithm {
    key: string;
    label: string;
    description: string;
    complexity: {
        time: { best: string; average: string; worst: string };
        space: string;
    };
    colorScheme?: {
        background: string;
        defaultBar: string;
        activeBar: string;
        comparingBar: string;
        sortedBar: string;
        selectBar?: string;
        setValue?: string;
    };
}