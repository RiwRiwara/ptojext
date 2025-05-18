import { 
  RLAlgorithmInterface, 
  State, 
  Action, 
  QValues,
  AlgorithmParams
} from '../types/reinforcement-learning-types';

interface QLearningConfig {
  actions: Action[];
  learningRate: number;
  explorationRate: number;
  discountFactor: number;
}

export class QLearningAlgorithm implements RLAlgorithmInterface {
  private actions: Action[];
  private qValues: QValues;
  private learningRate: number;
  private explorationRate: number;
  private discountFactor: number;

  constructor(config: QLearningConfig) {
    this.actions = config.actions;
    this.learningRate = config.learningRate;
    this.explorationRate = config.explorationRate;
    this.discountFactor = config.discountFactor;
    this.qValues = {};
  }

  reset(): void {
    this.qValues = {};
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

  selectAction(state: State): Action {
    const stateKey = this.getStateKey(state);

    // Exploration: random action with probability explorationRate
    if (Math.random() < this.explorationRate) {
      const randomIndex = Math.floor(Math.random() * this.actions.length);
      return this.actions[randomIndex];
    }

    // Exploitation: best action based on Q-values
    return this.getBestAction(stateKey).action;
  }

  update(state: State, action: Action, reward: number, nextState: State, done: boolean): void {
    const stateKey = this.getStateKey(state);
    const nextStateKey = this.getStateKey(nextState);
    
    // Current Q-value
    const currentQ = this.getQValue(stateKey, action.id);
    
    // Best next action's Q-value (max Q-value for next state)
    const nextQ = done ? 0 : this.getBestAction(nextStateKey).qValue;
    
    // Q-Learning update formula: Q(s,a) = Q(s,a) + α * [r + γ * max(Q(s',a')) - Q(s,a)]
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
