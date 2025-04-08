// Observable.ts
class Observable {
    private observers: (() => void)[] = [];

    // Add an observer and return an unsubscribe function
    public addObserver(observer: () => void): () => void {
        this.observers.push(observer);
        // Return a function that removes this observer when called
        return () => {
            this.removeObserver(observer);
        };
    }

    // Remove an observer
    public removeObserver(observer: () => void): void {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }

    // Notify all observers without passing data
    public notifyObservers(): void {
        this.observers.forEach((observer) => observer());
    }
}

export default Observable;