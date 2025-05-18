import { 
  RLAlgorithmInterface, 
  State, 
  Action, 
  QValues,
  AlgorithmParams
} from '../types/reinforcement-learning-types';

interface DQNConfig {
  actions: Action[];
  learningRate: number;
  explorationRate: number;
  discountFactor: number;
  stateSize: number;
  batchSize?: number;
  memorySize?: number;
  targetUpdateFrequency?: number;
}

// Simple implementation of neural network for DQN
// In a real implementation, we would use a library like TensorFlow.js
class NeuralNetwork {
  private inputSize: number;
  private hiddenSize: number;
  private outputSize: number;
  private weights1: number[][];
  private weights2: number[][];
  private bias1: number[];
  private bias2: number[];
  private learningRate: number;

  constructor(inputSize: number, outputSize: number, learningRate: number) {
    this.inputSize = inputSize;
    this.hiddenSize = 24; // Simple hidden layer size
    this.outputSize = outputSize;
    this.learningRate = learningRate;

    // Initialize weights with small random values
    this.weights1 = this.initializeWeights(this.inputSize, this.hiddenSize);
    this.weights2 = this.initializeWeights(this.hiddenSize, this.outputSize);
    this.bias1 = new Array(this.hiddenSize).fill(0);
    this.bias2 = new Array(this.outputSize).fill(0);
  }

  private initializeWeights(rows: number, cols: number): number[][] {
    const weights: number[][] = [];
    for (let i = 0; i < rows; i++) {
      weights[i] = [];
      for (let j = 0; j < cols; j++) {
        weights[i][j] = (Math.random() * 2 - 1) * 0.1; // Small random values between -0.1 and 0.1
      }
    }
    return weights;
  }

  private relu(x: number): number {
    return Math.max(0, x);
  }

  private reluDerivative(x: number): number {
    return x > 0 ? 1 : 0;
  }

  // Forward pass through the network
  predict(input: number[]): number[] {
    // First layer
    const hidden: number[] = new Array(this.hiddenSize).fill(0);
    for (let i = 0; i < this.hiddenSize; i++) {
      for (let j = 0; j < this.inputSize; j++) {
        hidden[i] += input[j] * this.weights1[j][i];
      }
      hidden[i] = this.relu(hidden[i] + this.bias1[i]);
    }

    // Output layer
    const output: number[] = new Array(this.outputSize).fill(0);
    for (let i = 0; i < this.outputSize; i++) {
      for (let j = 0; j < this.hiddenSize; j++) {
        output[i] += hidden[j] * this.weights2[j][i];
      }
      output[i] += this.bias2[i]; // Linear activation for output layer
    }

    return output;
  }

  // Simple implementation of backpropagation
  train(input: number[], target: number[]): void {
    // Forward pass
    const hidden: number[] = new Array(this.hiddenSize).fill(0);
    for (let i = 0; i < this.hiddenSize; i++) {
      for (let j = 0; j < this.inputSize; j++) {
        hidden[i] += input[j] * this.weights1[j][i];
      }
      hidden[i] = this.relu(hidden[i] + this.bias1[i]);
    }

    const output: number[] = new Array(this.outputSize).fill(0);
    for (let i = 0; i < this.outputSize; i++) {
      for (let j = 0; j < this.hiddenSize; j++) {
        output[i] += hidden[j] * this.weights2[j][i];
      }
      output[i] += this.bias2[i];
    }

    // Backpropagation
    // Output layer gradients
    const outputDelta: number[] = new Array(this.outputSize).fill(0);
    for (let i = 0; i < this.outputSize; i++) {
      outputDelta[i] = target[i] - output[i];
    }

    // Hidden layer gradients
    const hiddenDelta: number[] = new Array(this.hiddenSize).fill(0);
    for (let i = 0; i < this.hiddenSize; i++) {
      for (let j = 0; j < this.outputSize; j++) {
        hiddenDelta[i] += outputDelta[j] * this.weights2[i][j];
      }
      hiddenDelta[i] *= this.reluDerivative(hidden[i]);
    }

    // Update weights and biases
    // Output layer weights
    for (let i = 0; i < this.hiddenSize; i++) {
      for (let j = 0; j < this.outputSize; j++) {
        this.weights2[i][j] += this.learningRate * outputDelta[j] * hidden[i];
      }
    }

    // Output layer bias
    for (let i = 0; i < this.outputSize; i++) {
      this.bias2[i] += this.learningRate * outputDelta[i];
    }

    // Hidden layer weights
    for (let i = 0; i < this.inputSize; i++) {
      for (let j = 0; j < this.hiddenSize; j++) {
        this.weights1[i][j] += this.learningRate * hiddenDelta[j] * input[i];
      }
    }

    // Hidden layer bias
    for (let i = 0; i < this.hiddenSize; i++) {
      this.bias1[i] += this.learningRate * hiddenDelta[i];
    }
  }

  // Copy weights and biases from another network
  copyFrom(sourceNetwork: NeuralNetwork): void {
    for (let i = 0; i < this.inputSize; i++) {
      for (let j = 0; j < this.hiddenSize; j++) {
        this.weights1[i][j] = sourceNetwork.weights1[i][j];
      }
    }

    for (let i = 0; i < this.hiddenSize; i++) {
      for (let j = 0; j < this.outputSize; j++) {
        this.weights2[i][j] = sourceNetwork.weights2[i][j];
      }
    }

    for (let i = 0; i < this.hiddenSize; i++) {
      this.bias1[i] = sourceNetwork.bias1[i];
    }

    for (let i = 0; i < this.outputSize; i++) {
      this.bias2[i] = sourceNetwork.bias2[i];
    }
  }

  setLearningRate(learningRate: number): void {
    this.learningRate = learningRate;
  }
}

