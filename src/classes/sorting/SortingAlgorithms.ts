// src/classes/sorting/SortingAlgorithms.ts
import Observable from "@/classes/Observable";

type AnimationStep = { from: number; to: number };

class SortingAlgorithms extends Observable {
    public arr: number[];

    constructor(arr: number[]) {
        super();
        this.arr = arr;
    }

    private swap(arr: number[], i: number, j: number, steps: AnimationStep[]): void {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({ from: i, to: j });
    }

    private cloneArray(): number[] {
        return [...this.arr];
    }

    // Bubble Sort with steps
    public bubbleSort(returnSteps: boolean = false): number[] | AnimationStep[] {
        const arr = this.cloneArray();
        const steps: AnimationStep[] = [];
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    this.swap(arr, j, j + 1, steps);
                }
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
            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                this.swap(arr, i, minIndex, steps);
            }
        }
        this.arr = arr;
        this.notifyObservers();
        return returnSteps ? steps : arr;
    }

    // Insertion Sort with steps
    public insertionSort(returnSteps: boolean = false): number[] | AnimationStep[] {
        const arr = this.cloneArray();
        const steps: AnimationStep[] = [];
        const n = arr.length;
        for (let i = 1; i < n; i++) {
            const key = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                steps.push({ from: j, to: j + 1 });
                j--;
            }
            arr[j + 1] = key;
        }
        this.arr = arr;
        this.notifyObservers();
        return returnSteps ? steps : arr;
    }

    // Merge Sort with steps
    public mergeSort(returnSteps: boolean = false): number[] | AnimationStep[] {
        const arr = this.cloneArray();
        const steps: AnimationStep[] = [];
        this.mergeSortHelper(arr, 0, arr.length, steps);
        this.arr = arr;
        this.notifyObservers();
        return returnSteps ? steps : arr;
    }

    private mergeSortHelper(arr: number[], start: number, end: number, steps: AnimationStep[]): void {
        if (end - start <= 1) return;
        const mid = Math.floor((start + end) / 2);
        this.mergeSortHelper(arr, start, mid, steps);
        this.mergeSortHelper(arr, mid, end, steps);
        this.merge(arr, start, mid, end, steps);
    }

    private merge(arr: number[], start: number, mid: number, end: number, steps: AnimationStep[]): void {
        const left = arr.slice(start, mid);
        const right = arr.slice(mid, end);
        let i = 0, j = 0, k = start;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                arr[k++] = left[i++];
            } else {
                arr[k++] = right[j++];
                steps.push({ from: k - 1, to: mid + j - 1 });
            }
        }
        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
    }

    // Quick Sort with steps
    public quickSort(returnSteps: boolean = false): number[] | AnimationStep[] {
        const arr = this.cloneArray();
        const steps: AnimationStep[] = [];
        this.quickSortHelper(arr, 0, arr.length - 1, steps);
        this.arr = arr;
        this.notifyObservers();
        return returnSteps ? steps : arr;
    }

    private quickSortHelper(arr: number[], low: number, high: number, steps: AnimationStep[]): void {
        if (low < high) {
            const pi = this.partition(arr, low, high, steps);
            this.quickSortHelper(arr, low, pi - 1, steps);
            this.quickSortHelper(arr, pi + 1, high, steps);
        }
    }

    private partition(arr: number[], low: number, high: number, steps: AnimationStep[]): number {
        const pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                this.swap(arr, i, j, steps);
            }
        }
        this.swap(arr, i + 1, high, steps);
        return i + 1;
    }

    // Generic sort method
    public sort(algorithm: string, returnSteps: boolean = false): number[] | AnimationStep[] {
        switch (algorithm) {
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
                throw new Error("Unsupported algorithm");
        }
    }

    public getArray(): number[] {
        return this.arr;
    }
}

export default SortingAlgorithms;