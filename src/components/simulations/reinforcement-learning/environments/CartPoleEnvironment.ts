import { 
  RLEnvironment, 
  State, 
  Action, 
  StepResult, 
  CartPoleState, 
  EnvironmentConfig 
} from '../types/reinforcement-learning-types';

export class CartPoleEnvironment implements RLEnvironment {
  private actions: Action[];
  private state: CartPoleState;
  private maxSteps: number;
  private currentStep: number;
  private gravity: number = 9.8;
  private cartMass: number = 1.0;
  private poleMass: number = 0.1;
  private totalMass: number;
  private poleLength: number = 0.5;
  private forceMag: number = 10.0;
  private tau: number = 0.02; // seconds between state updates
  private thetaThresholdRadians: number = 12 * 2 * Math.PI / 360;
  private xThreshold: number = 2.4;
  private successThreshold: number;

  constructor(config: EnvironmentConfig = {}) {
    this.totalMass = this.cartMass + this.poleMass;
    this.maxSteps = config.maxSteps || 200;
    this.successThreshold = config.successThreshold || 195;
    this.currentStep = 0;
    
    // Actions: 0: Push cart to the left, 1: Push cart to the right
    this.actions = [
      { id: 0, name: 'left' },
      { id: 1, name: 'right' }
    ];
    
    this.state = {
      position: 0.0,
      velocity: 0.0,
      angle: 0.0,
      angularVelocity: 0.0
    };
  }

  reset(): State {
    this.state = {
      position: 0.0,
      velocity: 0.0,
      angle: (Math.random() - 0.5) * 0.05,
      angularVelocity: (Math.random() - 0.5) * 0.05
    };
    this.currentStep = 0;
    return this.getState();
  }

  getState(): State {
    return { ...this.state };
  }

  getStateKey(state: State): string {
    // Use a discrete representation for the continuous state
    const position = Math.round(state.position * 100) / 100;
    const velocity = Math.round(state.velocity * 100) / 100;
    const angle = Math.round(state.angle * 100) / 100;
    const angularVelocity = Math.round(state.angularVelocity * 100) / 100;
    
    return `${position},${velocity},${angle},${angularVelocity}`;
  }

  getActions(): Action[] {
    return this.actions;
  }

  step(action: Action): StepResult {
    const currentState = this.getState();
    this.currentStep++;

    // Get forces based on action
    const force = action.id === 1 ? this.forceMag : -this.forceMag;
    
    // Extract current state
    let { position, velocity, angle, angularVelocity } = this.state;
    
    // Physics update (simplified)
    const cosTheta = Math.cos(angle);
    const sinTheta = Math.sin(angle);
    
    const temp = (
      force + this.poleMass * this.poleLength * angularVelocity * angularVelocity * sinTheta
    ) / this.totalMass;
    
    const thetaAcc = (this.gravity * sinTheta - cosTheta * temp) / (
      this.poleLength * (4.0 / 3.0 - this.poleMass * cosTheta * cosTheta / this.totalMass)
    );
    
    const xAcc = temp - this.poleMass * this.poleLength * thetaAcc * cosTheta / this.totalMass;
    
    // Update state with Euler integration
    position += this.tau * velocity;
    velocity += this.tau * xAcc;
    angle += this.tau * angularVelocity;
    angularVelocity += this.tau * thetaAcc;
    
    // Update the state
    this.state = {
      position,
      velocity,
      angle,
      angularVelocity
    };
    
    // Check termination conditions
    const isTerminated = 
      position < -this.xThreshold ||
      position > this.xThreshold ||
      angle < -this.thetaThresholdRadians ||
      angle > this.thetaThresholdRadians;
    
    // Determine if episode is done
    const isDone = isTerminated || this.currentStep >= this.maxSteps;
    
    // Calculate reward
    let reward = 1.0;
    if (isTerminated) {
      reward = 0.0;
    }
    
    return {
      state: currentState,
      action,
      reward,
      nextState: this.getState(),
      done: isDone,
      episode: 0, // This will be updated by the hook
      totalReward: 0 // This will be updated by the hook
    };
  }

  render(ctx: CanvasRenderingContext2D): void {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    // Scale coordinates to canvas
    const worldWidth = this.xThreshold * 2;
    const scale = width / worldWidth;
    const cartWidth = 50;
    const cartHeight = 30;
    const poleWidth = 10;
    const axleRadius = 6;
    
    // Calculate positions
    const cartX = width / 2 + this.state.position * scale;
    const cartY = height * 0.6;
    
    // Draw track
    ctx.beginPath();
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.moveTo(0, cartY + cartHeight / 2);
    ctx.lineTo(width, cartY + cartHeight / 2);
    ctx.stroke();
    
    // Draw cart
    ctx.fillStyle = '#3b82f6';
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(cartX - cartWidth / 2, cartY - cartHeight / 2, cartWidth, cartHeight);
    ctx.fill();
    ctx.stroke();
    
    // Draw pole
    const poleLength = this.poleLength * scale * 2;
    const poleEndX = cartX + Math.sin(this.state.angle) * poleLength;
    const poleEndY = cartY - Math.cos(this.state.angle) * poleLength;
    
    ctx.beginPath();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = poleWidth;
    ctx.moveTo(cartX, cartY);
    ctx.lineTo(poleEndX, poleEndY);
    ctx.stroke();
    
    // Draw axle
    ctx.beginPath();
    ctx.fillStyle = '#9ca3af';
    ctx.arc(cartX, cartY, axleRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw information
    ctx.fillStyle = '#1f2937';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Position: ${this.state.position.toFixed(2)}`, 10, 20);
    ctx.fillText(`Angle: ${(this.state.angle * 180 / Math.PI).toFixed(2)}°`, 10, 40);
    ctx.fillText(`Step: ${this.currentStep}`, 10, 60);
  }
}
