// Observable.ts
class Observable {
    private observers: (() => void)[] = [];

    // Add an observer
    public addObserver(observer: () => void): void {
        this.observers.push(observer);
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
