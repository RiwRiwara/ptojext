import { 
  RLAlgorithmInterface, 
  State, 
  Action, 
  QValues,
  AlgorithmParams
} from '../types/reinforcement-learning-types';

interface SarsaConfig {
  actions: Action[];
  learningRate: number;
  explorationRate: number;
  discountFactor: number;
}

export class SarsaAlgorithm implements RLAlgorithmInterface {
  private actions: Action[];
  private qValues: QValues;
  private learningRate: number;
  private explorationRate: number;
  private discountFactor: number;
  private lastState: State | null = null;
  private lastAction: Action | null = null;

  constructor(config: SarsaConfig) {
    this.actions = config.actions;
    this.learningRate = config.learningRate;
    this.explorationRate = config.explorationRate;
    this.discountFactor = config.discountFactor;
    this.qValues = {};
  }

  reset(): void {
    this.qValues = {};
    this.lastState = null;
    this.lastAction = null;
  }

  private getQValue(stateKey: string, actionId: number): number {
    if (!this.qValues[stateKey]) {
      this.qValues[stateKey] = {};
    }

    if (this.qValues[stateKey][actionId] === undefined) {
      this.qValues[stateKey][actionId] = 0.0;
    }

    return this.qValues[stateKey][actionId];
  }

  private setQValue(stateKey: string, actionId: number, value: number): void {
    if (!this.qValues[stateKey]) {
      this.qValues[stateKey] = {};
    }

    this.qValues[stateKey][actionId] = value;
  }

  private getBestAction(stateKey: string): { action: Action, qValue: number } {
    let bestAction = this.actions[0];
    let bestValue = -Infinity;

    // Find action with highest Q-value
    for (const action of this.actions) {
      const qValue = this.getQValue(stateKey, action.id);
      if (qValue > bestValue) {
        bestValue = qValue;
        bestAction = action;
      }
    }

    return { action: bestAction, qValue: bestValue };
  }

  private getEpsilonGreedyAction(stateKey: string): Action {
    // Exploration: random action with probability explorationRate
    if (Math.random() < this.explorationRate) {
      const randomIndex = Math.floor(Math.random() * this.actions.length);
      return this.actions[randomIndex];
    }

    // Exploitation: best action based on Q-values
    return this.getBestAction(stateKey).action;
  }

  selectAction(state: State): Action {
    const stateKey = this.getStateKey(state);
    const action = this.getEpsilonGreedyAction(stateKey);
    
    // Store this state-action pair for the next update
    this.lastState = state;
    this.lastAction = action;
    
    return action;
  }

  update(state: State, action: Action, reward: number, nextState: State, done: boolean): void {
    const stateKey = this.getStateKey(state);
    const nextStateKey = this.getStateKey(nextState);
    
    // Current Q-value
    const currentQ = this.getQValue(stateKey, action.id);
    
    // Choose next action using epsilon-greedy policy
    const nextAction = done ? null : this.getEpsilonGreedyAction(nextStateKey);
    
    // SARSA update formula: Q(s,a) = Q(s,a) + α * [r + γ * Q(s',a') - Q(s,a)]
    const nextQ = done ? 0 : this.getQValue(nextStateKey, nextAction?.id || 0);
    const newQ = currentQ + this.learningRate * (reward + this.discountFactor * nextQ - currentQ);
    
    // Update Q-value
    this.setQValue(stateKey, action.id, newQ);
  }

  setParams(params: AlgorithmParams): void {
    this.learningRate = params.learningRate;
    this.explorationRate = params.explorationRate;
    this.discountFactor = params.discountFactor;
  }

  getQValues(): QValues {
    return this.qValues;
  }

  private getStateKey(state: State): string {
    return Object.values(state).join(',');
  }
}
