import { StoreApi, UseBoundStore } from 'zustand';

// Helper type for common primitive types in store state
type StoreStateValue = string | number | boolean | object | null | undefined;

// Helper type to create selectors for a store
type WithSelectors<S> = {
  getState: () => S;
  use: { [K in keyof S]: () => S[K] };
};

// Create selectors for a store to allow component-level state consumption
export function createSelectors<S extends UseBoundStore<StoreApi<object>>>(
  store: S,
  _stateSelector?: unknown, // Optional param to match Zustand type expectations
  _equalityFn?: unknown // Optional param to match Zustand type expectations
) {
  // Get the state type from the store
  type State = ReturnType<(typeof store)['getState']>;
  
  // Cast the store to include our use property
  const useStore = store as unknown as S & { use: { [K in keyof State]: () => State[K] } };
  
  // Initialize the use object if it doesn't exist
  if (!useStore.use) {
    useStore.use = {} as { [K in keyof State]: () => State[K] };
  }
  
  // Create a selector for each property in the store
  const state = store.getState();
  for (const key in state) {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      useStore.use[key as keyof State] = () => store((s) => s[key as keyof typeof s]);
    }
  }
  
  return useStore;
}
