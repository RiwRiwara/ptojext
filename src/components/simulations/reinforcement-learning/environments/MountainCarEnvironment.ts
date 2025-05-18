import { 
  RLEnvironment, 
  State, 
  Action, 
  StepResult, 
  MountainCarState, 
  EnvironmentConfig 
} from '../types/reinforcement-learning-types';

export class MountainCarEnvironment implements RLEnvironment {
  private actions: Action[];
  private state: MountainCarState;
  private maxSteps: number;
  private currentStep: number;
  private minPosition: number = -1.2;
  private maxPosition: number = 0.6;
  private maxSpeed: number = 0.07;
  private goalPosition: number = 0.5;
  private gravity: number;
  private successThreshold: number;

  constructor(config: EnvironmentConfig = {}) {
    this.gravity = config.gravity || 0.0025;
    this.maxSteps = config.maxSteps || 200;
    this.successThreshold = config.successThreshold || -110;
    this.currentStep = 0;
    
    // Actions: 0: Push left, 1: No push, 2: Push right
    this.actions = [
      { id: 0, name: 'left' },
      { id: 1, name: 'neutral' },
      { id: 2, name: 'right' }
    ];
    
    this.state = {
      position: 0.0,
      velocity: 0.0
    };
  }

  reset(): State {
    this.state = {
      position: -0.5,
      velocity: 0.0
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
    
    return `${position},${velocity}`;
  }

  getActions(): Action[] {
    return this.actions;
  }

  step(action: Action): StepResult {
    const currentState = this.getState();
    this.currentStep++;

    // Extract current state
    let { position, velocity } = this.state;
    
    // Calculate force based on action (0=left, 1=none, 2=right)
    const force = action.id === 0 ? -1 : action.id === 2 ? 1 : 0;
    
    // Physics update
    velocity += force * 0.001 + Math.cos(3 * position) * (-this.gravity);
    velocity = Math.max(Math.min(velocity, this.maxSpeed), -this.maxSpeed);
    position += velocity;
    position = Math.max(Math.min(position, this.maxPosition), this.minPosition);
    
    // If car reaches min position and velocity < 0, reset velocity to 0
    if (position === this.minPosition && velocity < 0) {
      velocity = 0;
    }
    
    // Update the state
    this.state = {
      position,
      velocity
    };
    
    // Check if goal reached
    const isGoal = position >= this.goalPosition;
    
    // Determine if episode is done
    const isDone = isGoal || this.currentStep >= this.maxSteps;
    
    // Calculate reward
    // -1 for each step, 0 for reaching goal
    const reward = isGoal ? 0 : -1;
    
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
    
    // Define height function based on position
    const heightFunction = (x: number): number => {
      return Math.sin(3 * x) * 0.45 + 0.55;
    };
    
    // Scale parameters
    const worldWidth = this.maxPosition - this.minPosition;
    const scale = (width - 40) / worldWidth;
    const offsetX = 20 - this.minPosition * scale;
    const carSize = 20;
    
    // Clear background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    
    // Draw mountain
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    for (let screenX = 0; screenX < width; screenX += 5) {
      const worldX = (screenX - offsetX) / scale;
      const normalizedHeight = heightFunction(worldX);
      const screenY = height - normalizedHeight * (height * 0.8);
      ctx.lineTo(screenX, screenY);
    }
    
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = '#d1d5db';
    ctx.fill();
    
    // Draw goal flag
    const goalScreenX = this.goalPosition * scale + offsetX;
    const goalScreenY = height - heightFunction(this.goalPosition) * (height * 0.8);
    
    ctx.fillStyle = '#10b981'; // Green
    ctx.beginPath();
    const flagSize = 25;
    ctx.moveTo(goalScreenX, goalScreenY - flagSize);
    ctx.lineTo(goalScreenX, goalScreenY);
    ctx.lineTo(goalScreenX + flagSize * 0.7, goalScreenY - flagSize * 0.5);
    ctx.closePath();
    ctx.fill();
    
    // Draw car
    const carX = this.state.position * scale + offsetX;
    const carY = height - heightFunction(this.state.position) * (height * 0.8);
    
    // Shadow
    ctx.beginPath();
    ctx.ellipse(carX, carY + 5, carSize * 0.9, carSize * 0.25, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();
    
    // Car body
    ctx.beginPath();
    ctx.ellipse(carX, carY - carSize * 0.5, carSize * 0.9, carSize * 0.55, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444'; // Red
    ctx.fill();
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Wheels
    ctx.beginPath();
    ctx.arc(carX - carSize * 0.5, carY, carSize * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#1f2937';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(carX + carSize * 0.5, carY, carSize * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#1f2937';
    ctx.fill();
    
    // Draw information
    ctx.fillStyle = '#1f2937';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Position: ${this.state.position.toFixed(2)}`, 10, 20);
    ctx.fillText(`Velocity: ${this.state.velocity.toFixed(4)}`, 10, 40);
    ctx.fillText(`Step: ${this.currentStep}`, 10, 60);
  }
}