// Experience replay memory for DQN
interface Experience {
  state: number[];
  action: number;
  reward: number;
  nextState: number[];
  done: boolean;
}

class ReplayMemory {
  private capacity: number;
  private memory: Experience[];
  private position: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.memory = [];
    this.position = 0;
  }

  push(experience: Experience): void {
    if (this.memory.length < this.capacity) {
      this.memory.push(experience);
    } else {
      this.memory[this.position] = experience;
    }
    this.position = (this.position + 1) % this.capacity;
  }

  sample(batchSize: number): Experience[] {
    const sampleSize = Math.min(batchSize, this.memory.length);
    const batch: Experience[] = [];
    
    // Sample random experiences
    for (let i = 0; i < sampleSize; i++) {
      const index = Math.floor(Math.random() * this.memory.length);
      batch.push(this.memory[index]);
    }
    
    return batch;
  }

  size(): number {
    return this.memory.length;
  }

  clear(): void {
    this.memory = [];
    this.position = 0;
  }
}

export class DQNAlgorithm implements RLAlgorithmInterface {
  private actions: Action[];
  private qValues: QValues;
  private learningRate: number;
  private explorationRate: number;
  private discountFactor: number;
  private stateSize: number;
  private batchSize: number;
  private memory: ReplayMemory;
  private network: NeuralNetwork;
  private targetNetwork: NeuralNetwork;
  private updateCounter: number;
  private targetUpdateFrequency: number;

  constructor(config: DQNConfig) {
    this.actions = config.actions;
    this.learningRate = config.learningRate;
    this.explorationRate = config.explorationRate;
    this.discountFactor = config.discountFactor;
    this.stateSize = config.stateSize;
    this.batchSize = config.batchSize || 32;
    this.qValues = {};
    
    // Initialize replay memory
    const memorySize = config.memorySize || 10000;
    this.memory = new ReplayMemory(memorySize);
    
    // Initialize networks
    this.network = new NeuralNetwork(this.stateSize, this.actions.length, this.learningRate);
    this.targetNetwork = new NeuralNetwork(this.stateSize, this.actions.length, this.learningRate);
    this.targetNetwork.copyFrom(this.network);
    
    // Setup target network update frequency
    this.updateCounter = 0;
    this.targetUpdateFrequency = config.targetUpdateFrequency || 100;
  }

  reset(): void {
    this.qValues = {};
    this.memory.clear();
    this.updateCounter = 0;
    
    // Re-initialize networks
    this.network = new NeuralNetwork(this.stateSize, this.actions.length, this.learningRate);
    this.targetNetwork = new NeuralNetwork(this.stateSize, this.actions.length, this.learningRate);
    this.targetNetwork.copyFrom(this.network);
  }

  private stateToArray(state: State): number[] {
    return Object.values(state);
  }

  selectAction(state: State): Action {
    const stateArray = this.stateToArray(state);
    
    // Exploration: random action with probability explorationRate
    if (Math.random() < this.explorationRate) {
      const randomIndex = Math.floor(Math.random() * this.actions.length);
      return this.actions[randomIndex];
    }
    
    // Exploitation: best action based on network prediction
    const qValues = this.network.predict(stateArray);
    
    // Find action with highest Q-value
    let bestActionIndex = 0;
    let bestValue = qValues[0];
    
    for (let i = 1; i < qValues.length; i++) {
      if (qValues[i] > bestValue) {
        bestValue = qValues[i];
        bestActionIndex = i;
      }
    }
    
    return this.actions[bestActionIndex];
  }

  update(state: State, action: Action, reward: number, nextState: State, done: boolean): void {
    const stateArray = this.stateToArray(state);
    const nextStateArray = this.stateToArray(nextState);
    
    // Store experience in replay memory
    this.memory.push({
      state: stateArray,
      action: action.id,
      reward,
      nextState: nextStateArray,
      done
    });
    
    // Only train if we have enough samples
    if (this.memory.size() >= this.batchSize) {
      this.trainNetwork();
    }
    
    // Update target network periodically
    this.updateCounter++;
    if (this.updateCounter % this.targetUpdateFrequency === 0) {
      this.targetNetwork.copyFrom(this.network);
    }
    
    // Also update Q-values dictionary for compatibility with visualization
    const stateKey = this.getStateKey(state);
    if (!this.qValues[stateKey]) {
      this.qValues[stateKey] = {};
    }
    
    const qValues = this.network.predict(stateArray);
    for (let i = 0; i < this.actions.length; i++) {
      this.qValues[stateKey][this.actions[i].id] = qValues[i];
    }
  }

  private trainNetwork(): void {
    const batch = this.memory.sample(this.batchSize);
    
    for (const experience of batch) {
      const { state, action, reward, nextState, done } = experience;
      
      // Current Q-values for the state
      const currentQValues = this.network.predict(state);
      
      // Target Q-values
      const targetQValues = [...currentQValues];
      
      if (done) {
        // If done, the target is just the reward
        targetQValues[action] = reward;
      } else {
        // Otherwise, the target includes the discounted future reward
        const nextQValues = this.targetNetwork.predict(nextState);
        const maxNextQ = Math.max(...nextQValues);
        targetQValues[action] = reward + this.discountFactor * maxNextQ;
      }
      
      // Train the network
      this.network.train(state, targetQValues);
    }
  }

  setParams(params: AlgorithmParams): void {
    this.learningRate = params.learningRate;
    this.explorationRate = params.explorationRate;
    this.discountFactor = params.discountFactor;
    
    // Update network learning rate
    this.network.setLearningRate(this.learningRate);
    this.targetNetwork.setLearningRate(this.learningRate);
  }

  getQValues(): QValues {
    return this.qValues;
  }

  private getStateKey(state: State): string {
    return Object.values(state).join(',');
  }
}
