// src/classes/sorting/SortingAlgorithms.ts
import Observable from "@/classes/Observable";

// Improved animation step interface with additional properties for better visualization
export type AnimationStep = {
    from: number;  // Index from
    to: number;    // Index to
    type?: 'swap' | 'compare' | 'done' | 'select' | 'set'; // Type of operation for enhanced visualization
    value?: number; // Used for setValue operations
};

class SortingAlgorithms extends Observable {
    public arr: number[];

    constructor(arr: number[]) {
        super();
        this.arr = arr;
    }

    public getAnimationSteps(algorithm: string): AnimationStep[] {
        switch (algorithm) {
            case 'bubble-sort':
                return this.bubbleSort(true) as AnimationStep[];
            case 'selection-sort':
                return this.selectionSort(true) as AnimationStep[];
            case 'insertion-sort':
                return this.insertionSort(true) as AnimationStep[];
            case 'merge-sort':
                return this.mergeSort(true) as AnimationStep[];
            case 'quick-sort':
                return this.quickSort(true) as AnimationStep[];
            default:
                return [];
        }
    }


    public swap(arr: number[], i: number, j: number, steps: AnimationStep[]): void {
        // First mark as comparing both elements
        steps.push({ from: i, to: j, type: 'compare' });

        // Then perform the swap
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({ from: i, to: j, type: 'swap' });
    }

    public compare(i: number, j: number, steps: AnimationStep[]): void {
        steps.push({ from: i, to: j, type: 'compare' });
    }

    public setDone(index: number, steps: AnimationStep[]): void {
        steps.push({ from: index, to: index, type: 'done' });
    }

    public setValue(arr: number[], index: number, value: number, steps: AnimationStep[]): void {
        arr[index] = value;
        steps.push({ from: index, to: index, type: 'set', value: value });
    }

    public cloneArray(): number[] {
        return [...this.arr];
    }

    // Bubble Sort with steps
    public bubbleSort(returnSteps: boolean = false): number[] | AnimationStep[] {
        const arr = this.cloneArray();
        const steps: AnimationStep[] = [];
        const n = arr.length;

        for (let i = 0; i < n - 1; i++) {
            let swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                // Compare elements first
                this.compare(j, j + 1, steps);

                if (arr[j] > arr[j + 1]) {
                    this.swap(arr, j, j + 1, steps);
                    swapped = true;
                }
            }

            // Mark the last item in this pass as sorted
            this.setDone(n - i - 1, steps);

            // If no swapping occurred in this pass, all elements are sorted
            if (!swapped) {
                // Mark all remaining items as sorted
                for (let k = 0; k < n - i - 1; k++) {
                    this.setDone(k, steps);
                }
                break;
            }
        }

