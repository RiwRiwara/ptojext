// SortingAlgorithms.ts
import Observable from "@/classes/Observable";

class SortingAlgorithms extends Observable {
    private arr: number[];

    constructor(arr: number[]) {
        super();
        this.arr = arr;
    }

    // Utility to clone array
    private cloneArray(): number[] {
        return [...this.arr];
    }

    // Method for Bubble Sort
    public bubbleSort(): number[] {
        const arr = this.cloneArray();
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap
                }
            }
        }
        this.arr = arr;
        this.notifyObservers(); // Notify with the sorted array
        return arr;
    }

    // Method for Selection Sort
    public selectionSort(): number[] {
        const arr = this.cloneArray();
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]; // Swap
        }
        this.arr = arr;
        this.notifyObservers();
        return arr;
    }

    // Method for Insertion Sort
    public insertionSort(): number[] {
        const arr = this.cloneArray();
        const n = arr.length;
        for (let i = 1; i < n; i++) {
            const key = arr[i];
            let j = i - 1;

            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
        this.arr = arr;
        this.notifyObservers();
        return arr;
    }

    // Method for Merge Sort
    public mergeSort(): number[] {
        const arr = this.cloneArray();
        if (arr.length <= 1) return arr;

        const mid = Math.floor(arr.length / 2);
        const left = this.mergeSortHelper(arr.slice(0, mid));
        const right = this.mergeSortHelper(arr.slice(mid));

        return this.merge(left, right);
    }

    private mergeSortHelper(arr: number[]): number[] {
        if (arr.length <= 1) return arr;
        const mid = Math.floor(arr.length / 2);
        const left = this.mergeSortHelper(arr.slice(0, mid));
        const right = this.mergeSortHelper(arr.slice(mid));
        return this.merge(left, right);
    }

    private merge(left: number[], right: number[]): number[] {
        const result: number[] = [];
        let i = 0, j = 0;

        while (i < left.length && j < right.length) {
            if (left[i] < right[j]) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j]);
                j++;
            }
        }

        return result.concat(left.slice(i), right.slice(j));
    }

    // Method for Quick Sort
    public quickSort(): number[] {
        const arr = this.cloneArray();
        return this.quickSortHelper(arr);
    }

    private quickSortHelper(arr: number[]): number[] {
        if (arr.length <= 1) return arr;

        const pivot = arr[arr.length - 1];
        const left = [];
        const right = [];

        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] < pivot) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }

        return [...this.quickSortHelper(left), pivot, ...this.quickSortHelper(right)];
    }

    // Generic sorting function
    public sort(algorithm: string): number[] {
        switch (algorithm) {
            case "bubble":
                return this.bubbleSort();
            case "selection":
                return this.selectionSort();
            case "insertion":
                return this.insertionSort();
            case "merge":
                return this.mergeSort();
            case "quick":
                return this.quickSort();
            default:
                throw new Error("Unsupported algorithm");
        }
    }

    // Get the current array
    public getArray(): number[] {
        return this.arr;
    }
}

export default SortingAlgorithms;
