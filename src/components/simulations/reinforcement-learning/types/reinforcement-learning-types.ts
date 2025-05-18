export type RLEnvironmentType = "gridworld" | "cartpole" | "mountaincar";
export type RLAlgorithm = "qlearning" | "sarsa" | "dqn";

export interface State {
  [key: string]: number;
}

export interface Action {
  id: number;
  name: string;
}

export interface QValues {
  [stateKey: string]: {
    [actionId: number]: number;
  };
}

export interface StepResult {
  state: State;
  action: Action;
  reward: number;
  nextState: State;
  done: boolean;
  episode: number;
  totalReward: number;
}

export interface AlgorithmParams {
  learningRate: number;
  explorationRate: number;
  discountFactor: number;
}

export interface GridWorldCell {
  x: number;
  y: number;
  type: "empty" | "obstacle" | "goal" | "start";
  reward: number;
}

export interface GridWorldState {
  agentX: number;
  agentY: number;
}

export interface CartPoleState {
  position: number;
  velocity: number;
  angle: number;
  angularVelocity: number;
}

export interface MountainCarState {
  position: number;
  velocity: number;
}

export interface EnvironmentConfig {
  gridSize?: number;
  obstacles?: { x: number, y: number }[];
  goalPosition?: { x: number, y: number };
  startPosition?: { x: number, y: number };
  gravity?: number;
  maxSteps?: number;
  successThreshold?: number;
}

export interface RLEnvironment {
  reset(): State;
  step(action: Action): StepResult;
  getActions(): Action[];
  getState(): State;
  render(context: CanvasRenderingContext2D): void;
  getStateKey(state: State): string;
}

export interface RLAlgorithmInterface {
  reset(): void;
  selectAction(state: State): Action;
  update(state: State, action: Action, reward: number, nextState: State, done: boolean): void;
  setParams(params: AlgorithmParams): void;
  getQValues(): QValues;
}