        this.arr = arr;
        this.notifyObservers();
        return returnSteps ? steps : arr;
    }

    // Selection Sort with steps
    public selectionSort(returnSteps: boolean = false): number[] | AnimationStep[] {
        const arr = this.cloneArray();
        const steps: AnimationStep[] = [];
        const n = arr.length;

        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;

            // Visual indication of the current position we're working on
            steps.push({ from: i, to: i, type: 'select' });

            for (let j = i + 1; j < n; j++) {
                // Show comparison with current minimum
                this.compare(minIndex, j, steps);

                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }

            if (minIndex !== i) {
                this.swap(arr, i, minIndex, steps);
            }

            // Mark the position as sorted
            this.setDone(i, steps);
        }

        // Mark the last element as sorted (it's automatically in the right place)
        this.setDone(n - 1, steps);

        this.arr = arr;
        this.notifyObservers();
        return returnSteps ? steps : arr;
    }

    // Insertion Sort with steps
    public insertionSort(returnSteps: boolean = false): number[] | AnimationStep[] {
        const arr = this.cloneArray();
        const steps: AnimationStep[] = [];
        const n = arr.length;

        // First element is already sorted
        this.setDone(0, steps);

        for (let i = 1; i < n; i++) {
            // Visual indication of the current element we're inserting
            steps.push({ from: i, to: i, type: 'select' });

            const key = arr[i];
            let j = i - 1;

            // Compare with previous elements
            while (j >= 0) {
                this.compare(j, i, steps);

                if (arr[j] <= key) break;

                // Move elements that are greater than key one position ahead
                this.setValue(arr, j + 1, arr[j], steps);
                j--;
            }

            // Place the key in its correct position
            if (j + 1 !== i) {
                this.setValue(arr, j + 1, key, steps);
            }

            // Mark sorted elements
            for (let k = 0; k <= i; k++) {
                this.setDone(k, steps);
            }
        }

        this.arr = arr;
        this.notifyObservers();
        return returnSteps ? steps : arr;
    }

    // Merge Sort with steps
    public mergeSort(returnSteps: boolean = false): number[] | AnimationStep[] {
        const arr = this.cloneArray();
        const steps: AnimationStep[] = [];

        // Create a copy for the auxiliary array visualization
        const aux = [...arr];

        this.mergeSortHelper(arr, aux, 0, arr.length - 1, steps);

        // Mark all as sorted at the end
        for (let i = 0; i < arr.length; i++) {
            this.setDone(i, steps);
        }

        this.arr = arr;
        this.notifyObservers();
        return returnSteps ? steps : arr;
    }

    public mergeSortHelper(arr: number[], aux: number[], start: number, end: number, steps: AnimationStep[]): void {
        if (start >= end) return;

        const mid = Math.floor((start + end) / 2);

        // Recursively sort both halves
        this.mergeSortHelper(arr, aux, start, mid, steps);
        this.mergeSortHelper(arr, aux, mid + 1, end, steps);

        // Merge the sorted halves
        this.mergeImproved(arr, aux, start, mid, end, steps);
    }

    public mergeImproved(arr: number[], aux: number[], start: number, mid: number, end: number, steps: AnimationStep[]): void {
        // Copy elements to auxiliary array
        for (let i = start; i <= end; i++) {
            aux[i] = arr[i];
        }

        let i = start;      // Left half start index
        let j = mid + 1;    // Right half start index
        let k = start;      // Current position in the merged array

        // Merge process with visualization steps
        while (i <= mid && j <= end) {
            // Compare elements from both halves
            this.compare(i, j, steps);

            if (aux[i] <= aux[j]) {
                // Place element from left half
                this.setValue(arr, k, aux[i], steps);
                i++;
            } else {
                // Place element from right half
                this.setValue(arr, k, aux[j], steps);
                j++;
            }
            k++;
        }

        // Copy remaining elements from left half
        while (i <= mid) {
            this.setValue(arr, k, aux[i], steps);
            i++;
            k++;
        }

        // Copy remaining elements from right half
        while (j <= end) {
            this.setValue(arr, k, aux[j], steps);
            j++;
            k++;
        }
    }

    // Quick Sort with steps
    public quickSort(returnSteps: boolean = false): number[] | AnimationStep[] {
        const arr = this.cloneArray();
        const steps: AnimationStep[] = [];

        this.quickSortHelper(arr, 0, arr.length - 1, steps);

        // Mark all elements as sorted at the end
        for (let i = 0; i < arr.length; i++) {
            this.setDone(i, steps);
        }

        this.arr = arr;
        this.notifyObservers();
        return returnSteps ? steps : arr;
    }

    public quickSortHelper(arr: number[], low: number, high: number, steps: AnimationStep[]): void {
        if (low < high) {
            const pi = this.partition(arr, low, high, steps);
            this.quickSortHelper(arr, low, pi - 1, steps);
            this.quickSortHelper(arr, pi + 1, high, steps);
        }
    }

    public partition(arr: number[], low: number, high: number, steps: AnimationStep[]): number {
        // Select pivot (the last element)
        const pivot = arr[high];
        steps.push({ from: high, to: high, type: 'select' });

        let i = low - 1;

        // Process all elements except the pivot
        for (let j = low; j < high; j++) {
            // Compare current element with pivot
            this.compare(j, high, steps);

            if (arr[j] < pivot) {
                i++;
                if (i !== j) {
                    this.swap(arr, i, j, steps);
                }
            }
        }

        // Place pivot in its final position
        const pivotPos = i + 1;
        if (pivotPos !== high) {
            this.swap(arr, pivotPos, high, steps);
        }

        // Mark the pivot as being in its final position
        this.setDone(pivotPos, steps);

        return pivotPos;
    }

    // Generic sort method
    public sort(algorithm: string, returnSteps: boolean = false): number[] | AnimationStep[] {
        switch (algorithm.replace("-sort", "")) {
            case "bubble":
                return this.bubbleSort(returnSteps);
            case "selection":
                return this.selectionSort(returnSteps);
            case "insertion":
                return this.insertionSort(returnSteps);
            case "merge":
                return this.mergeSort(returnSteps);
            case "quick":
                return this.quickSort(returnSteps);
            default:
                throw new Error(`Unsupported algorithm: ${algorithm}`);
        }
    }

    public getArray(): number[] {
        return this.arr;
    }
}

export default SortingAlgorithms;